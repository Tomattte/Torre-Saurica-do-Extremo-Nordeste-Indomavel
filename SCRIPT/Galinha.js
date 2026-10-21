/*import { Enemy } from "./Enemy.js";

// Galinha: anda pelo chão e põe um ovo a cada 2,5 segundos.
// O ovo choca depois de 1,2 segundo e cria outra galinha.
export class Galinha extends Enemy {
  constructor({ x, y, direcao = -1 } = {}) {
    super({ x, y, largura: 34, altura: 30, vida: 2, velocidade: 42 });
    this.direcao = direcao;
    this.tempoParaOvo = 2.5;
    this.cor = "#fff7db";
    // Quantidade de ovos que esta galinha já colocou.
    this.ovosColocados = 0;
    // Limite de ovos por galinha.
    this.limiteOvos = 2;
  }

  atualizar(dt, jogo) {
    if (!this.vivo) return;

    // A galinha se movimenta e muda de direção nas bordas da área jogável.
    this.x += this.direcao * this.velocidade * dt;
    if (this.x < 0) {
      this.x = 0;
      this.direcao = 1;
    }
    /*if (this.x + this.largura > jogo.largura) {
      this.x = jogo.largura - this.largura;
      this.direcao = -1;
    }

    // Produz um ovo a cada 2,5 segundos enquanto estiver viva.
    this.tempoParaOvo -= dt;
    if (this.tempoParaOvo <= 0) {
      jogo.ovos.push({
        x: this.x + this.largura / 2 - 7,
        y: jogo.chaoY - 17,
        largura: 14,
        altura: 17,
        tempo: 1.2,
        chocado: false
      });
      this.tempoParaOvo = 2.5;
    }
  }*/
    // Só coloca ovos se ainda não atingiu o limite.
   /* if (this.ovosColocados < this.limiteOvos) {
    this.tempoParaOvo -= dt;

    if (this.tempoParaOvo <= 0) {
    // Cria um ovo na posição atual da galinha.
      jogo.ovos.push({
      x: this.x + this.largura / 2,
      y: this.y + this.altura,
      largura: 14,
      altura: 18,
      tempo: 3,
      chocado: false
    });

    // Registra que esta galinha colocou mais um ovo.
    this.ovosColocados++;

    // Reinicia o temporizador para a próxima postura.
    this.tempoParaOvo = 2.5;
    }
  }

  /*desenhar(ctx) {
    if (!this.vivo) return;
    // Corpo
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.ellipse(this.x + 17, this.y + 17, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Asa
    ctx.fillStyle = "#ead9a5";
    ctx.beginPath();
    ctx.ellipse(this.x + 13, this.y + 18, 7, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Crista
    ctx.fillStyle = "#e53e3e";
    ctx.beginPath();
    ctx.arc(this.x + 18, this.y + 5, 4, Math.PI, 0);
    ctx.fill();
    // Bico
    ctx.fillStyle = "#ed8936";
    ctx.beginPath();
    ctx.moveTo(this.x + (this.direcao > 0 ? 28 : 6), this.y + 12);
    ctx.lineTo(this.x + (this.direcao > 0 ? 35 : -1), this.y + 15);
    ctx.lineTo(this.x + (this.direcao > 0 ? 28 : 6), this.y + 18);
    ctx.fill();
    // Olho
    ctx.fillStyle = "#1a202c";
    ctx.beginPath();
    ctx.arc(this.x + (this.direcao > 0 ? 23 : 11), this.y + 11, 2, 0, Math.PI * 2);
    ctx.fill();
    // Pernas
    ctx.strokeStyle = "#c05621";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 26); ctx.lineTo(this.x + 12, this.y + 30);
    ctx.moveTo(this.x + 23, this.y + 26); ctx.lineTo(this.x + 23, this.y + 30);
    ctx.stroke();
  }
}*/



import { Enemy } from "./Enemy.js";

// Galinha: anda pelo chão e coloca no máximo 2 ovos.
export class Galinha extends Enemy {
  constructor({ x, y, direcao = -1 } = {}) {
    super({
      x,
      y,
      largura: 34,
      altura: 30,
      vida: 2,
      velocidade: 42
    });

    this.direcao = direcao;
    this.tempoParaOvo = 2.5;
    this.cor = "#fff7db";

    // Quantidade de ovos que esta galinha já colocou.
    this.ovosColocados = 0;

    // Limite de ovos por galinha.
    this.limiteOvos = 2;
  }

  atualizar(dt, jogo) {
    if (!this.vivo) return;

    // Movimento horizontal.
    this.x += this.direcao * this.velocidade * dt;

    // Inverte a direção nas bordas da área jogável.
    if (this.x < 0) {
      this.x = 0;
      this.direcao = 1;
    }

    if (this.x + this.largura > jogo.largura) {
      this.x = jogo.largura - this.largura;
      this.direcao = -1;
    }

    // Só coloca ovos enquanto não atingir o limite.
    if (this.ovosColocados < this.limiteOvos) {
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
    }
  }

  desenhar(ctx) {
    if (!this.vivo) return;

    // Corpo
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.ellipse(
      this.x + 17, this.y + 17,
      15, 12, 0, 0, Math.PI * 2
    );
    ctx.fill();

    // Asa
    ctx.fillStyle = "#ead9a5";
    ctx.beginPath();
    ctx.ellipse(
      this.x + 13, this.y + 18,
      7, 5, -0.3, 0, Math.PI * 2
    );
    ctx.fill();

    // Crista
    ctx.fillStyle = "#e53e3e";
    ctx.beginPath();
    ctx.arc(this.x + 18, this.y + 5, 4, Math.PI, 0);
    ctx.fill();

    // Bico
    ctx.fillStyle = "#ed8936";
    ctx.beginPath();
    ctx.moveTo(
      this.x + (this.direcao > 0 ? 28 : 6),
      this.y + 12
    );
    ctx.lineTo(
      this.x + (this.direcao > 0 ? 35 : -1),
      this.y + 15
    );
    ctx.lineTo(
      this.x + (this.direcao > 0 ? 28 : 6),
      this.y + 18
    );
    ctx.fill();

    // Olho
    ctx.fillStyle = "#1a202c";
    ctx.beginPath();
    ctx.arc(
      this.x + (this.direcao > 0 ? 23 : 11),
      this.y + 11,
      2, 0, Math.PI * 2
    );
    ctx.fill();

    // Pernas
    ctx.strokeStyle = "#c05621";
    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.moveTo(this.x + 12, this.y + 26);
    ctx.lineTo(this.x + 12, this.y + 30);

    ctx.moveTo(this.x + 23, this.y + 26);
    ctx.lineTo(this.x + 23, this.y + 30);

    ctx.stroke();
  }
}
