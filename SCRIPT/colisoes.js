// ============================================================================
// MÓDULO DE COLISÕES E PROJÉTEIS (Pessoa 4)
// Autor: Mateus
// Este arquivo cuida de três coisas: detectar colisões entre retângulos,
// controlar a vida dos tiros (criar, mover, remover) e resolver a colisão
// do jogador com o cenário (plataformas e paredes).
// ============================================================================

// Instancia o áudio usando o caminho relativo exato do projeto
const somTiro = new Audio('ASSETS/universfield-pistol-shot-278821 (6).mp3');
somTiro.volume = 0.4; // Volume controlado para a apresentação



/**
 * Converte qualquer objeto do jogo para um formato padrão de retângulo
 * com as propriedades x, y, largura e altura.
 * Isso é necessário porque cada entidade pode ter nomes diferentes para
 * as mesmas coisas (por exemplo, posicaoX ou x, width ou largura).
 * A função procura primeiro o nome "novo" e, se ele não existir, usa o outro.
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
 * Verifica se dois retângulos estão se sobrepondo (colisão AABB).
 * AABB quer dizer "retângulo alinhado aos eixos": os lados são sempre
 * paralelos aos eixos X e Y, sem rotação.
 * A lógica é: dois retângulos colidem se houver sobreposição no eixo X
 * e também no eixo Y. Se faltar qualquer um dos dois, não há colisão.
 * Retorna true se houver colisão e false caso contrário.
 */
export function verificarColisao(obj1, obj2) {
    const ret1 = obterCaixa(obj1);
    const ret2 = obterCaixa(obj2);

    return (
        ret1.x < ret2.x + ret2.largura &&  // O lado direito de 1 está à direita do lado esquerdo de 2
        ret1.x + ret1.largura > ret2.x &&  // O lado esquerdo de 1 está à esquerda do lado direito de 2
        ret1.y < ret2.y + ret2.altura &&   // O lado de cima de 1 está acima do lado de baixo de 2
        ret1.y + ret1.altura > ret2.y      // O lado de baixo de 1 está abaixo do lado de cima de 2
    );
}

/**
 * Cria um novo tiro e o adiciona à lista de projéteis.
 * O tiro nasce na posição (x, y) recebida, anda na direção indicada
 * ('direita' ou 'esquerda') com velocidade fixa de 7 pixels por quadro,
 * e tem tamanho fixo de 10 x 4 pixels.
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

    somTiro.currentTime = 0;
    somTiro.play().catch(e => console.log ( "aguardando clique"));
}

/**
 * Move os tiros a cada quadro do jogo e remove os que não servem mais.
 * Um tiro é removido em dois casos:
 *   1. Saiu da área visível do canvas.
 *   2. Bateu em um bloco sólido do mapa.
 * A lista é percorrida de trás para frente porque o splice() remove
 * um item e desloca os seguintes. Se fosse de frente para trás, alguns
 * tiros seriam pulados.
 * Os blocos sólidos são lidos da camada 1 do mapa (mapa.layers[1]),
 * onde cada valor diferente de 0 indica um bloco.
 */
export function atualizarProjecteis(projecteis, larguraCanvas, mapa) {
    const tileSize = mapa.tileheight || 32;   // Tamanho de cada bloco do mapa em pixels (32 se não estiver definido)
    const colunas = mapa.width;               // Quantidade de blocos em cada linha do mapa
    const camadaColisao = mapa.layers[1];     // Camada que guarda quais blocos são sólidos
    const dataColisao = camadaColisao ? camadaColisao.data : null;

    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        // Move o tiro na horizontal, conforme a direção dele
        if (p.direcao === 'direita') {
            p.x += p.velocidade;
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade;
        }

        // Remoção 1: o tiro saiu da tela (passou da borda direita ou esquerda)
        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1);
            continue;   // Já foi removido, então pula para o próximo tiro
        }

        // Remoção 2: o tiro encostou em um bloco sólido
        if (dataColisao) {
            let colidiuComMapa = false;

            // Testa o tiro contra todos os blocos do mapa
            for (let j = 0; j < dataColisao.length; j++) {
                if (dataColisao[j] === 0) continue;   // Posição vazia, não tem o que testar

                // Converte o índice j (que é uma posição única na lista) em coordenadas de pixel.
                // O resto da divisão por colunas dá a coluna; o arredondamento para baixo da divisão dá a linha.
                const blocoX = (j % colunas) * tileSize;
                const blocoY = Math.floor(j / colunas) * tileSize;
                const bloco = { x: blocoX, y: blocoY, largura: tileSize, altura: tileSize };

                if (verificarColisao(p, bloco)) {
                    colidiuComMapa = true;
                    break;   // Basta um bloco para o tiro ser removido, não precisa continuar
                }
            }

            if (colidiuComMapa) {
                projecteis.splice(i, 1);
            }
        }
    }
}

/**
 * Desenha todos os tiros na tela como retângulos vermelhos.
 * Usa o contexto 2D do canvas (ctx) para pintar cada tiro na sua posição atual.
 */
export function desenharProjecteis(projecteis, ctx) {
    ctx.fillStyle = 'red';
    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}

/**
 * Verifica se algum tiro acertou algum inimigo.
 * Para cada tiro, testa todos os inimigos que ainda estão vivos.
 * Quando há acerto, o inimigo é marcado como derrotado (a remoção de fato
 * fica para o game loop) e o tiro é apagado da lista.
 * Os inimigos já derrotados são ignorados.
 */
export function processarColisoesProjeteisInimigos(projecteis, inimigos) {
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        for (let j = inimigos.length - 1; j >= 0; j--) {
            const inimigo = inimigos[j];

            if (inimigo.derrotado) continue;   // Inimigo já morreu, não precisa testar

            if (verificarColisao(p, inimigo)) {
                inimigo.derrotado = true;   // Marca o inimigo. Quem remove ele da tela é o game loop
                projecteis.splice(i, 1);    // Apaga o tiro, que acertou alguma coisa
                break;                      // Esse tiro já foi usado, então vai para o próximo
            }
        }
    }
}

/**
 * Verifica se o jogador encostou em um inimigo vivo (dano por contato).
 * Ao encontrar o primeiro inimigo com colisão, chama a função recebida
 * em funcaoPerderVida, que é definida no game.js e cuida da perda de vida
 * e da invencibilidade temporária. Depois disso, o laço para, para que
 * o jogador não perca mais de uma vida no mesmo quadro.
 */
export function processarColisoesJogadorInimigos(jogador, inimigos, funcaoPerderVida) {
    for (let i = 0; i < inimigos.length; i++) {
        const inimigo = inimigos[i];

        if (inimigo.derrotado) continue;   // Inimigo morto não causa dano

        if (verificarColisao(jogador, inimigo)) {
            if (typeof funcaoPerderVida === 'function') {   // Só chama se a função foi passada
                funcaoPerderVida();
            }
            break;   // Já houve dano neste quadro, não precisa checar os outros inimigos
        }
    }
}

// Plataformas sólidas do MAPA1, em pixels: x e y do canto superior esquerdo, largura e altura.
// Valores medidos na imagem ASSETS/MAPA1.png (640 x 384).
export const PLATAFORMAS_MAPA1 = [
    { x: 512, y: 16,  largura: 114, altura: 14 },   // plataforma no canto superior direito
    { x: 416, y: 80,  largura: 146, altura: 14 },   // plataforma do meio à direita
    { x: 32,  y: 112, largura: 146, altura: 14 },   // plataforma da esquerda
    { x: 224, y: 144, largura: 178, altura: 16 },   // plataforma central
    { x: 448, y: 208, largura: 146, altura: 14 },   // plataforma da direita
    { x: 224, y: 240, largura: 146, altura: 16 },   // plataforma central de baixo
    { x: 0, y: 316, largura: 640, altura: 68 },    // chão
];

/**
 * Resolve a colisão do jogador com as plataformas listadas acima.
 * Se o jogador está dentro de uma plataforma, calcula por qual lado ele entrou
 * e o empurra para fora pelo lado de menor penetração.
 * Plataformas são sólidas só por cima: ao subir, o jogador atravessa por baixo.
 */
export function resolverColisaoMapa(jogador, mapa) {
    jogador.estaNoChao = false;   // Assume que não está no chão até encostar em algo

    for (const bloco of PLATAFORMAS_MAPA1) {
        if (!verificarColisao(jogador, bloco)) continue;   // Não está encostando, passa para a próxima

        // Quanto o jogador entrou em cada lado da plataforma
        const sobreposicaoEsquerda = (jogador.posicaoX + jogador.width) - bloco.x;
        const sobreposicaoDireita = (bloco.x + bloco.largura) - jogador.posicaoX;
        const sobreposicaoTopo = (jogador.posicaoY + jogador.height) - bloco.y;
        const sobreposicaoBaixo = (bloco.y + bloco.altura) - jogador.posicaoY;

        const menorX = Math.min(sobreposicaoEsquerda, sobreposicaoDireita);
        const menorY = Math.min(sobreposicaoTopo, sobreposicaoBaixo);

        if (menorX < menorY) {
            // Entrou pela lateral: empurra o jogador para fora da parede
            if (sobreposicaoEsquerda < sobreposicaoDireita) {
                jogador.posicaoX = bloco.x - jogador.width;
            } else {
                jogador.posicaoX = bloco.x + bloco.largura;
            }
            jogador.velocidadeX = 0;
        } else {
            // Entrou por cima ou por baixo
            if (jogador.velocidadeY < 0) {
                continue;   // Subindo: ignora a plataforma e deixa o jogador passar por baixo
            }
            // Caindo: pousa em cima da plataforma
            jogador.posicaoY = bloco.y - jogador.height;
            jogador.velocidadeY = 0;
            jogador.estaNoChao = true;
        }
    }
}

/**
 * Função auxiliar que trata a cabeça do jogador batendo na parte de baixo de um bloco.
 * Se o jogador estiver subindo e se sobrepor ao bloco, é colocado logo abaixo dele
 * e a velocidade vertical é zerada, cortando o pulo.
 * Atenção: esta função não é chamada em nenhum lugar deste arquivo, então hoje
 * não tem efeito. Ela usa os nomes vy e velY, que são diferentes dos nomes
 * usados em resolverColisaoMapa (velocidadeY e posicaoY).
 */
function verificarColisaoCabeca(player, plataforma) {
    const pBox = obterCaixa(player);
    const platBox = obterCaixa(plataforma);

    // Primeiro verifica se o jogador e a plataforma se sobrepõem
    if (
        pBox.x < platBox.x + platBox.largura &&
        pBox.x + pBox.largura > platBox.x &&
        pBox.y < platBox.y + platBox.altura &&
        pBox.y + pBox.altura > platBox.y
    ) {
        // Depois verifica se o jogador está subindo (velocidade vertical negativa)
        // Tenta usar vy e, se não existir, usa velY
        const velocidadeY = player.vy !== undefined ? player.vy : player.velY;

        if (velocidadeY < 0) {
            // Move o jogador para logo abaixo da plataforma
            if (player.posicaoY !== undefined) {
                player.posicaoY = platBox.y + platBox.altura;
            } else if (player.y !== undefined) {
                player.y = platBox.y + platBox.altura;
            }

            // Zera a velocidade vertical para o pulo acabar na hora
            if (player.vy !== undefined) {
                player.vy = 0;
            } else if (player.velY !== undefined) {
                player.velY = 0;
            }
        }
    }
}