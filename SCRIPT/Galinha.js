import { Enemy } from "./enemy.js";
import { Ovo } from "./ovo.js";

export class Galinha extends Enemy {
  constructor({ x, y, imgskin, direcao = -1 } = {}) {
    super({
      x,
      y,
      largura: 32,
      altura: 32,
      imgskin: imgskin,
      vida: 2,
      velocidade: 3,
      frames_totaisX: 4,
      frames_totaisY: 4 
    });

    this.velocidadeX = 0;
    this.velocidadeY = 0;
    this.direcao = direcao;
    this.framesParaOvo = 150;
    this.ovosColocados = 0;
    this.limiteOvos = 2;
  }

  gerarOvos() {
    if (this.ovosColocados < this.limiteOvos) {
      this.framesParaOvo--;

      if (this.framesParaOvo <= 0) {
        const novoOvo = new Ovo({
          x: this.x,
          y: this.y,
          largura: 32,
          altura: 32,
          imgskin: this.img,
        });

        this.ovosColocados++;
        this.framesParaOvo = 150; 
        
        return novoOvo;
      }
    }
    return null;
  }

  update(canvas) {
    
    if (this.direcao === 1) {
      this.velocidadeX = this.velocidade;
    } else if (this.direcao === -1) {
      this.velocidadeX = -this.velocidade;
    }

    this.x += this.velocidadeX;

    this.velocidadeY += this.gravidade;
    this.y += this.velocidadeY;

    if (this.x < 0) {
      this.x = 0;
      this.direcao = 1;
    }

    if (this.x + this.largura > canvas.width) {
      this.x = canvas.width - this.largura;
      this.direcao = -1;
    }

    if (this.y + this.altura >= canvas.height) {
      this.y = canvas.height - this.altura;
      this.velocidadeY = 0;
    }

    this.frameY = this.direcao === 1 ? 2 : 1;
    this.velocidadeAnimacao = 15;
    this.contadorFrames++;
    let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
    this.frameX = frameCalculado % this.frames_totaisX;

    const ovoGerado = this.gerarOvos();
    if (ovoGerado) {
      this.ovoPendente = ovoGerado; 
    }
  }
}