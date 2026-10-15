//deixei tudo comentado pra melhor compreensao do codigo 
// Pega no canvas lá do HTML e prepara o terreno para desenhar em 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Aqui é onde vamos guardar todos os tiros que estão ativos na tela ao mesmo tempo
const projecteis = [];


// Cria um tiro novo e joga-o para dentro da nossa lista de tiros ativos
function criarProjectil(x, y, direcao) {
    projecteis.push({
        x: x,                     // Onde o tiro começa na horizontal
        y: y,                     // Onde o tiro começa na vertical
        direcao: direcao,         // Para onde ele vai: 'direita' ou 'esquerda'
        velocidade: 7,            // O quão rápido ele se mexe a cada quadro
        largura: 10,              // Tamanho visual do tiro (largura)
        altura: 4                 // Tamanho visual do tiro (altura)
    });
}


// Atualiza a posição de cada tiro e apaga os que já saíram da tela
function atualizarProjecteis(larguraCanvas) {
    // Percorremos a lista de trás para a frente. 
    // Fazemos isto para não dar erro (bug de índice) quando apagarmos um tiro no meio do caminho.
    for (let i = projecteis.length - 1; i >= 0; i--) {
        const p = projecteis[i]; // Pega no tiro da vez

        // Mexe o tiro para o lado certo somando ou tirando da posição X
        if (p.direcao === 'direita') {
            p.x += p.velocidade; // Vai para a direita (avança)
        } else if (p.direcao === 'esquerda') {
            p.x -= p.velocidade; // Vai para a esquerda (recua)
        }

        // Se o tiro passou do limite da tela (foi longe demais), tiramos ele da lista
        if (p.x > larguraCanvas || p.x + p.largura < 0) {
            projecteis.splice(i, 1); // Apaga 1 item na posição 'i'
        }
    }
}


// Desenha todos os tiros que estão vivos na tela
function desenharProjecteis() {
    ctx.fillStyle = 'red'; // Pinta o tiro de vermelho

    // Passa por cada tiro guardado e desenha o retângulozinho dele na tela
    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}


// O motor principal do jogo que roda sem parar (geralmente 60 vezes por segundo)
function gameLoop() {
    //Limpa o rasto do que foi desenhado no quadro anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Atualiza a posição dos tiros e limpa os que saíram da tela
    atualizarProjecteis(canvas.width);

    //Desenha os tiros nas novas posições atualizadas
    desenharProjecteis();

    //Pede ao navegador para chamar esta função de novo no próximo frame/quadro
    requestAnimationFrame(gameLoop);
}


// Dispara um tiro a partir do ponto x=100, y=200 indo para a direita
criarProjectil(100, 200, 'direita');

// Dá o pontapé inicial no loop do jogo
gameLoop();