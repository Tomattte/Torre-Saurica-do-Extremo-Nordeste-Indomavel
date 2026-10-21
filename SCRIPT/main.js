import { Galinha } from "./Galinha.js";
import { Player } from "./Player.js";
import { processarColisoes } from "./colisoes.js";
import { Ptero } from "./ptero.js";
import { Cacto } from "./Cacto.js";

// Obtém o Canvas e seu contexto de desenho.
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Estado principal do jogo.
const jogo = {
  largura: canvas.width,
  altura: canvas.height,
  chaoY: 470,
  gravidade: 1200,

  jogador: null,
  inimigos: [],
  ovos: [],

  // Tiros disparados pelo jogador.
  projeteis: [],

  // Tiros disparados pelo Cacto e outros inimigos.
  projeteisInimigos: [],

  gameOver: false,
  vitoria: false
};

// Teclas atualmente pressionadas.
const teclas = new Set();

// Reinicia o jogo e recria seus objetos.
function reiniciar() {
  jogo.jogador = new Player(100, jogo.chaoY - 42);

  jogo.inimigos = [
    new Cacto({
      x: 790,
      y: jogo.chaoY - 58
    }),

    new Ptero({
      x: 350,
      y: 40,
      direcao: 1
    }),

    new Galinha({
      x: 600,
      y: jogo.chaoY - 30,
      direcao: -1
    })
  ];

  jogo.ovos = [];
  jogo.projeteis = [];
  jogo.projeteisInimigos = [];

  jogo.gameOver = false;
  jogo.vitoria = false;
}

// Inicializa o jogo.
reiniciar();

// Registra as teclas pressionadas.
window.addEventListener("keydown", (e) => {
  const key = e.key.length === 1
    ? e.key.toLowerCase()
    : e.key;

  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
    e.preventDefault();
  }

  teclas.add(key);

  if (key === "r") {
    reiniciar();
  }
});

// Registra quando as teclas são soltas.
window.addEventListener("keyup", (e) => {
  const key = e.key.length === 1
    ? e.key.toLowerCase()
    : e.key;

  teclas.delete(key);
});

// Evita que teclas permaneçam pressionadas ao trocar de janela.
window.addEventListener("blur", () => teclas.clear());

// Atualiza os ovos e cria galinhas quando eles chocam.
function atualizarOvos(dt) {
  for (let i = jogo.ovos.length - 1; i >= 0; i--) {
    const ovo = jogo.ovos[i];

    ovo.tempo -= dt;

    if (ovo.tempo <= 0 && !ovo.chocado) {
      jogo.inimigos.push(
        new Galinha({
          x: Math.max(
            0,
            Math.min(jogo.largura - 34, ovo.x - 10)
          ),
          y: jogo.chaoY - 30,
          direcao: Math.random() < 0.5 ? -1 : 1
        })
      );

      jogo.ovos.splice(i, 1);
    }
  }
}

// Atualiza toda a lógica do jogo.
function atualizar(dt) {
  // Não continua a lógica depois da vitória ou derrota.
  if (jogo.gameOver || jogo.vitoria) return;

  // Atualiza o jogador.
  jogo.jogador.atualizar(dt, teclas, jogo);

  // Cada inimigo controla seu próprio comportamento.
  // O Cacto cria seus disparos dentro do próprio Cacto.js.
  for (const inimigo of jogo.inimigos) {
    inimigo.atualizar(dt, jogo);
  }

  // Atualiza os ovos.
  atualizarOvos(dt);

  // Move os projéteis do jogador.
  for (let i = jogo.projeteis.length - 1; i >= 0; i--) {
    const p = jogo.projeteis[i];

    p.x += p.velocidade * dt;

    if (p.x > jogo.largura || p.x + p.largura < 0) {
      jogo.projeteis.splice(i, 1);
    }
  }

  // Move os projéteis inimigos.
  for (
    let i = jogo.projeteisInimigos.length - 1;
    i >= 0;
    i--
  ) {
    const p = jogo.projeteisInimigos[i];

    p.x += p.velocidade * dt;

    // Remove tiros que saíram da tela.
    if (p.x > jogo.largura || p.x + p.largura < 0) {
      jogo.projeteisInimigos.splice(i, 1);
    }
  }

  // Verifica tiros acertando inimigos e jogador.
  processarColisoes(jogo);

  // Remove inimigos derrotados.
  jogo.inimigos = jogo.inimigos.filter(
    inimigo => inimigo.vivo
  );
  // Verifica derrota.
  if (jogo.jogador.vida <= 0) {
    jogo.gameOver = true;
  }

  // Verifica vitória.
  if (jogo.inimigos.length === 0 && jogo.ovos.length === 0) {
    jogo.vitoria = true;
  }
}


// Desenha o fundo, o céu e o chão.
function desenharFundo() {
  const grad = ctx.createLinearGradient(
    0, 0, 0, jogo.altura
  );

  grad.addColorStop(0, "#90cdf4");
  grad.addColorStop(1, "#ebf8ff");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, jogo.largura, jogo.altura);

  // Nuvens decorativas.
  ctx.fillStyle = "rgba(255,255,255,0.75)";

  for (const [x, y] of [
    [120, 80],
    [390, 120],
    [760, 65]
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 24, y - 8, 28, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chão.
  ctx.fillStyle = "#68a84f";
  ctx.fillRect(
    0,
    jogo.chaoY,
    jogo.largura,
    jogo.altura - jogo.chaoY
  );

  ctx.fillStyle = "#387a35";
  ctx.fillRect(0, jogo.chaoY, jogo.largura, 8);
}

// Desenha os ovos.
function desenharOvos() {
  for (const ovo of jogo.ovos) {
    ctx.fillStyle = "#fffaf0";
    ctx.beginPath();

    ctx.ellipse(
      ovo.x + ovo.largura / 2,
      ovo.y + ovo.altura / 2,
      7,
      9,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();
    ctx.strokeStyle = "#cbd5e0";
    ctx.stroke();
  }
}

// Desenha os tiros do jogador e os dos inimigos.
function desenharProjeteis() {
  // Tiros do jogador.
  ctx.fillStyle = "#e53e3e";

  for (const p of jogo.projeteis) {
    ctx.fillRect(p.x, p.y, p.largura, p.altura);
  }

  // Tiros do Cacto e dos demais inimigos.
  ctx.fillStyle = "#1b8f34";

  for (const p of jogo.projeteisInimigos) {
    ctx.fillRect(p.x, p.y, p.largura, p.altura);
  }
}

// Desenha a interface, a vida e as mensagens finais.
function desenharInterface() {
  ctx.fillStyle = "#1a202c";
  ctx.font = "bold 20px system-ui";

  ctx.fillText(
    `Vida: ${jogo.jogador.vida}`,
    18,
    30
  );

  ctx.font = "15px system-ui";

  if (jogo.gameOver || jogo.vitoria) {
    ctx.fillStyle = "rgba(26,32,44,0.78)";
    ctx.fillRect(0, 0, jogo.largura, jogo.altura);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 42px system-ui";

    ctx.fillText(
      jogo.gameOver ? "Fim de jogo!" : "Você venceu!",
      jogo.largura / 2,
      jogo.altura / 2 - 12
    );

    ctx.font = "20px system-ui";

    ctx.fillText(
      "Pressione R para reiniciar",
      jogo.largura / 2,
      jogo.altura / 2 + 30
    );

    ctx.textAlign = "left";
  }
}

// Desenha todos os elementos do jogo.
function desenhar() {
  desenharFundo();
  desenharOvos();

  for (const inimigo of jogo.inimigos) {
    inimigo.desenhar(ctx);
  }

  desenharProjeteis();
  jogo.jogador.desenhar(ctx);
  desenharInterface();
}

// Loop principal, com delta time limitado para evitar saltos grandes.
let anterior = performance.now();

function loop(agora) {
  const dt = Math.min(
    (agora - anterior) / 1000,
    0.033
  );

  anterior = agora;

  atualizar(dt);
  desenhar();

  requestAnimationFrame(loop);
}

// Inicia a animação.
requestAnimationFrame(loop);
