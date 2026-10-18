// IMPORTS

// assetloader.js

import { carregarImagens, IMGS } from './assetloader.js';

// mapas

import { MAPA1 } from '../MAPAS/MAPA1.js';
import { MAPA2 } from '../MAPAS/MAPA2.js';
import { MAPA3 } from '../MAPAS/MAPA3.js';

// background.js

import { backgrounds } from './backgrounds.js';
import { desenharMapa } from './backgrounds.js';

// players.js

import { Player } from './player.js';

let p2 = false;
let jogador;
let jogador2;
let gameState = "Menu";
let backgroundAtual;

// inimigos.js

// colisoes.js

import { 
    criarProjectil, 
    atualizarProjecteis, 
    desenharProjecteis, 
    processarColisoesProjeteisInimigos,
    processarColisoesJogadorInimigos 
} from './colisoes.js';

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];


// inimigos temporarios dia4
let inimigos = [
    { x: 300, y: 100, largura: 30, altura: 30, derrotado: false }
];

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
    if (event.key === "Enter" && gameState === "Menu") {
        gameState = "Jogo";
        
        //backgroundAtual.image = IMGS.plataforma;
    }
    //Player 1
    if (event.key === "w") jogador.pular();
    if (event.key === "d") 
    {
        jogador.andandoDireita = true;
        jogador.viradoPra = 1;
    }
    if (event.key === "a") 
    {
        jogador.andandoEsquerda = true;
        jogador.viradoPra = -1;
    }
    if (event.code === "ShiftLeft") 
    {
        if (jogador.podedash === true)
        {
            jogador.dandoDash = true;
            jogador.framesDash = 3;
            jogador.andandoEsquerda = false;
            jogador.andandoDireita = false;
            jogador.colldowndash = 120;
        }
    }
    // Disparo com a Barra de Espaço , pessoa 4 eu mateus
    if (event.code === "Space") {
        if (event.repeat) return; // Evita disparo contínuo ao segurar a tecla
        // demorei umas 3 horas pra isso ficar redondo
        // Cria o projétil na posição atual do jogador, ajustando a direção
        const direcaoTiro = jogador.viradoPra === -1 ? 'esquerda' : 'direita';
        // Ajusta a posição inicial para sair à frente do jogador
        const posX = jogador.viradoPra === -1 ? jogador.posicaoX - 10 : jogador.posicaoX + jogador.width;
        
        criarProjectil(projecteis, posX, jogador.posicaoY + 10, direcaoTiro);
    }

    //Player 2
    if (event.key === "o") jogador2.pular();
    if (event.key === "ç")
    {
        jogador2.andandoDireita = true;
        jogador2.viradoPra = 1;
    }
    if (event.key === "k")
    {
        jogador2.andandoEsquerda = true;
        jogador2.viradoPra = -1;
    }
    if (event.key === "y") p2 = true;

    if (event.key === "1") 
    {
        if (jogador2.podedash === true)
        {
            jogador2.dandoDash = true;
            jogador2.framesDash = 3;
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

        jogador = new Player(10, 0, "blue");
        jogador2 = new Player(310, 0, "red");
        backgroundAtual = new backgrounds({image: IMGS.menu});
        
        console.log("Jogo pronto");
        requestAnimationFrame(animate);
    });
}

function animate()
{
    requestAnimationFrame(animate);

    // Limpa o canvas

    ctx.clearRect (0, 0, canvas.width, canvas.height);

    // Desenha um fundo branco

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);

    if (gameState === "Menu") {
        
        backgroundAtual.update(ctx); 

    } else {

        // Desenha o background atual

        desenharMapa(ctx, MAPA1, IMGS.MAPA1);

        //Desenha o player se o jogo tiver começado

        jogador.update();
        jogador.draw(ctx);

        if (p2 === true) 
        {
            jogador2.update();
            jogador2.draw(ctx);
        }

        //pessoa 4 (mateus pro player) vou adicionar projeteis aqui
        
        atualizarProjecteis(projecteis, C_WIDTH);

        processarColisoesProjeteisInimigos(projecteis, inimigos);

        processarColisoesJogadorInimigos(jogador, inimigos, () => {
            console.log("O jogador foi atingido pelo inimigo!");
            // Aqui podes chamar a função de perder vida da Pessoa 5 futuramente
        });

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
