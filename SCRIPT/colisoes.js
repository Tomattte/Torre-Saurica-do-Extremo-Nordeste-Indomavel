// Cria um tiro novo e joga-o para dentro da nossa lista de tiros ativos
export function criarProjectil(x, y, direcao) {
    projecteis.push({
        x: x,                         // Onde o tiro começa na horizontal
        y: y,                         // Onde o tiro começa na vertical
        direcao: direcao,         // Para onde ele vai: 'direita' ou 'esquerda'
        velocidade: 7,            // Velocidade de movimento por quadro
        largura: 10,              // Tamanho visual do tiro (largura)
        altura: 4                 // Tamanho visual do tiro (altura)
    });
}

// Atualiza a posição de cada tiro e apaga os que já saíram da tela
export function atualizarProjecteis(larguraCanvas) {
    // Percorremos a lista de trás para a frente para evitar bugs de índice ao remover itens
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        // Move o tiro para o lado certo
        if (p.direcao === 'direita') {
            p.x += p.velocidade;
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade;
        }

        // Se o tiro passou do limite da tela, remove da lista
        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1);
        }
    }
}

// Desenha todos os tiros ativos na tela
export function desenharProjecteis() {
    ctx.fillStyle = 'red'; // Pinta o tiro de vermelho

    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}

//task dia 3 : usar AABB com javascripto puro 
//sistema de colisoes reutilizavel
//A função verificarColisao espera dois objetos que contenham as coordenadas de posição 
// e dimensões (x, y, largura e altura)
// e retorna true caso estejam colidindo, ou false caso contrário.
export function verificarColisao(ret1, ret2) {
    return (
        ret1.x < ret2.x + ret2.largura && //O retângulo A está totalmente à direita do retângulo B.
        ret1.x + ret1.largura > ret2.x &&  //O retângulo A está totalmente à esquerda do retângulo B.
        ret1.y < ret2.y + ret2.altura && //O retângulo A está totalmente abaixo do retângulo B.
        ret1.y + ret1.altura > ret2.y  //O retângulo A está totalmente acima do retângulo B.
    );
}

//aires irei mandar exemplo de como usar ele no game.js
//// Exemplo de teste simples ou verificação entre objetos do jogo:
//const colidiu = verificarColisao(
//    { x: projetil.x, y: projetil.y, largura: projetil.largura, altura: projetil.altura },
  //  { x: jogador.posicaoX, y: jogador.posicaoY, largura: jogador.width, altura: jogador.height }
//);

//if (colidiu) {
 //   console.log("Colisão detectada!");
//}
