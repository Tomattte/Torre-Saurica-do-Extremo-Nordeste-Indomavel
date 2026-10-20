//mateus mega pro
//refatoracao 4
//colisoes.js minha parte
// Função auxiliar para padronizar qualquer objeto em uma caixa AABB consistente
function obterCaixa(obj) {
    return {
        x: obj.posicaoX !== undefined ? obj.posicaoX : obj.x,
        y: obj.posicaoY !== undefined ? obj.posicaoY : obj.y,
        largura: obj.width !== undefined ? obj.width : obj.largura,
        altura: obj.height !== undefined ? obj.height : obj.altura
    };
}

// Lógica de colisão AABB universal
export function verificarColisao(obj1, obj2) {
    const ret1 = obterCaixa(obj1);
    const ret2 = obterCaixa(obj2);

    return (
        ret1.x < ret2.x + ret2.largura && 
        ret1.x + ret1.largura > ret2.x &&  
        ret1.y < ret2.y + ret2.altura && 
        ret1.y + ret1.altura > ret2.y  
    );
}

// Lista para guardar todos os tiros ativos na tela
export const projecteis = [];

//mateus 17/10/2026 19:42 passei 3 horas pra funcionar e terminar  a tesk do dia 4
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

// Atualiza a posição de cada tiro, limpa os que saem da tela ou batem nas plataformas do mapa
export function atualizarProjecteis(projecteis, larguraCanvas, mapa) {
    const tileSize = mapa.tileheight || 32;
    const colunas = mapa.width;
    const camadaColisao = mapa.layers[1];
    const dataColisao = camadaColisao ? camadaColisao.data : null;

    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        if (p.direcao === 'direita') {
            p.x += p.velocidade;
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade;
        }

        // Saiu da tela
        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1);
            continue;
        }

        // Colisão do projétil com os blocos do mapa (Sua parte pendente - 30 min)
        if (dataColisao) {
            let colidiuComMapa = false;
            for (let j = 0; j < dataColisao.length; j++) {
                if (dataColisao[j] === 0) continue;

                const blocoX = (j % colunas) * tileSize;
                const blocoY = Math.floor(j / colunas) * tileSize;

                const bloco = { x: blocoX, y: blocoY, largura: tileSize, altura: tileSize };

                if (verificarColisao(p, bloco)) {
                    colidiuComMapa = true;
                    break;
                }
            }

            if (colidiuComMapa) {
                projecteis.splice(i, 1);
            }
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
    
    // Mapeia as propriedades do primeiro objeto (ret1), aceitando as variações
    // de nome usados para a posição e tamanho encontradas no código

    const x1 = ret1.x !== undefined ? ret1.x : ret1.posicaoX;
    const y1 = ret1.y !== undefined ? ret1.y : ret1.posicaoY;
    const w1 = ret1.width !== undefined ? ret1.width : ret1.largura;
    const h1 = ret1.height !== undefined ? ret1.height : ret1.altura;

    // Mapeia as propriedades do segundo objeto (ret2), na mesma lógica

    const x2 = ret2.x !== undefined ? ret2.x : ret2.posicaoX;
    const y2 = ret2.y !== undefined ? ret2.y : ret2.posicaoY;
    const w2 = ret2.width !== undefined ? ret2.width : ret2.largura;
    const h2 = ret2.height !== undefined ? ret2.height : ret2.altura;

    // Faz a checagem AABB
    
    return (
        x1 < x2 + w2 && 
        x1 + w1 > x2 &&  
        y1 < y2 + h2 && 
        y1 + h1 > y2  
    );
}

// tarefas do dia 4 
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

// Resolução de colisão com o mapa corrigida (evita teletransporte lateral brusco)
export function resolverColisaoMapa(jogador, mapa) {
    if (!mapa || !mapa.layers) return;

    const tileSize = mapa.tileheight || 32;
    const colunas = mapa.width;
    const camadaColisao = mapa.layers[1];

    if (!camadaColisao || !camadaColisao.data) return;

    const data = camadaColisao.data;
    jogador.estaNoChao = false;

    for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) continue;

        const blocoX = (i % colunas) * tileSize;
        const blocoY = Math.floor(i / colunas) * tileSize;

        const bloco = { x: blocoX, y: blocoY, largura: tileSize, altura: tileSize };

        if (verificarColisao(jogador, bloco)) {
            // Calcula as sobreposições nos dois eixos
            const sobreposicaoEsquerda = (jogador.posicaoX + jogador.width) - bloco.x;
            const sobreposicaoDireita = (bloco.x + bloco.largura) - jogador.posicaoX;
            const sobreposicaoTopo = (jogador.posicaoY + jogador.height) - bloco.y;
            const sobreposicaoBaixo = (bloco.y + bloco.altura) - jogador.posicaoY;

            const menorX = Math.min(sobreposicaoEsquerda, sobreposicaoDireita);
            const menorY = Math.min(sobreposicaoTopo, sobreposicaoBaixo);

            if (menorX < menorY) {
                // Colisão Lateral
                if (sobreposicaoEsquerda < sobreposicaoDireita) {
                    jogador.posicaoX = bloco.x - jogador.width;
                } else {
                    jogador.posicaoX = bloco.x + bloco.largura;
                }
                jogador.velocidadeX = 0;
            } else {
                // Colisão Vertical
                if (sobreposicaoTopo < sobreposicaoBaixo && jogador.velocidadeY >= 0) {
                    jogador.posicaoY = bloco.y - jogador.height;
                    jogador.velocidadeY = 0;
                    jogador.estaNoChao = true;
                } else if (jogador.velocidadeY < 0) {
                    jogador.posicaoY = bloco.y + bloco.altura;
                    jogador.velocidadeY = 0;
                }
            }
        }
    }
}
