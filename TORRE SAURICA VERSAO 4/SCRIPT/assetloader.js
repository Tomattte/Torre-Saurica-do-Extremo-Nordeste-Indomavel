// Array com as imagens carregadas que podem ser usadas no resto do código

export const IMGS = {};

// Array de objetos com o nome e a src dos assets que precisam ser carregados

const loadList = [
    { nome: 'menu', src: 'ASSETS/MenuImagem.png' },
    { nome: 'gameover', src: 'ASSETS/GameOver_prototipo.png' },
    { nome: 'vidaP1', src: 'ASSETS/HEARTP1.png'},
    { nome: 'vidaP2', src: 'ASSETS/HEARTP2.png'},
    { nome: 'player', src: 'ASSETS/Jogador1.png' },
    { nome: 'player2', src: 'ASSETS/Jogador2.png' },
    { nome: 'MAPA1', src: 'ASSETS/MAPA1.png'},
    { nome: 'MAPA2', src: 'ASSETS/MAPA2.png'},
    { nome: 'MAPA3', src: 'ASSETS/MAPA3.png'}
];

// Função que carrega os assets e então começa o jogo

export function carregarImagens(onComplete) {

    // Variável com a quantidades de cartas para carregar e quantas já forma carregadas

    let totalImagens = loadList.length;
    let imagensCarregadas = 0;

    // Confere se não tem nada pra carregar

    if (totalImagens === 0) {
        onComplete();
        return;
    }

    // Para cada asset na loadList faz o processo de carregar a imagem e salvar no array

    for (let index in loadList) {

        // item guarda o objeto no index atual

        const item = loadList[index];

        // img guarda o objeto Image() que será criado

        const img = new Image();
        
        // Quando a imagem é carregada

        img.onload = () => {
            imagensCarregadas++;

            // Confere se tudo foi carregado
            
            if (imagensCarregadas === totalImagens) {
                console.log("Assets carregados");
                onComplete();
            }
        };

        // Exibe erro no console caso não encontre algum asset

        img.onerror = () => {
            console.error(`Erro ao carregar o assets: ${loadList[index].nome}`);
        };

        // Salva a src do novo objeto Image como a src do index atual

        img.src = loadList[index].src;
        
        // Salva a src da imagem no array IMGS usando o seu respectivo nome
        // Dessa forma dá pra usar a imagem se referindo a ela pelo nome escolhido
        // Exemplo: 'IMGS.player' vai retornar 'ASSETS/player_sprite.png'
        IMGS[item.nome] = img;
    }
}
