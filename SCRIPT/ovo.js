import { IMGS } from './assetloader.js';
import { contaTipoInimigo } from './game.js';

export class Ovo {
  constructor({ x, y, imgskin, largura = 32, altura = 32, frameX = 0, frameY = 3 }) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.img = imgskin;
    
    this.tempoFrames = 200;
    this.chocado = false;

    this.frameX = frameX;
    this.frameY = frameY;
  }

  update(inimigosArray, inimigoClasse, C_WIDTH, C_HEIGHT) {
    if (this.chocado) return;

    this.tempoFrames--;

    if (this.tempoFrames <= 0) {

      const totalGalinhas = contaTipoInimigo(inimigosArray, inimigoClasse);

      if (totalGalinhas >= 8) return;

      this.chocado = true;

      inimigosArray.push(
        new inimigoClasse({
          x: Math.max(0, Math.min(C_WIDTH- 32, this.x - 10)),
          y: C_HEIGHT - 32,
          direcao: Math.random() < 0.5 ? -1 : 1,
          imgskin: IMGS.galinha
        })
      );
    }
  }

  draw(ctx) {
    if (!this.img) return;

    const imgWidth = this.img.naturalWidth / 4;
    const imgHeight = this.img.naturalHeight / 4;

    ctx.drawImage(
      this.img,
      this.frameX * imgWidth,
      this.frameY * imgHeight,
      imgWidth,
      imgHeight,
      this.x,
      this.y,
      this.largura,
      this.altura
    );
  }
}