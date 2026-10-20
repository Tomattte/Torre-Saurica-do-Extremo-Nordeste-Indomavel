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

// Variáveis de Vidas e HUD (Reta Final)
let vidas = 3;
let invencibilidadeFrames = 0;

// inimigos.js
import { Inimigo } from './enemy.js';

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];

// Lista de inimigos
let inimigos = [];

// Função para criar os inimigos nas plataformas do mapa
function criarInimigos() {
    inimigos = [
        new Inimigo(200, 288, 1, 150, 350), // Tipo 1: Patrulha no chão
        new Inimigo(400, 160, 2, 350, 550), // Tipo 2: Direção aleatória na plataforma
        new Inimigo(150, 96, 3, 100, 300)   // Tipo 3: Pula e dá mais dano
    ];
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    vidas = 3;
    invencibilidadeFrames = 0;
    projecteis.length = 0;
    jogador.posicaoX = 100;
    jogador.posicaoY = 250;
    jogador.velocidadeY = 0;
    criarInimigos();
    gameState = "Jogo";
}

// colisoes.js
import { 
    criarProjectil, 
    atualizarProjecteis, 
    desenharProjecteis, 
    processarColisoesProjeteisInimigos,
    processarColisoesJogadorInimigos,
    projecteis
} from './colisoes.js';

/*--------------------------------------------------------------------*/

//Variáveis Instanciadas

let jogador;
let jogador2;

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

// CONTROLES DO PLAYER

window.addEventListener("keydown", (event) =>
{
    if (event.key === "Enter") {
        if (gameState === "Menu" || gameState === "GameOver" || gameState === "Vitoria") {
            reiniciarJogo();
        }
    }

    if (gameState !== "Jogo") return;

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
    // Disparo com a Barra de Espaço
    if (event.code === "Space") {
        if (event.repeat) return; 
        const direcaoTiro = jogador.viradoPra === -1 ? 'esquerda' : 'direita';
        const posX = jogador.viradoPra === -1 ? jogador.posicaoX - 10 : jogador.posicaoX + jogador.width;
        
        criarProjectil(projecteis, posX, jogador.posicaoY + 10, direcaoTiro);
    }

    if (event.key === "Enter" && gameState === "Game Over") {
        init();
    }

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
        // Disparo para o jogador2 (exemplo com a tecla "M")
        if (event.code === "KeyM") {
            if (event.repeat) return;
        
            const direcaoTiroP2 = jogador2.viradoPra === -1 ? 'esquerda' : 'direita';
            const posX2 = jogador2.viradoPra === -1 ? jogador2.posicaoX - 10 : jogador2.posicaoX + jogador2.width;
        
            criarProjectil(projecteis, posX2, jogador2.posicaoY + 10, direcaoTiroP2);
        }
    }
    // Disparo para o jogador2
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
    carregarImagens(() => {
        jogador = new Player(10, 0, "blue");
        jogador2 = new Player(310, 0, "red");
        gameState = "Menu";
        backgroundAtual = new backgrounds({image: IMGS.menu});
        criarInimigos();
        
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

    ctx.clearRect (0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);

    if (gameState !== "Jogo") {
        
        backgroundAtual.update(ctx); 

    } else if (gameState === "Jogo") {

        // Desenha o background atual (mapa estático) sem os console.log lentos
        if (IMGS.MAPA1 && IMGS.MAPA1.complete) {
            ctx.drawImage(IMGS.MAPA1, 0, 0, canvas.width, canvas.height);
        }

        // Desenha o player 1
        jogador.update();
        resolverColisaoMapa(jogador, MAPA1);
        
        if (invencibilidadeFrames <= 0 || Math.floor(invencibilidadeFrames / 5) % 2 === 0) {
            jogador.draw(ctx);
        }

        processarColisoesJogadorInimigos(jogador, inimigos, () => {
            jogador.levaDano();
            seraGameOver(jogador, jogador2, p2);
        });

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
    
        // Atualiza projéteis
        atualizarProjecteis(projecteis, C_WIDTH, MAPA1);

        processarColisoesProjeteisInimigos(projecteis, inimigos);

        processarColisoesJogadorInimigos(jogador, inimigos, () => {
            if (invencibilidadeFrames <= 0) {
                vidas--;
                invencibilidadeFrames = 90; // ~1.5 segundos de invencibilidade
                console.log("O jogador foi atingido! Vidas restantes:", vidas);
                
                if (vidas <= 0) {
                    gameState = "GameOver";
                }
            }
        });

        if (invencibilidadeFrames > 0) {
            invencibilidadeFrames--;
        }

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

        // Desenha o HUD (Vidas e Inimigos Restantes)
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Vidas: ${vidas}`, 20, 30);
        ctx.fillText(`Inimigos Restantes: ${inimigosRestantes}`, 20, 55);

    } else if (gameState === "GameOver" || gameState === "Vitoria") {
        // Telas de Fim de Jogo
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