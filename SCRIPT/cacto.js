import { Enemy } from "./enemy.js";
import { projecteisInimigos } from "./game.js";

export class Cacto extends Enemy {
  constructor({ x, y, imgskin, direcao = 1 } = {}) {
    super({
      x,
      y,
      imgskin: imgskin,
      largura: 64,
      altura: 64,
      vida: 3,
      velocidade: 0,
      frames_totaisX: 4,
      frames_totaisY: 6
    });

    this.velocidadeX = 0;
    this.velocidadeY = 0;
    this.cabecas = this.vida;
    this.maxCabecas = 3;
    this.direcao = direcao;
    this.vivo = true;

    this.framesParaCura = 300;
    this.framesParaTiroSup = 150;
    this.framesParaTiroMed = 120;
    this.framesParaTiroBai = 90;
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

  update(canvas, jogador, jogador2, p2) {

    // Calcula o jogador mais próximo e faz o cacto olhar pra ele

    if (p2 === true) {
      const distanciaJ1 = Math.abs(jogador.posicaoX - this.x);
      const distanciaJ2 = Math.abs(jogador2.posicaoX - this.x);

      const jogadorMaisProximo = (distanciaJ1 <= distanciaJ2) ? jogador : jogador2;

      this.direcao = this.x < jogadorMaisProximo.posicaoX ? 1 : -1;

    } else {
      this.direcao = this.x < jogador.posicaoX ? 1 : -1;
    }

    // Faz o cacto cair se estiver no ar

    this.velocidadeY += this.gravidade;
    this.y += this.velocidadeY;

    if (this.y + this.altura >= canvas.height) {
      this.y = canvas.height - this.altura;
      this.velocidadeY = 0;
    }

    // Cria uma cabeça a cada 5 segundos, até o máximo de 3.

    this.framesParaCura--;

    if (this.framesParaCura <= 0) {
      this.framesParaCura = 300;

      if (this.cabecas < this.maxCabecas) {
        this.cabecas++;
        this.vida = this.cabecas;
      }
    }

    // Dispara uma quantidade de balas igual a quantidade de cabeças do cacto

    const centroCacto = this.x + this.largura / 2;

    if (this.cabecas >= 1) {
      this.framesParaTiroBai--;

      if (this.framesParaTiroBai <= 0) {
        projecteisInimigos.push({
          x: this.direcao === -1 ? centroCacto - 10 : centroCacto + 10,
          y: this.y + 48,
          direcao: this.direcao,
          velocidade: 7,
          largura: 10,
          altura: 4,
        });
        this.framesParaTiroBai = 90; 
      }
    }

    if (this.cabecas >= 2) {
      this.framesParaTiroMed--;

      if (this.framesParaTiroMed <= 0) {
        projecteisInimigos.push({
          x: this.direcao === -1 ? centroCacto - 10 : centroCacto + 10,
          y: this.y + 34,
          direcao: this.direcao,
          velocidade: 7,
          largura: 10,
          altura: 4,
        });
        this.framesParaTiroMed = 120; 
      }
    }

    if (this.cabecas >= 3) {
      this.framesParaTiroSup--;

      if (this.framesParaTiroSup <= 0) {
        projecteisInimigos.push({
          x: this.direcao === -1 ? centroCacto - 10 : centroCacto + 10,
          y: this.y + 20,
          direcao: this.direcao,
          velocidade: 7,
          largura: 10,
          altura: 4,
        });
        this.framesParaTiroSup = 150; 
      }
    }

    // Escolhe o sprite com base na quantidade de cabeças e na direção

    if (this.cabecas === 1) {
      this.frameY = this.direcao === 1 ? 5 : 2;
    }
    else if (this.cabecas === 2) {
      this.frameY = this.direcao === 1 ? 4 : 1;
    }
    else if (this.cabecas === 3) {
      this.frameY = this.direcao === 1 ? 3 : 0;
    }

    // Anima o cacto

    this.velocidadeAnimacao = 15;
    this.contadorFrames++;
    let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
    this.frameX = frameCalculado % this.frames_totaisX;
    }
  }
