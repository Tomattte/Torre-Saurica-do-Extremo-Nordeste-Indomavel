import { Enemy } from "./Enemy.js";

export class Ptero extends Enemy {
  constructor({ x = 350, y = 40, direcao = 1 } = {}) {
    super({
      x,
      y,
      largura: 32,
      altura: 32,
      vida: 3,
      velocidade: 70
    });

    this.direcao = direcao;

    // Estados: topo, rasante e retorno.
    this.estado = "topo";

    this.yTopo = y;
    this.velocidadeTopo = 100;
    this.velocidadeRasante = 320;
    this.velocidadeRetorno = 90;

    this.alvoX = x;
    this.jaAtingiuJogador = false;

    // Área de perigo.
    this.areaPerigo = 96;
    this.alturaPerigo = 500;
  }

  atualizar(dt, jogo) {
    if (!this.vivo) return;
    this.chaoY = jogo.chaoY;
    this.larguraCenario = jogo.largura;

    const jogador = jogo.jogador;
    const centroJogador = jogador.x + jogador.largura / 2;
    const centroPtero = this.x + this.largura / 2;

    // 1. Patrulha no topo e detecta o jogador.
    if (this.estado === "topo") {
      this.x += this.direcao * this.velocidadeTopo * dt;

      if (this.x <= 0) {
        this.x = 0;
        this.direcao = 1;
      }

      if (this.x + this.largura >= jogo.largura) {
        this.x = jogo.largura - this.largura;
        this.direcao = -1;
      }

      // O jogador precisa estar abaixo e dentro
      // do alcance horizontal de 500 pixels.
      const estaAbaixo =
        jogador.y > this.y + this.altura;

      const dentroDoAlcance =
        Math.abs(centroJogador - centroPtero) <=
        this.areaPerigo / 2;

      if (estaAbaixo && dentroDoAlcance) {
        this.estado = "rasante";
        this.alvoX = centroJogador - this.largura / 2;
        this.jaAtingiuJogador = false;
      }
    }

    // 2. Mergulha em direção à posição do jogador.
    else if (this.estado === "rasante") {
      const alvoLimitado = Math.max(
        0,
        Math.min(
          jogo.largura - this.largura,
          this.alvoX
        )
      );

      const diferencaX = alvoLimitado - this.x;
      const passoX = this.velocidadeRasante * dt;

      this.x += Math.sign(diferencaX) *
        Math.min(Math.abs(diferencaX), passoX);

      this.y += this.velocidadeRasante * dt;

      // Verifica contato com o jogador.
      const colidiu =
        this.x < jogador.x + jogador.largura &&
        this.x + this.largura > jogador.x &&
        this.y < jogador.y + jogador.altura &&
        this.y + this.altura > jogador.y;

      if (colidiu && !this.jaAtingiuJogador) {
        this.jaAtingiuJogador = true;

        // Usa o método de dano do jogador, se existir.
        if (typeof jogador.receberDano === "function") {
          jogador.receberDano(2);
        } else {
          jogador.vida = Math.max(0, jogador.vida - 2);
        }
      }

      // Atingiu o chão: começa a subida.
      if (this.y + this.altura >= jogo.chaoY) {
        this.y = jogo.chaoY - this.altura;
        this.estado = "retorno";
      }
    }

    // 3. Volta lentamente ao topo.
    else if (this.estado === "retorno") {
      this.y -= this.velocidadeRetorno * dt;

      // Pode continuar se deslocando horizontalmente.
      this.x += this.direcao * this.velocidadeRetorno * 0.4 * dt;

      if (this.x <= 0) {
        this.x = 0;
        this.direcao = 1;
      }

      if (this.x + this.largura >= jogo.largura) {
        this.x = jogo.largura - this.largura;
        this.direcao = -1;
      }

      if (this.y <= this.yTopo) {
        this.y = this.yTopo;
        this.estado = "topo";
      }
    }
  }

  desenhar(ctx) {
    if (!this.vivo) return;

    // Área de perigo exibida durante a patrulha.
   if (this.estado === "topo") {
  const larguraArea = Math.min(
    this.areaPerigo,
    this.larguraCenario
  );

  const inicioX = Math.max(
    0,
    Math.min(
      this.x + this.largura / 2 - larguraArea / 2,
      this.larguraCenario - larguraArea
    )
  );

  ctx.fillStyle = "rgba(229, 62, 62, 0.18)";
  ctx.fillRect(
    inicioX,
    this.chaoY - this.alturaPerigo,
    larguraArea,
    this.alturaPerigo
  );
}
    ctx.fillStyle = "#718096";
    ctx.beginPath();
    ctx.ellipse(
      this.x + 16,
      this.y + 17,
      12,
      8,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Asas.
    ctx.fillStyle = "#4a5568";
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 16);
    ctx.lineTo(this.x + 1, this.y + 5);
    ctx.lineTo(this.x + 5, this.y + 20);
    ctx.lineTo(this.x + 14, this.y + 23);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y + 16);
    ctx.lineTo(this.x + 31, this.y + 5);
    ctx.lineTo(this.x + 27, this.y + 20);
    ctx.lineTo(this.x + 18, this.y + 23);
    ctx.fill();

    // Cabeça e bico.
    ctx.fillStyle = "#a0aec0";
    ctx.beginPath();
    ctx.arc(this.x + 25, this.y + 13, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ed8936";
    ctx.beginPath();
    ctx.moveTo(this.x + 28, this.y + 13);
    ctx.lineTo(this.x + 32, this.y + 15);
    ctx.lineTo(this.x + 27, this.y + 16);
    ctx.fill();

    // Olho.
    ctx.fillStyle = "#1a202c";
    ctx.beginPath();
    ctx.arc(this.x + 26, this.y + 11, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Indicador de vida.
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(this.x, this.y - 7, 32, 4);

    ctx.fillStyle = "#e53e3e";
    ctx.fillRect(this.x, this.y - 7, 32 * (this.vida / 3), 4);
  }
}
