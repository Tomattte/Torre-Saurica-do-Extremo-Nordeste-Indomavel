/**
 * Módulo de Colisões - Mateus (Dia 1 ao Dia 4)
 * Funções de tiro, limpeza da tela e toque com inimigos.
 */

// Cria o tiro na posição certa e bota na lista de projéteis ativos
export function criarProjectil(projecteis, x, y, direcao) {
    projecteis.push({
        x: x,                         
        y: y,                         
        direcao: direcao,             
        velocidade: 7,                
        largura: 10,                  
        altura: 4                     
    });
}

// Atualiza a posição de cada tiro e limpa os que saem da tela
export function atualizarProjecteis(projecteis, larguraCanvas) {
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        if (p.direcao === 'direita') {
            p.x += p.velocidade;
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade;
        }

        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1);
        }
    }
}

// Desenha todos os tiros na tela em formato de retângulo vermelho
export function desenharProjecteis(projecteis, ctx) {
    ctx.fillStyle = 'red'; 

    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}

// Lógica de colisão AABB em JS puro
export function verificarColisao(ret1, ret2) {
    return (
        ret1.x < ret2.x + ret2.largura && 
        ret1.x + ret1.largura > ret2.x &&  
        ret1.y < ret2.y + ret2.altura && 
        ret1.y + ret1.altura > ret2.y  
    );
}

// Checa se o tiro acertou algum inimigo
export function processarColisoesProjeteisInimigos(projecteis, inimigos) {
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        for (let j = inimigos.length - 1; j >= 0; j--) {
            const inimigo = inimigos[j];

            if (inimigo.derrotado) continue;

            if (verificarColisao(p, inimigo)) {
                inimigo.derrotado = true;
                projecteis.splice(i, 1);
                break;
            }
        }
    }
}

// Lógica pro caso do player encostar num inimigo vivo
export function processarColisoesJogadorInimigos(jogador, inimigos, funcaoPerderVida) {
    for (let i = 0; i < inimigos.length; i++) {
        const inimigo = inimigos[i];

        if (inimigo.derrotado) continue;

        if (verificarColisao(jogador, inimigo)) {
            if (typeof funcaoPerderVida === 'function') {
                funcaoPerderVida();
            }
            break; 
        }            
    }
}

//versao 999 tem que funcionar

export function resolverColisaoMapa(jogador, mapa) {
    if (!mapa || !mapa.layers) return;

    const tileSize = mapa.tileheight || 32;
    const colunas = mapa.width;

    // No MAPA1, a segunda camada contém as plataformas e o chão.
    const camadaColisao = mapa.layers[1];

    if (!camadaColisao || !camadaColisao.data) return;

    const data = camadaColisao.data;

    jogador.estaNoChao = false;

    for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) continue;

        const blocoX = (i % colunas) * tileSize;
        const blocoY = Math.floor(i / colunas) * tileSize;

        const sobrepoeX =
            jogador.posicaoX < blocoX + tileSize &&
            jogador.posicaoX + jogador.width > blocoX;

        const sobrepoeY =
            jogador.posicaoY < blocoY + tileSize &&
            jogador.posicaoY + jogador.height > blocoY;

        if (!sobrepoeX || !sobrepoeY) continue;

        if (jogador.velocidadeY > 0) {
            // Caiu sobre o topo de uma plataforma ou do chão.
            jogador.posicaoY = blocoY - jogador.height;
            jogador.velocidadeY = 0;
            jogador.estaNoChao = true;
        } else if (jogador.velocidadeY < 0) {
            // Bateu a cabeça na parte inferior de um bloco.
            jogador.posicaoY = blocoY + tileSize;
            jogador.velocidadeY = 0;
        }
    }
}
