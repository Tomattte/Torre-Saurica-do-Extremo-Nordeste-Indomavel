// Array com as imagens e com os sons carregadas que podem ser usadas no resto do código

export const IMGS = {};
export const TRACKS = {};

// Array de objetos com o nome e a src dos assets que precisam ser carregados

const IMGloadList = [
    { nome: 'menu', src: 'ASSETS/MenuImagem.png' },
    { nome: 'gameover', src: 'ASSETS/GameOver_prototipo.png' },
    { nome: 'vidaP1', src: 'ASSETS/HEARTP1.png'},
    { nome: 'vidaP2', src: 'ASSETS/HEARTP2.png'},
    //{ nome: 'player', src: 'ASSETS/player_sprite.png' },
    { nome: 'MAPA1', src: 'ASSETS/MAPA1.png'},
    { nome: 'MAPA2', src: 'ASSETS/MAPA2.png'},
    { nome: 'MAPA3', src: 'ASSETS/MAPA3.png'}
];

const TRACKSloadList = [
    { nome: 'menu', src: 'SOUNDS/TRACKS/TS_Menu_track.mp3'},
    { nome: 'main', src: 'SOUNDS/TRACKS/TS_Main_track.mp3'}
]

// Função que carrega os assets e então começa o jogo

export function carregarAssets(onComplete) {

    // Variável com a quantidades de cartas para carregar e quantas já forma carregadas

    let totalImagens = IMGloadList.length;
    let totalAudios = TRACKSloadList.length;
    let totalAssets = totalAudios + totalImagens;
    let assetsCarregados = 0;

    // Confere se não tem nada pra carregar

    if (totalAssets === 0) {
        onComplete();
        return;
    }

    // Função que checa se quebra o carregarAssets quando todos os assets forem carregados

    function checarConclusao() {
        assetsCarregados++;
        if (assetsCarregados === totalAssets) {
            console.log("Tudo foi carregado");
            onComplete();
        }
    }

    // Se tiver imagens para carregar, carrega um de cada vez percorrendo a IMGloadList

    if (totalImagens !== 0) {

        for (let index in IMGloadList) {

            // item guarda o objeto no index atual

            const item = IMGloadList[index];

            // img guarda o objeto Image() que será criado

            const img = new Image();
        
            // Quando a imagem é carregada, confere se tudo já foi carregado

            img.onload = () => {
                checarConclusao();
            };

            // Exibe erro no console caso não encontre alguma imagem

            img.onerror = () => {
                console.error(`Erro ao carregar a imagem: ${item.nome}`);
                checarConclusao();
            };

            // Salva a src do novo objeto Image como a src do index atual

            img.src = IMGloadList[index].src;
        
            // Salva a src da imagem no array IMGS usando o seu respectivo nome
            // Dessa forma dá pra usar a imagem se referindo a ela pelo nome escolhido
            // Exemplo: 'IMGS.player' vai retornar 'ASSETS/player_sprite.png'

            IMGS[item.nome] = img;
        }
    }

    // Se tiver audios para carregar, carrega um de cada vez percorrendo a audioLoadList

    if (totalAudios !== 0) {

        for (let index in TRACKSloadList) {

            // item guarda o objeto no index atual

            const item = TRACKSloadList[index];

            // audio guarda o objeto Audio() que será criado

            const audio = new Audio();

            // Quando o audio puder ser reproduzido, confere se tudo ja foi carregado

            audio.addEventListener('canplaythrough', () => {
                checarConclusao();
            }, { once: true });

            // Exibe erro no console caso não encontre algum audio

            audio.onerror = () => {
                console.error(`Erro ao carregar o áudio: ${item.nome}`);
                checarConclusao();
            };

            // Salva a src do novo objeto Audio como a src do index atual

            audio.src = item.src;

            // Salva o objeto Audio() no atributo nome do respectivo objeto no array SOUNDS
            // Dessa forma dá pra usar o audio se referindo a ele pelo nome escolhido
            // Exemplo: 'SOUNDS.menu' vai retornar um objeto Audio() com src = 'SOUNDS/TRACKS/TS_Menu_track'

            TRACKS[item.nome] = audio;
        }
    }
}
