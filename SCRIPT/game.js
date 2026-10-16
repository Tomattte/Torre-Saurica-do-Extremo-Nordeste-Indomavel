// IMPORTS

// assetloader.js

import { carregarImagens, IMGS } from './assetloader.js';

// players.js

import { Player } from './player.js';

let p2 = false;
const jogador = new Player(10, 0, "blue");
const jogador2 = new Player(310, 0, "red");
jogador2.width = 32;
jogador2.height = 32;

// inimigos.js

// colisoes.js

import { criarProjectil } from './colisoes.js';
import { atualizarProjecteis } from './colisoes.js';
import { desenharProjecteis } from './colisoes.js'

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];

/*--------------------------------------------------------------------*/

// CANVAS CONFIGURATION 

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// Variables to store the original canvas size

const C_WIDTH = canvas.width;
const C_HEIGHT = canvas.height;

/*
const MenuIMG = new Image();
MenuIMG.src = 'IMG/Menu_prototipo.png';

c.drawImage(MenuIMG, 0, 0)
*/

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
        
        console.log("Jogo pronto");
        requestAnimationFrame(animate);
    });
}

function animate()
{
    requestAnimationFrame(animate);

    ctx.clearRect (0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);
    jogador.update();
    jogador.draw(ctx);

    if (p2 === true) 
    {
        jogador2.update();
        jogador2.draw(ctx);
    }
}

animate();