// ============================================================================
// MÓDULO DE COLISÕES E PROJÉTEIS (Pessoa 4)
// Autor: Mateus
// Descrição: Gerencia toda a física de colisão por caixas delimitadoras (AABB),
// o ciclo de vida dos projéteis (criação, movimento e remoção) e a interação
// entre jogador, inimigos e o cenário.
// ============================================================================

/**
 * Padroniza qualquer objeto do jogo em uma estrutura de caixa única (AABB).
 * Isso garante compatibilidade caso diferentes entidades usem nomes de 
 * propriedades distintos (ex: posicaoX vs x, width vs largura).
 */
function obterCaixa(obj) {
    return {
        x: obj.posicaoX !== undefined ? obj.posicaoX : obj.x,
        y: obj.posicaoY !== undefined ? obj.posicaoY : obj.y,
        largura: obj.width !== undefined ? obj.width : obj.largura,
        altura: obj.height !== undefined ? obj.height : obj.altura
    };
}

/**
 * ALGORITMO DE COLISÃO AABB (Axis-Aligned Bounding Box)
 * Explicação para a defesa: Verifica se dois retângulos se sobrepõem nos eixos X e Y.
 * Retorna true se houver interseção em ambos os eixos, indicando colisão.
 */
export function verificarColisao(obj1, obj2) {
    const ret1 = obterCaixa(obj1);
    const ret2 = obterCaixa(obj2);

    return (
        ret1.x < ret2.x + ret2.largura &&  // Borda direita de 1 passa da esquerda de 2
        ret1.x + ret1.largura > ret2.x &&  // Borda esquerda de 1 passa da direita de 2
        ret1.y < ret2.y + ret2.altura &&   // Borda inferior de 1 passa do topo de 2
        ret1.y + ret1.altura > ret2.y      // Borda superior de 1 passa da base de 2
    );
}

/**
 * CICLO DE VIDA DO TIRO: CRIAÇÃO
 * Instancia um novo projétil com posição baseada na direção do jogador,
 * definindo velocidade constante e dimensões padronizadas.
 */
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

/**
 * CICLO DE VIDA DO TIRO: ATUALIZAÇÃO E REMOÇÃO
 * Atualiza a posição horizontal de cada projétil a cada quadro (game loop).
 * Faz a varredura de trás para frente (loop reverso) para evitar bugs de índice
 * ao remover elementos do array com splice(). Remove se sair da tela ou bater no mapa.
 */
export function atualizarProjecteis(projecteis, larguraCanvas, mapa) {
    const tileSize = mapa.tileheight || 32;
    const colunas = mapa.width;
    const camadaColisao = mapa.layers[1];
    const dataColisao = camadaColisao ? camadaColisao.data : null;

    // Loop reverso essencial para segurança ao manipular arrays em tempo de execução
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        // Atualiza a posição com base na direção em velocidade constante
        if (p.direcao === 'direita') {
            p.x += p.velocidade;
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade;
        }

        // Condição de remoção 1: Saiu dos limites visíveis do canvas
        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1);
            continue;
        }

        // Condição de remoção 2: Colidiu com blocos sólidos do mapa/cenário
        if (dataColisao) {
            let colidiuComMapa = false;
            for (let j = 0; j < dataColisao.length; j++) {
                if (dataColisao[j] === 0) continue; // Ignora espaços vazios

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

/**
 * RENDERIZAÇÃO DOS PROJÉTEIS
 * Desenha visualmente cada tiro ativo na tela utilizando o contexto 2D do Canvas.
 */
export function desenharProjecteis(projecteis, ctx) {
    ctx.fillStyle = 'red'; 
    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}

/**
 * INTERAÇÃO: PROJÉTIL x INIMIGO
 * Verifica a colisão entre cada tiro ativo e todos os inimigos vivos na tela.
 * Se houver contato, o inimigo é marcado como derrotado e o projétil é destruído.
 */
export function processarColisoesProjeteisInimigos(projecteis, inimigos) {
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        for (let j = inimigos.length - 1; j >= 0; j--) {
            const inimigo = inimigos[j];

            if (inimigo.derrotado) continue;

            if (verificarColisao(p, inimigo)) {
                inimigo.derrotado = true; // Marca para remoção posterior no game loop
                projecteis.splice(i, 1);  // Remove o tiro imediatamente
                break;
            }
        }
    }
}

/**
 * INTERAÇÃO: JOGADOR x INIMIGO (DANO CORPO A CORPO)
 * Detecta se o personagem colidiu fisicamente com um inimigo ativo,
 * acionando a função de perda de vidas e gerenciamento de invencibilidade.
 */
export function processarColisoesJogadorInimigos(jogador, inimigos, funcaoPerderVida) {
    for (let i = 0; i < inimigos.length; i++) {
        const inimigo = inimigos[i];

        if (inimigo.derrotado) continue;

        if (verificarColisao(jogador, inimigo)) {
            if (typeof funcaoPerderVida === 'function') {
                funcaoPerderVida(); // Dispara o callback de dano configurado no game.js
            }
            break; 
        }            
    }
}

/**
 * RESOLUÇÃO DE COLISÃO COM O MAPA (Plataformas e Paredes)
 * Utiliza o cálculo de menor sobreposição (penetração) para separar o jogador
 * do bloco sólido, impedindo travamentos laterais bruscos e corrigindo o eixo vertical (chão).
 */
export function resolverColisaoMapa(jogador, mapa) {
    if (!mapa || !mapa.layers) return;

    const tileSize = mapa.tileheight || 32;
    const colunas = mapa.width;
    const camadaColisao = mapa.layers[1];

    if (!camadaColisao || !camadaColisao.data) return;

    const data = camadaColisao.data;
    jogador.estaNoChao = false; // Assume inicialmente que está no ar até provar o contrário

    for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) continue;

        const blocoX = (i % colunas) * tileSize;
        const blocoY = Math.floor(i / colunas) * tileSize;
        const bloco = { x: blocoX, y: blocoY, largura: tileSize, altura: tileSize };

        if (verificarColisao(jogador, bloco)) {
            // Calcula o tamanho da sobreposição em cada um dos 4 lados
            const sobreposicaoEsquerda = (jogador.posicaoX + jogador.width) - bloco.x;
            const sobreposicaoDireita = (bloco.x + bloco.largura) - jogador.posicaoX;
            const sobreposicaoTopo = (jogador.posicaoY + jogador.height) - bloco.y;
            const sobreposicaoBaixo = (bloco.y + bloco.altura) - jogador.posicaoY;

            // Descobre qual eixo teve a menor penetração para decidir onde empurrar o jogador
            const menorX = Math.min(sobreposicaoEsquerda, sobreposicaoDireita);
            const menorY = Math.min(sobreposicaoTopo, sobreposicaoBaixo);

            if (menorX < menorY) {
                // Resolução de colisão no Eixo X (Lateral / Paredes)
                if (sobreposicaoEsquerda < sobreposicaoDireita) {
                    jogador.posicaoX = bloco.x - jogador.width;
                } else {
                    jogador.posicaoX = bloco.x + bloco.largura;
                }
                jogador.velocidadeX = 0;
            } else {
                // Resolução de colisão no Eixo Y (Vertical / Chão ou Teto)
                if (sobreposicaoTopo < sobreposicaoBaixo && jogador.velocidadeY >= 0) {
                    jogador.posicaoY = bloco.y - jogador.height;
                    jogador.velocidadeY = 0;
                    jogador.estaNoChao = true; // Confirma que apoiou no piso
                } else if (jogador.velocidadeY < 0) {
                    jogador.posicaoY = bloco.y + bloco.altura;
                    jogador.velocidadeY = 0;
                }
            }
        }
    }
}