import { Enemy } from "./Enemy.js";

export class Cacto extends Enemy {
  constructor({ x, y } = {}) {
    super({
      x,
      y,
      largura: 42,
      altura: 58,
      vida: 1,
      velocidade: 0
    });

    this.cabecas = 3;
    this.maxCabecas = 3;
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

  atualizar(dt, jogo) {
    if (!this.vivo) return;

    // Cria uma cabeça a cada 5 segundos, até o máximo de 3.
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
    }
  }

  desenhar(ctx) {
    if (!this.vivo) return;

    // Tronco e braços.
    ctx.fillStyle = "#2f855a";
    ctx.fillRect(this.x + 12, this.y + 20, 18, 38);
    ctx.fillRect(this.x + 2, this.y + 30, 12, 8);
    ctx.fillRect(this.x + 2, this.y + 23, 8, 15);
    ctx.fillRect(this.x + 28, this.y + 34, 12, 8);
    ctx.fillRect(this.x + 32, this.y + 26, 8, 16);

    // Posições das três cabeças.
    const posicoes = [
      { x: this.x + 21, y: this.y + 12 },
      { x: this.x + 10, y: this.y + 23 },
      { x: this.x + 32, y: this.y + 23 }
    ];

    for (let i = 0; i < this.cabecas; i++) {
      const p = posicoes[i];

      ctx.fillStyle = "#38a169";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1a202c";
      ctx.fillRect(p.x - 4, p.y - 2, 2, 2);
      ctx.fillRect(p.x + 2, p.y - 2, 2, 2);
    }

    // Indicador de cabeças restantes.
    ctx.fillStyle = "#1a202c";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `${this.cabecas}/3`,
      this.x + this.largura / 2,
      this.y - 5
    );
    ctx.textAlign = "left";
  }
}