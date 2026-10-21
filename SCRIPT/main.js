import { Galinha } from "./Galinha.js";
import { Player } from "./Player.js";
import { processarColisoes } from "./colisoes.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const jogo = {
  largura: canvas.width,
  altura: canvas.height,
  chaoY: 470,
  gravidade: 1200,
  jogador: null,
  inimigos: [],
  ovos: [],
  projeteis: [],
  tempoSpawn: 0,
  gameOver: false,
  vitoria: false
};

const teclas = new Set();

function reiniciar() {
  jogo.jogador = new Player(100, jogo.chaoY - 42);
  jogo.inimigos = [new Galinha({ x: 600, y: jogo.chaoY - 30, direcao: -1 })];
  jogo.ovos = [];
  jogo.projeteis = [];
  jogo.tempoSpawn = 0;
  jogo.gameOver = false;
  jogo.vitoria = false;
}
reiniciar();

window.addEventListener("keydown", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) e.preventDefault();
  teclas.add(key);
  if (key === "r") reiniciar();
});
window.addEventListener("keyup", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  teclas.delete(key);
});
window.addEventListener("blur", () => teclas.clear());

function atualizarOvos(dt) {
  for (let i = jogo.ovos.length - 1; i >= 0; i--) {
    const ovo = jogo.ovos[i];
    ovo.tempo -= dt;
    if (ovo.tempo <= 0 && !ovo.chocado) {
      ovo.chocado = true;
      // A nova galinha aparece no local do ovo.
      jogo.inimigos.push(new Galinha({
        x: Math.max(0, Math.min(jogo.largura - 34, ovo.x - 10)),
        y: jogo.chaoY - 30,
        direcao: Math.random() < 0.5 ? -1 : 1
      }));
      jogo.ovos.splice(i, 1);
    }
  }
}

function atualizar(dt) {
  if (jogo.gameOver || jogo.vitoria) return;

  jogo.jogador.atualizar(dt, teclas, jogo);
  for (const inimigo of jogo.inimigos) inimigo.atualizar(dt, jogo);
  atualizarOvos(dt);

  for (let i = jogo.projeteis.length - 1; i >= 0; i--) {
    const p = jogo.projeteis[i];
    p.x += p.velocidade * dt;
    if (p.x > jogo.largura || p.x + p.largura < 0) jogo.projeteis.splice(i, 1);
  }

  processarColisoes(jogo);
  jogo.inimigos = jogo.inimigos.filter(inimigo => inimigo.vivo);
  if (jogo.jogador.vida <= 0) jogo.gameOver = true;
  if (jogo.inimigos.length === 0 && jogo.ovos.length === 0) jogo.vitoria = true;
}

function desenharFundo() {
  const grad = ctx.createLinearGradient(0, 0, 0, jogo.altura);
  grad.addColorStop(0, "#90cdf4");
  grad.addColorStop(1, "#ebf8ff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, jogo.largura, jogo.altura);

  // Nuvens simples
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  for (const [x, y] of [[120, 80], [390, 120], [760, 65]]) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 24, y - 8, 28, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#68a84f";
  ctx.fillRect(0, jogo.chaoY, jogo.largura, jogo.altura - jogo.chaoY);
  ctx.fillStyle = "#387a35";
  ctx.fillRect(0, jogo.chaoY, jogo.largura, 8);
}

function desenharOvos() {
  for (const ovo of jogo.ovos) {
    ctx.fillStyle = "#fffaf0";
    ctx.beginPath();
    ctx.ellipse(ovo.x + ovo.largura / 2, ovo.y + ovo.altura / 2, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e0";
    ctx.stroke();
  }
}

function desenharProjeteis() {
  ctx.fillStyle = "#e53e3e";
  for (const p of jogo.projeteis) ctx.fillRect(p.x, p.y, p.largura, p.altura);
}

function desenharInterface() {
  ctx.fillStyle = "#1a202c";
  ctx.font = "bold 20px system-ui";
  ctx.fillText(`Vida: ${jogo.jogador.vida}`, 18, 30);
  ctx.font = "15px system-ui";
  ctx.fillText(`Galinhas: ${jogo.inimigos.length}  |  Ovos: ${jogo.ovos.length}`, 18, 54);
  if (jogo.gameOver || jogo.vitoria) {
    ctx.fillStyle = "rgba(26,32,44,0.78)";
    ctx.fillRect(0, 0, jogo.largura, jogo.altura);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 42px system-ui";
    ctx.fillText(jogo.gameOver ? "Fim de jogo!" : "Você venceu!", jogo.largura / 2, jogo.altura / 2 - 12);
    ctx.font = "20px system-ui";
    ctx.fillText("Pressione R para reiniciar", jogo.largura / 2, jogo.altura / 2 + 30);
    ctx.textAlign = "left";
  }
}

function desenhar() {
  desenharFundo();
  desenharOvos();
  for (const inimigo of jogo.inimigos) inimigo.desenhar(ctx);
  desenharProjeteis();
  jogo.jogador.desenhar(ctx);
  desenharInterface();
}

let anterior = performance.now();
function loop(agora) {
  const dt = Math.min((agora - anterior) / 1000, 0.033);
  anterior = agora;
  atualizar(dt);
  desenhar();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
