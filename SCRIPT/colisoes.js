// Pega o canvas correto usando o ID "canvas" do HTML
const canvas = document.getElementById('canvas');//tinha colocado outro
//codigo super comentado pra taniro
const ctx = canvas.getContext('2d');

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];

// Cria um tiro novo e joga-o para dentro da nossa lista de tiros ativos
function criarProjectil(x, y, direcao) {
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
function atualizarProjecteis(larguraCanvas) {
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
function desenharProjecteis() {
    ctx.fillStyle = 'red'; // Pinta o tiro de vermelho

    projecteis.forEach(p => {
        ctx.fillRect(p.x, p.y, p.largura, p.altura);
    });
}