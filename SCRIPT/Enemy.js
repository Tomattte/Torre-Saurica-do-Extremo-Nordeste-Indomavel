// Classe-base de todos os inimigos.
// Todos usam o mesmo padrão: x, y, largura, altura, vida e derrotado.
export class Enemy {
  constructor({ x, y, largura = 32, altura = 32, vida = 1, velocidade = 40 } = {}) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.vida = vida;
    this.velocidade = velocidade;
    this.derrotado = false;
    this.invulneravel = false;
  }

  get vivo() {
    return !this.derrotado && this.vida > 0;
  }

  receberDano(quantidade = 1) {
    if (!this.vivo || this.invulneravel) return false;
    this.vida -= quantidade;
    if (this.vida <= 0) {
      this.vida = 0;
      this.derrotado = true;
    }
    return true;
  }

  atualizar(_dt, _jogo) {
    // Cada tipo de inimigo implementa seu próprio comportamento.
  }

  desenhar(ctx) {
    ctx.fillStyle = this.vivo ? "#b7791f" : "#718096";
    ctx.fillRect(this.x, this.y, this.largura, this.altura);
  }
}
