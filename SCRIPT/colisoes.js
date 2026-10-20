/**
 * Módulo de Colisões - Mateus (Dia 1 ao Dia 4)
 * Funções de tiro, limpeza da tela e toque com inimigos.
 */
//organizei os contarios porque de algujma forma os tiros nao funcionava 

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
