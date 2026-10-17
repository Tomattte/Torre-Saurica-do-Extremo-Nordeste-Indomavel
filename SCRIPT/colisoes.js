/**
 * Módulo de Colisões - Mateus (Dia 1 ao Dia 4)
 * Funções de tiro, limpeza da tela e toque com inimigos.
 */
//organizei os contarios porque de algujma forma os tiros nao funcionava 
//mateus 17/10/2026 19:42 passei 3 horas pra funcionar e terminar  a tesk do dia 4
// Cria o tiro na posição certa e bota na lista de projéteis ativos
export function criarProjectil(projecteis, x, y, direcao) {
    projecteis.push({
        x: x,                         // Posição horizontal inicial
        y: y,                         // Posição vertical inicial
        direcao: direcao,             // 'direita' ou 'esquerda'
        velocidade: 7,                // Velocidade do tiro por frame
        largura: 10,                  // Largura do bloco do tiro
        altura: 4                     // Altura do bloco do tiro
    });
}

// Atualiza a posição de cada tiro e limpa os que saem da tela
export function atualizarProjecteis(projecteis, larguraCanvas) {
    // A gente percorre de trás pra frente pra o array não bugar ao remover itens
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i];

        // Move o tiro pro lado que o boneco tava virado
        if (p.direcao === 'direita') {
            p.x += p.velocidade;
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade;
        }

        // Se o tiro passar da tela, vapo (some da memória)
        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1);
        }
    }
}

// Desenha todos os tiros na tela em formato de retângulo vermelho
export function desenharProjecteis(projecteis, ctx) {
    ctx.fillStyle = 'red'; // Cor vermelha pros tiros

    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}

// Tarefa do dia 3: lógica de colisão AABB em JS puro
// Básicamente confere se dois retângulos tão se sobrepondo (batendo um no outro)
export function verificarColisao(ret1, ret2) {
    return (
        ret1.x < ret2.x + ret2.largura && 
        ret1.x + ret1.largura > ret2.x &&  
        ret1.y < ret2.y + ret2.altura && 
        ret1.y + ret1.altura > ret2.y  
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

            // Se o tiro encostou no inimigo, marca ele como derrotado e apaga o tiro
            if (verificarColisao(p, inimigo)) {
                inimigo.derrotado = true;
                projecteis.splice(i, 1);// splice é bom de mais
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

        // Se o player bateu no monstro, chama a função de perder vida
        if (verificarColisao(jogador, inimigo)) {
            if (typeof funcaoPerderVida === 'function') {
                funcaoPerderVida();
            }
            break; // Pra não tirar 300 vidas no mesmo frame por bug
        }            // seria muito ruim eu acho kkkkkkkkkkk
    }
}