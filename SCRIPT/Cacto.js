import { Enemy } from "./Enemy.js";

export class Cacto extends Enemy {
  constructor({ x, y, imgskin, direcao = 1 } = {}) {
    super({
      x,
      y,
      imgskin: imgskin,
      largura: 32,
      altura: 64,
      vida: 3,
      velocidade: 0,
      frames_totaisX: 4,
      frames_totaisY: 6
    });

    this.cabecas = this.vida;
    this.maxCabecas = 3;
    this.direcao = direcao;
    this.vivo = true;

    this.relogioCrescimento = 0;
    this.relogioTiro = 0;
  }

  receberDano(quantidade = 1) {
    if (!this.vivo) return false;

    this.cabecas = Math.max(0, this.cabecas - quantidade);
    this.vida = this.cabecas;

    if (this.cabecas === 0) {
      this.derrotado = true;
    }

    return true;
  }

  update(canvas) {
    if (!this.vivo) return;

    // Código de queda

    this.velocidadeY += this.gravidade;
    this.y += this.velocidadeY;

    if (this.y + this.altura >= canvas.height) {
      this.y = canvas.height - this.altura;
      this.velocidadeY = 0;
    }

    /*// Cria uma cabeça a cada 5 segundos, até o máximo de 3.
    this.relogioCrescimento += dt;

    if (this.relogioCrescimento >= 5) {
      this.relogioCrescimento = 0;

      if (this.cabecas < this.maxCabecas) {
        this.cabecas++;
        this.vida = this.cabecas;
      }
    }

    // Dispara na direção do jogador a cada 1,8 segundo.
    this.relogioTiro += dt;

    if (this.relogioTiro >= 1.8) {
      this.relogioTiro = 0;

      const centroCacto = this.x + this.largura / 2;
      const centroJogador =
        jogo.jogador.x + jogo.jogador.largura / 2;

      const direcao = centroJogador < centroCacto ? -1 : 1;

      jogo.projeteisInimigos.push({
        x: direcao === -1
          ? this.x - 10
          : this.x + this.largura,
        y: this.y + 28,
        largura: 10,
        altura: 6,
        velocidade: 230 * direcao,
        dano: 1,
        origem: "cacto"
      });
    }*/

    if (this.cabecas === 1) {
      this.frameY = this.direcao === 1 ? 5 : 2;
    }
    else if (this.cabecas === 2) {
      this.frameY = this.direcao === 1 ? 4 : 1;
    }
    else if (this.cabecas === 3) {
      this.frameY = this.direcao === 1 ? 3 : 0;
    }
    this.velocidadeAnimacao = 15;
    this.contadorFrames++;
    let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
    this.frameX = frameCalculado % this.frames_totaisX;
  }
}