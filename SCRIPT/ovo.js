export class Ovo {
  constructor({ x, y, imgskin, largura = 32, altura = 32, frameX = 0, frameY = 3, onHatch }) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.img = imgskin;
    
    this.tempoFrames = 200;
    this.chocado = false;

    this.frameX = frameX;
    this.frameY = frameY;

    this.onHatch = onHatch;
  }

  update() {
    if (this.chocado) return;

    this.tempoFrames--;

    if (this.tempoFrames <= 0) {
      this.chocado = true;

      if (typeof this.onHatch === 'function') {
        this.onHatch(this);
      }
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