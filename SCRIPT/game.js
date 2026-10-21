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

// hearts.js
import { Heart } from './hearts.js';

// inimigos.js
import { Inimigo } from './enemy.js';

// gameover.js
import { seraGameOver } from './gameover.js';

// colisoes.js
import { 
    criarProjectil, 
    atualizarProjecteis, 
    desenharProjecteis, 
    processarColisoesProjeteisInimigos,
    processarColisoesJogadorInimigos, 
    resolverColisaoMapa
} from './colisoes.js';

/*--------------------------------------------------------------------*/

let jogador;
let jogador2;
let p2 = false;
let gameState = "Menu";
let backgroundAtual;
let animacaoId;

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];

// Lista de inimigos
let inimigos = [];

// Função para criar os inimigos nas plataformas do mapa
function criarInimigos() {
    inimigos = [
        new Inimigo(200, 288, 1, 150, 350), 
        new Inimigo(400, 160, 2, 350, 550), 
        new Inimigo(150, 96, 3, 100, 300)   
    ];
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    projecteis.length = 0;
    jogador.posicaoX = 100;
    jogador.posicaoY = 250;
    jogador.velocidadeY = 0;
    
    // Reinicia corações do Player 1
    if (jogador.lifePool) {
        jogador.lifePool.forEach(heart => heart.broken = false);
    }
    // Reinicia corações do Player 2 se existir
    if (jogador2 && jogador2.lifePool) {
        jogador2.lifePool.forEach(heart => heart.broken = false);
    }

    criarInimigos();
    gameState = "Jogo";
}

/*--------------------------------------------------------------------*/
// CANVAS CONFIGURATION 

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const C_WIDTH = canvas.width;
const C_HEIGHT = canvas.height;

function resizeGame() {
    const U_WIDTH = window.innerWidth;
    const U_HEIGHT = window.innerHeight;
    const scaleX = U_WIDTH / C_WIDTH;
    const scaleY = U_HEIGHT / C_HEIGHT;
    let scale = Math.floor(Math.min(scaleX, scaleY));
    if (scale < 1) scale = 1;
    canvas.style.width = (C_WIDTH * scale) + 'px';
    canvas.style.height = (C_HEIGHT * scale) + 'px';
}

window.addEventListener('load', resizeGame);
window.addEventListener('resize', resizeGame);

/*--------------------------------------------------------------------*/
// CONTROLES DO PLAYER

window.addEventListener("keydown", (event) =>
{
    if (event.key === "Enter") {
        if (gameState === "Menu" || gameState === "GameOver" || gameState === "Vitoria") {
            reiniciarJogo();
        }
    }

    if (gameState !== "Jogo") return;

    // Player 1
    if (jogador && jogador.vivo) {
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
        // Disparo P1
        if (event.code === "Space") {
            if (event.repeat) return; 
            const direcaoTiro = jogador.viradoPra === -1 ? 'esquerda' : 'direita';
            const posX = jogador.viradoPra === -1 ? jogador.posicaoX - 10 : jogador.posicaoX + jogador.width;
            criarProjectil(projecteis, posX, jogador.posicaoY + 10, direcaoTiro);
        }
    }

    // Ativa o Player 2
    if (event.key === "y") p2 = true;

    // Player 2
    if (p2 === true && jogador2 && jogador2.vivo) {
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
        // Disparo P2
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
    if (event.key === "y") p2 = false; // Ajustado para desligar com a mesma tecla y
})

/*--------------------------------------------------------------------*/

function init() {
    carregarImagens(() => {
        if (animacaoId) {
            cancelAnimationFrame(animacaoId);
        }

        p2 = false;
        jogador = new Player(10, 0, "blue");
        jogador2 = new Player(310, 0, "red");
        gameState = "Menu";
        backgroundAtual = new backgrounds({image: IMGS.menu});
        criarInimigos();
        
        // Inicializando vida do Player 1 (Corações)
        jogador.lifePool = [
            new Heart({ x: 20, y: 15, image: IMGS.vidaP1 }),
            new Heart({ x: 55, y: 15, image: IMGS.vidaP1 }),
            new Heart({ x: 90, y: 15, image: IMGS.vidaP1 })
        ];

        // Inicializando vida do Player 2 (Corações)
        jogador2.lifePool = [
            new Heart({ x: C_WIDTH - 40, y: 15, image: IMGS.vidaP2 }),
            new Heart({ x: C_WIDTH - 75, y: 15, image: IMGS.vidaP2 }),
            new Heart({ x: C_WIDTH - 110, y: 15, image: IMGS.vidaP2 })
        ];
        
        console.log("Jogo pronto");
        animacaoId = requestAnimationFrame(animate);
    });
}

function animate()
{
    animacaoId = requestAnimationFrame(animate);

    ctx.clearRect (0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);

    if (gameState !== "Jogo") {
        backgroundAtual.update(ctx); 
    } else {
        // Desenha o mapa da branch mateus
        desenharMapa(ctx, MAPA1, IMGS.MAPA1);

        // Atualiza e desenha o player 1
        jogador.update();
        resolverColisaoMapa(jogador, MAPA1);
        jogador.draw(ctx);

        processarColisoesJogadorInimigos(jogador, inimigos, () => {
            jogador.levaDano();
            seraGameOver(jogador, jogador2, p2);
        });

        // Atualiza e desenha o player 2 se ativo
        if (p2 === true) 
        {
            jogador2.update();
            resolverColisaoMapa(jogador2, MAPA1);
            jogador2.draw(ctx);

            processarColisoesJogadorInimigos(jogador2, inimigos, () => {
                jogador2.levaDano();
                seraGameOver(jogador2, jogador, p2);
            });
        }
    
        // Atualiza projéteis exigindo o mapa da mateus
        atualizarProjecteis(projecteis, C_WIDTH, MAPA1);
        processarColisoesProjeteisInimigos(projecteis, inimigos);

        inimigos = inimigos.filter(i => !i.derrotado);
        desenharProjecteis(projecteis, ctx);      

        // Atualiza e desenha os inimigos
        inimigos.forEach(inimigo => {
            inimigo.update(MAPA1);
            inimigo.draw(ctx);
        });

        // Verifica condição de vitória
        const inimigosRestantes = inimigos.length;
        if (inimigosRestantes === 0 && gameState === "Jogo") {
            gameState = "Vitoria";
        }

        // Desenha o HUD de Inimigos Restantes (as vidas já são desenhadas pelos corações no draw do player)
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Inimigos Restantes: ${inimigosRestantes}`, 20, 65);

        // Desenha os corações na tela para cada jogador
        jogador.lifePool.forEach(h => h.draw(ctx));
        if (p2) {
            jogador2.lifePool.forEach(h => h.draw(ctx));
        }

    } else if (gameState === "GameOver" || gameState === "Vitoria") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        
        if (gameState === "GameOver") {
            ctx.fillText("GAME OVER", C_WIDTH / 2, C_HEIGHT / 2 - 20);
        } else {
            ctx.fillText("VOCÊ VENCEU!", C_WIDTH / 2, C_HEIGHT / 2 - 20);
        }

        ctx.font = "16px Arial";
        ctx.fillText("Pressione [ ENTER ] para reiniciar", C_WIDTH / 2, C_HEIGHT / 2 + 20);
    }
}

init();