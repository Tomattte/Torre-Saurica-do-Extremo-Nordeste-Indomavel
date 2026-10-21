export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.largura = 28;
    this.altura = 42;
    this.velocidadeX = 220;
    this.velocidadeY = 0;
    this.velocidadePulo = -460;
    this.noChao = false;
    this.vida = 5;
    this.invulnerabilidade = 0;
    this.direcao = 1;
    this.tempoTiro = 0;
  }

  atualizar(dt, teclas, jogo) {
    let eixo = 0;
    if (teclas.has("ArrowLeft") || teclas.has("a")) eixo -= 1;
    if (teclas.has("ArrowRight") || teclas.has("d")) eixo += 1;
    if (eixo !== 0) this.direcao = eixo;
    this.x += eixo * this.velocidadeX * dt;
    this.x = Math.max(0, Math.min(jogo.largura - this.largura, this.x));

    const querPular = teclas.has("ArrowUp") || teclas.has("w") || teclas.has(" ");
    if (querPular && this.noChao) {
      this.velocidadeY = this.velocidadePulo;
      this.noChao = false;
    }

    this.velocidadeY += jogo.gravidade * dt;
    this.y += this.velocidadeY * dt;
    if (this.y + this.altura >= jogo.chaoY) {
      this.y = jogo.chaoY - this.altura;
      this.velocidadeY = 0;
      this.noChao = true;
    }

    this.invulnerabilidade = Math.max(0, this.invulnerabilidade - dt);
    this.tempoTiro = Math.max(0, this.tempoTiro - dt);
    if ((teclas.has("x") || teclas.has("X")) && this.tempoTiro <= 0) {
      jogo.projeteis.push({
        x: this.direcao > 0 ? this.x + this.largura : this.x - 12,
        y: this.y + 18,
        largura: 12,
        altura: 5,
        velocidade: 430 * this.direcao,
        dano: 1
      });
      this.tempoTiro = 0.28;
    }
  }

  receberDano() {
    if (this.invulnerabilidade > 0) return;
    this.vida -= 1;
    this.invulnerabilidade = 1;
    if (this.vida <= 0) this.vida = 0;
  }

  desenhar(ctx) {
    // Pisca por um instante após levar dano.
    if (this.invulnerabilidade > 0 && Math.floor(this.invulnerabilidade * 12) % 2 === 0) return;
    ctx.fillStyle = "#2b6cb0";
    ctx.fillRect(this.x, this.y, this.largura, this.altura);
    ctx.fillStyle = "#fbd38d";
    ctx.fillRect(this.x + 5, this.y + 5, 18, 12);
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(this.x + (this.direcao > 0 ? 17 : 7), this.y + 9, 3, 3);
  }
}
