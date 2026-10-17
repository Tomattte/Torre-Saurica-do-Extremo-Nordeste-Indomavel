// IMPORTS

// assetloader.js

import { carregarImagens, IMGS } from './assetloader.js';

// sprite.js

import { Sprite } from './sprite.js';

// players.js

import { Player } from './player.js';

let p2 = false;
const jogador = new Player(10, 0, "blue");
const jogador2 = new Player(310, 0, "red");
jogador2.width = 32;
jogador2.height = 32;

//TENTANDO CRIAR A PLATAFORMA
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './ASSETS/Platform_teste.jpg'
})

// inimigos.js
// colisoes.js

import { 
    criarProjectil, 
    atualizarProjecteis, 
    desenharProjecteis, 
    processarColisoesProjeteisInimigos,
    processarColisoesJogadorInimigos 
} from './colisoes.js';

// inimigos temporarios dia4
let inimigos = [
    { x: 300, y: 100, largura: 30, altura: 30, derrotado: false }
];

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];

/*--------------------------------------------------------------------*/

// CANVAS CONFIGURATION 

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// Variables to store the original canvas size

const C_WIDTH = 640; // canvas.width; (Anterior)
const C_HEIGHT = 384; // canvas.height; (Anterior)

canvas.width = C_WIDTH; // TESTE
canvas.height = C_HEIGHT; // TESTE

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


    // Disparo para o jogador2 (exemplo com a tecla "M")
    if (event.code === "KeyM") {
        if (event.repeat) return;
        
        const direcaoTiroP2 = jogador2.viradoPra === -1 ? 'esquerda' : 'direita';
        const posX2 = jogador2.viradoPra === -1 ? jogador2.posicaoX - 10 : jogador2.posicaoX + jogador2.width;
        
        criarProjectil(projecteis, posX2, jogador2.posicaoY + 10, direcaoTiroP2);
    }

});

window.addEventListener("keyup", (event) =>
{
    if (event.key === "d") jogador.andandoDireita = false;
    if (event.key === "a") jogador.andandoEsquerda = false;

    if (event.key === "ç") jogador2.andandoDireita = false;
    if (event.key === "k") jogador2.andandoEsquerda = false;
    if (event.key === "u") p2 = false;
});

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
    //TESTE PLATAFORMA
    background.update(ctx); // PLAT
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

animate();