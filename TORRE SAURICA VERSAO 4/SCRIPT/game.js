// IMPORTS

// assetloader.js

import { carregarImagens, IMGS } from './assetloader.js';

// mapas

import { MAPA1 } from '../MAPAS/MAPA1.js';
import { MAPA2 } from '../MAPAS/MAPA2.js';
import { MAPA3 } from '../MAPAS/MAPA3.js';

// background.js

import { backgrounds, desenharMapa, carregarImagensDoMapa } from './backgrounds.js';

// players.js

import { Player } from '../SCRIPT/player.js';

// hearts.js

import { Heart } from './hearts.js';

// inimigos.js

// colisoes.js

import { 
    criarProjectil, 
    atualizarProjecteis, 
    desenharProjecteis, 
    processarColisoesProjeteisInimigos,
    processarColisoesJogadorInimigos,
    checarColisaoMapaX,
    checarColisaoMapaY,
    projecteis
} from './colisoes.js';

// inimigos temporarios dia4
let inimigos = [
    { x: 300, y: 328, largura: 32, altura: 32, derrotado: false }
];

//Variavel Pra Controlar o Mapa Atual
const listaDeMapas = { 1: MAPA1, 2: MAPA2, 3: MAPA3 };
let faseAtual = 1;
carregarImagensDoMapa(listaDeMapas[faseAtual]);

// gameover.js

export function GameOver() {
    gameState = "Game Over";
    backgroundAtual = new backgrounds({ image: IMGS.gameover });
}

import { seraGameOver } from './gameover.js';

/*--------------------------------------------------------------------*/

//Variáveis Instanciadas

let jogador;
let jogador2;

let p1 = true;
let p2;

let gameState;
let backgroundAtual;

let animacaoId;

/*--------------------------------------------------------------------*/
// CANVAS CONFIGURATION 

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// Variables to store the original canvas size

const C_WIDTH = canvas.width;
const C_HEIGHT = canvas.height;

function resizeGame() {

    // Variables to store the current size of the users window

    const U_WIDTH = window.innerWidth;
    const U_HEIGHT = window.innerHeight;

    // Calculates the approximate scale based on the user's window size.

    const scaleX = U_WIDTH / C_WIDTH;
    const scaleY = U_HEIGHT / C_HEIGHT;

    // The lowest scale is used to avoid cutting off parts of the canvas
    // Math.floor is used to get a integer value and avoid pixel distortion

    let scale = Math.floor(Math.min(scaleX, scaleY));
    
    // 1 is set as the minimun scale

    if (scale < 1) scale = 1;

    // Canvas is displayed with the final size

    canvas.style.width = (C_WIDTH * scale) + 'px';
    canvas.style.height = (C_HEIGHT * scale) + 'px';
}

// Resizes on page load
window.addEventListener('load', resizeGame);

// Resizes on window size change
window.addEventListener('resize', resizeGame);

/*--------------------------------------------------------------------*/

// CONTROLES DO PLAYER

window.addEventListener("keydown", (event) =>
{

    // Mudanças de tela

    if (event.key === "Enter" && gameState === "Menu") {
        gameState = "Jogo";
    }

    if (event.key === "Enter" && gameState === "Game Over") {
        init();
    }

    // Player 1

    if (p1 === true)
    
    {
    
        if (event.key === "w") jogador.pular();
        if (event.key === "d") jogador.andandoDireita = true;
        if (event.key === "a") jogador.andandoEsquerda = true;

        if (event.code === "ShiftLeft") 
        {
            if (jogador.podedash === true && !jogador.dandoDash)
            {
                jogador.dandoDash = true;
                jogador.velocidadeDash = 8;
                jogador.framesDash = 25;
                jogador.contadorFrames = 0;
                jogador.andandoEsquerda = false;
                jogador.andandoDireita = false;
                jogador.colldowndash = 120;
            }
        }    
        // Disparo com a Barra de Espaço , pessoa 4 eu mateus
        if (event.code === "Space") 
        {
            if (event.repeat) return; // Evita disparo contínuo ao segurar a tecla
            // demorei umas 3 horas pra isso ficar redondo

            // Cria o projétil na posição atual do jogador, ajustando a direção
            const direcaoTiro = jogador.viradoPra === -1 ? 'esquerda' : 'direita';
            // Ajusta a posição inicial para sair à frente do jogador
            const posX = jogador.viradoPra === -1 ? jogador.posicaoX - 10 : jogador.posicaoX + jogador.width;
        
            criarProjectil(projecteis, posX, jogador.posicaoY + 10, direcaoTiro);
        }
    }
    
    // Ativa o Player 2

    if (event.key === "y") p2 = true;

    // Player 2

    if (p2 === true)
    {
        if (event.key === "o") jogador2.pular();
        if (event.key === "ç") jogador2.andandoDireita = true;
        if (event.key === "k") jogador2.andandoEsquerda = true;

        if (event.key === "1") 
        {
            if (jogador2.podedash === true && !jogador2.dandoDash) 
            {
                jogador2.dandoDash = true;
                jogador2.velocidadeDash = 8;
                jogador2.framesDash = 25;
                jogador2.contadorFrames = 0;
                jogador2.andandoEsquerda = false;
                jogador2.andandoDireita = false;
                jogador2.colldowndash = 120;
            }
        }
        // Disparo para o jogador2 (exemplo com a tecla "M")
        if (event.code === "KeyM") {
            if (event.repeat) return;
        
            const direcaoTiroP2 = jogador2.viradoPra === -1 ? 'esquerda' : 'direita';
            const posX2 = jogador2.viradoPra === -1 ? jogador2.posicaoX - 10 : jogador2.posicaoX + jogador2.width;
        
            criarProjectil(projecteis, posX2, jogador2.posicaoY + 10, direcaoTiroP2);
        }
    }
})

window.addEventListener("keyup", (event) =>
{
    if (event.key === "d") jogador.andandoDireita = false;
    if (event.key === "a") jogador.andandoEsquerda = false;

    if (event.key === "ç") jogador2.andandoDireita = false;
    if (event.key === "k") jogador2.andandoEsquerda = false;
    if (event.key === "u") p2 = false;
})

/*--------------------------------------------------------------------*/

function init() {

    // Chama a função que carrega os assets

    carregarImagens(() => {
        // Assim que o navegador baixar tudo, chama a função animate e inicia o loop

        if (animacaoId) {
            cancelAnimationFrame(animacaoId);
        }

        p2 = false;
        jogador = new Player(100, 300, IMGS.player);
        jogador2 = new Player(500, 300, IMGS.player2);
        gameState = "Menu";
        backgroundAtual = new backgrounds({image: IMGS.menu, FramesT: 4, VFrames: 35});
        
        // Inicializando vida do Player 1
        jogador.lifePool[0] =
        new Heart ({
            x: 0,
            y: 0,
            image: IMGS.vidaP1
        })
        jogador.lifePool[1] =
        new Heart ({
            x: 32,
            y: 0,
            image: IMGS.vidaP1
        })
        jogador.lifePool[2] =
        new Heart ({
            x: 64,
            y: 0,
            image: IMGS.vidaP1
        })

        // Inicializando vida do Player 2
        jogador2.lifePool[0] =
        new Heart ({
            x: (C_WIDTH - 32),
            y: 0,
            image: IMGS.vidaP2
        })
        jogador2.lifePool[1] =
        new Heart ({
            x: (C_WIDTH - 64),
            y: 0,
            image: IMGS.vidaP2
        })
        jogador2.lifePool[2] =
        new Heart ({
            x: (C_WIDTH - 96),
            y: 0,
            image: IMGS.vidaP2
        })
        
        console.log("Jogo pronto");
        animacaoId = requestAnimationFrame(animate);
    });
}

function animate()
{
    animacaoId = requestAnimationFrame(animate);

    // Limpa o canvas

    ctx.clearRect (0, 0, canvas.width, canvas.height);

    // Desenha um fundo branco

    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);

    if (gameState !== "Jogo") {
        
        backgroundAtual.update(ctx); 

    } else {

        // Desenha o background atual

        desenharMapa(ctx, listaDeMapas[faseAtual]);
        
        if (jogador.vivo === false)
        {
            setTimeout(() =>
            {
            p1 = false;
            }, 2000);
        }

        if (jogador2.vivo === false)
        {
            setTimeout(() =>
            {
            p2 = false;
            }, 2000);
        }

        if(p1) 
        {
            // 1. Calcula as velocidades e atualiza animações
            jogador.update(canvas);

            // 2. Move no eixo X e checa colisões laterais imediatamente
            jogador.posicaoX += jogador.velocidadeX;
            checarColisaoMapaX(jogador, listaDeMapas[faseAtual]);

            // 3. Move no eixo Y e trata o chão/teto imediatamente
            jogador.posicaoY += jogador.velocidadeY;
            jogador.estaNoChao = false; // assume que está caindo até colidir por cima
            checarColisaoMapaY(jogador, listaDeMapas[faseAtual]);

            // 4. Renderiza o frame corrigido na tela
            jogador.draw(ctx);

            processarColisoesJogadorInimigos(jogador, inimigos, () =>  
            {
                jogador.levaDano(canvas);
                seraGameOver(jogador, jogador2, p2);
            });
        }

        if (p2 === true) 
        if(p1) 
        {
            // 1. Calcula as velocidades e atualiza animações
            jogador2.update(canvas);

            // 2. Move no eixo X e checa colisões laterais imediatamente
            jogador2.posicaoX += jogador2.velocidadeX;
            checarColisaoMapaX(jogador2, listaDeMapas[faseAtual]);

            // 3. Move no eixo Y e trata o chão/teto imediatamente
            jogador2.posicaoY += jogador2.velocidadeY;
            jogador2.estaNoChao = false; // assume que está caindo até colidir por cima
            checarColisaoMapaY(jogador2, listaDeMapas[faseAtual]);

            // 4. Renderiza o frame corrigido na tela
            jogador2.draw(ctx);

            processarColisoesJogadorInimigos(jogador2, inimigos, () =>  
            {
                jogador2.levaDano(canvas);
                seraGameOver(jogador, jogador2, p2);
            });
        }

        //pessoa 4 (mateus pro player) vou adicionar projeteis aqui
        
        atualizarProjecteis(projecteis, C_WIDTH);

        processarColisoesProjeteisInimigos(projecteis, inimigos);

        inimigos = inimigos.filter(i => !i.derrotado);

        desenharProjecteis(projecteis, ctx);

        console.log("Quantidade de tiros ativos:", projecteis.length);      

        inimigos.forEach(inimigo => {
            ctx.fillStyle = "purple";
            ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
        });
    }
}

init();
