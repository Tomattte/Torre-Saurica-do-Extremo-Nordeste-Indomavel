// Colisão retangular (AABB), usada por projéteis, jogador e inimigos.
export function verificarColisao(a, b) {
  return a.x < b.x + b.largura &&
    a.x + a.largura > b.x &&
    a.y < b.y + b.altura &&
    a.y + a.altura > b.y;
}

export function processarColisoes(jogo) {

  // Verifica se os projéteis inimigos atingiram o jogador.
for (let i = jogo.projeteisInimigos.length - 1; i >= 0; i--) {
  const projetil = jogo.projeteisInimigos[i];

  // Só aplica dano se o jogador não estiver invulnerável.
  if (
    jogo.jogador.invulnerabilidade <= 0 &&
    verificarColisao(projetil, jogo.jogador)
  ) {
    // Aplica o dano definido pelo projétil.
    jogo.jogador.receberDano();

    // Remove o projétil após o impacto.
    jogo.projeteisInimigos.splice(i, 1);
  }
}

  // Projéteis contra inimigos.
  for (let i = jogo.projeteis.length - 1; i >= 0; i--) {
    const p = jogo.projeteis[i];
    let acertou = false;

    for (let j = jogo.inimigos.length - 1; j >= 0; j--) {
      const inimigo = jogo.inimigos[j];
      if (!inimigo.vivo) continue;
      if (verificarColisao(p, inimigo)) {
        inimigo.receberDano(p.dano);
        acertou = true;
        break;
      }
    }
    if (acertou) jogo.projeteis.splice(i, 1);
  }

  // Contato entre jogador e galinhas.
  for (const inimigo of jogo.inimigos) {
    if (inimigo.vivo && jogo.jogador.invulnerabilidade <= 0 &&
        verificarColisao(jogo.jogador, inimigo)) {
      jogo.jogador.receberDano();
    }
  }
}
