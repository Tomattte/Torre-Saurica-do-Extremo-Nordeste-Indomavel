import { Enemy } from "./Enemy.js";

// Galinha: anda pelo chão e coloca no máximo 2 ovos.
export class Galinha extends Enemy {
  constructor({ x, y, direcao = -1 } = {}) {
    super({
      x,
      y,
      largura: 32,
      altura: 32,
      vida: 2,
      velocidade: 42,
      frames_totaisX: 4,
      frames_totaisY: 5 
    });

    this.direcao = direcao;
    this.tempoParaOvo = 2.5;
    // Quantidade de ovos que esta galinha já colocou.
    this.ovosColocados = 0;

    // Limite de ovos por galinha.
    this.limiteOvos = 2;
  }

  update(canvas) {
    
    /*if (this.velocidade > 0) {
      this.x += this.velocidade * this.direcao;
      this.estaMovendo = true;
    } else {
      this.estaMovendo = false;
    }*/

    // Movimento horizontal.

    this.x += this.direcao * this.velocidade;

    // Inverte a direção nas bordas da área jogável.
    if (this.x < 0) {
      this.x = 0;
      this.direcao = 1;
    }

    if (this.x + this.largura > jogo.largura) {
      this.x = jogo.largura - this.largura;
      this.direcao = -1;
    }

    if (this.movendo === true) {
      this.frameY = this.viradoPra === 1 ? 3 : 2;
      this.velocidadeAnimacao = 15; // Ajuste da velocidade de animação para andar
      this.contadorFrames++;
      let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
      this.frameX = frameCalculado % this.framesAndar;    
    }

    // Só coloca ovos enquanto não atingir o limite.
    /*if (this.ovosColocados < this.limiteOvos) {
      this.tempoParaOvo -= dt;

      if (this.tempoParaOvo <= 0) {
        // Cria um ovo abaixo da galinha.
        jogo.ovos.push({
          x: this.x + this.largura / 2 - 7,
          y: this.y + this.altura,
          largura: 14,
          altura: 18,
          tempo: 1.2,
          chocado: false
        });

        // Registra a postura.
        this.ovosColocados++;

        // Reinicia o temporizador.
        this.tempoParaOvo = 2.5;
      }
    }*/
  }
}
