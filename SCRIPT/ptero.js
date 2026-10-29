import { Enemy } from "./enemy.js";

export class Ptero extends Enemy {
  constructor({ x, y, imgskin, direcao = 1 } = {}) {
    super({
      x,
      y,
      imgskin: imgskin,
      largura: 64,
      altura: 64,
      vida: 2,
      frames_totaisX: 4,
      frames_totaisY: 4
    });

    this.velocidadeX = 0;
    this.velocidadeY = 0;
    this.direcao = direcao;

    // Estados: topo, rasante e retorno.

    this.estado = "topo";

    this.yTopo = y - this.altura;
    this.velocidadeTopo = 4;
    this.velocidadeRasante = 8;
    this.velocidadeRetorno = 2;

    this.alvoX = x;

    // Área de perigo.
    this.areaPerigo = 50;
  }

  update(canvas, jogador, jogador2, p2) {

    this.atualizaDano();

    //this.chaoY = jogo.chaoY;
    //this.larguraCenario = jogo.largura;

    const centroJogador = jogador.posicaoX + jogador.width / 2;
    const centroJogador2 = jogador2.posicaoX + jogador2.width / 2;
    const centroPtero = this.x + this.largura / 2;

    // 1. Patrulha no topo e detecta o jogador.

    if (this.estado === "topo") {

      if (this.direcao === 1) {
        this.velocidadeX = this.velocidadeTopo;
      } else if (this.direcao === -1) {
        this.velocidadeX = -this.velocidadeTopo;
      }

      this.x += this.velocidadeX;

      if (this.x < 0) {
        this.x = 0;
        this.direcao = 1;
      }

      if (this.x + this.largura > canvas.width) {
        this.x = canvas.width - this.largura;
        this.direcao = -1;
      }
      
      const estaAbaixo = jogador.posicaoY > this.y + this.altura;

      const dentroDoAlcance = Math.abs(centroJogador - centroPtero) <= this.areaPerigo / 2;

      if (estaAbaixo && dentroDoAlcance) {
        this.estado = "rasante";
        this.alvoX = centroJogador - this.largura / 2;
      }

      if (p2 === true) {
        const estaAbaixoP2 = jogador.posicaoY > this.y + this.altura;

        const dentroDoAlcanceP2 = Math.abs(centroJogador2 - centroPtero) <= this.areaPerigo / 2;

        if (estaAbaixoP2 && dentroDoAlcanceP2) {
          this.estado = "rasante";
          this.alvoX = centroJogador2 - this.largura / 2;
        }
      }
    }

    // 2. Mergulha em direção à posição do jogador.
    else if (this.estado === "rasante") {
      const alvoLimitado = Math.max(
        0,
        Math.min(
          canvas.width - this.largura,
          this.alvoX
        )
      );

      const diferencaX = alvoLimitado - this.x;
      const passoX = this.velocidadeRasante;

      this.x += Math.sign(diferencaX) * Math.min(Math.abs(diferencaX), passoX);

      this.y += this.velocidadeRasante;

      // Atingiu o chão: começa a subida.
      if (this.y + this.altura >= canvas.height) {
        this.y = canvas.height - this.altura;
        this.estado = "retorno";
      }
    }

    // 3. Volta lentamente ao topo.
    else if (this.estado === "retorno") {

      this.y -= this.velocidadeRetorno;

      if (this.y <= this.yTopo) {
        this.y = this.yTopo;
        this.estado = "topo";
      }
    }

    if (this.estado === "rasante") {
      this.frameY = this.direcao === 1 ? 2 : 3;
    } else {
      this.frameY = this.direcao === 1 ? 0 : 1;
    }

    this.velocidadeAnimacao = 15;
    this.contadorFrames++;
    let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
    this.frameX = frameCalculado % this.frames_totaisX;
  }
}