// Classe-base de todos os inimigos.
// Todos usam o mesmo padrão: x, y, largura, altura, vida e derrotado.
export class Enemy {

  // Baseado no código em player.js

  imgWidth = 0;           // Largura de cada frame na imagem original
  imgHeight = 0;          // Altura de cada frame na imagem original
  frameX = 0;             // Coluna atual da animação (0, 1, 2...)
  frameY = 0;             // Linha atual da animação (ex: 0 para parado, 1 para andar)
  contadorFrames = 0;     // Controla a velocidade da troca de frames
  velocidadeAnimacao = 5; // Quanto menor, mais rápida é a animação
  movendo = true;
  gravidade = 0.4;

  constructor({ x, y, largura = 32, altura = 32, imgskin, vida = 1, velocidade = 40, frames_totaisX, frames_totaisY } = {}) {
    this.largura = largura;
    this.altura = altura;
    this.x = x;
    this.y = y - this.altura;

    this.img = imgskin;
    this.vida = vida;
    this.velocidade = velocidade;
    this.derrotado = false;

    this.frames_totaisX = frames_totaisX;
    this.frames_totaisY = frames_totaisY;

    // Otimização: Calcula o tamanho do frame assim que a imagem carregar

    if (this.img) {
      const calcularFrames = () => 
      {
        this.imgWidth = this.img.naturalWidth / frames_totaisX;
        this.imgHeight = this.img.naturalHeight / frames_totaisY;
      };

      if (this.img.complete && this.img.naturalWidth > 0) 
      {
        calcularFrames();
      } 
      else 
      {
        this.img.addEventListener("load", calcularFrames, { once: true });
      }
    }
  }

  get vivo() {
    return !this.derrotado && this.vida > 0;
  }

  receberDano() {
    this.vida -= 1;
    if (this.vida <= 0) {
      this.derrotado = true;
    }
  }

  update(canvas) {
    // Cada tipo de inimigo implementa seu próprio comportamento.
  } 

  draw(ctx) {

    if (!this.imgWidth || !this.imgHeight) return; // Evita desenhar sem as dimensões

    ctx.drawImage
    (
    this.img, 
    this.frameX * this.imgWidth,  
    this.frameY * this.imgHeight, 
    this.imgWidth,                
    this.imgHeight,               
    this.x,                
    this.y,                
    this.largura,                   
    this.altura                   
    );
  }
}
