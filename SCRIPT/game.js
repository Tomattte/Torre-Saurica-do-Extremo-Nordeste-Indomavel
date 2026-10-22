// IMPORTS
import { carregarImagens, IMGS } from './assetloader.js';
import { MAPA1 } from '../MAPAS/MAPA1.js';
import { MAPA2 } from '../MAPAS/MAPA2.js';
import { MAPA3 } from '../MAPAS/MAPA3.js';
import { backgrounds } from './backgrounds.js';
import { desenharMapa } from './backgrounds.js';
import { Player } from './player.js';
import { Heart } from './hearts.js';
import { Inimigo } from './enemy.js';
import { seraGameOver } from './gameover.js';
import { 
    criarProjectil, 
    atualizarProjecteis, 
    desenharProjecteis, 
    processarColisoesProjeteisInimigos,
    processarColisoesJogadorInimigos, 
    resolverColisaoMapa
} from './colisoes.js';

// Sons do tiro e do acerto
const somTiro = new Audio('ASSETS/universfield-pistol-shot-278821 (6).mp3');

let jogador;
let jogador2;
let p2 = false;
let gameState = "Menu";
let backgroundAtual;
let animacaoId;

const projecteis = [];
let inimigos = [];

function criarInimigos() {
    inimigos = [
        new Inimigo(200, 288, 1, 100, 400), 
        new Inimigo(400, 160, 2, 200, 500), 
        new Inimigo(150, 96, 3, 50, 350)   
    ];
}

function reiniciarJogo() {
    projecteis.length = 0;
    jogador.posicaoX = 100;
    jogador.posicaoY = 250;
    jogador.velocidadeY = 0;
    jogador.vivo = true;
    
    if (jogador.lifePool) {
        jogador.lifePool.forEach(heart => heart.broken = false);
    }
    
    if (jogador2) {
        p2 = false;
        jogador2.posicaoX = 310;
        jogador2.posicaoY = 250;
        jogador2.velocidadeY = 0;
        jogador2.vivo = true;
        if (jogador2.lifePool) {
            jogador2.lifePool.forEach(heart => heart.broken = false);
        }
    }

    criarInimigos();
    gameState = "Jogo";
}

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

// CONTROLES
window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (gameState === "Menu" || gameState === "GameOver" || gameState === "Vitoria") {
            reiniciarJogo();
        }
    }

    if (gameState !== "Jogo") return;

    // Player 1
    if (jogador && jogador.vivo) {
        if (event.key === "w") jogador.pular();
        if (event.key === "d") { jogador.andandoDireita = true; jogador.viradoPra = 1; }
        if (event.key === "a") { jogador.andandoEsquerda = true; jogador.viradoPra = -1; }
        if (event.code === "ShiftLeft" && jogador.podedash) {
            jogador.dandoDash = true;
            jogador.framesDash = 3;
            jogador.andandoEsquerda = false;
            jogador.andandoDireita = false;
            jogador.colldowndash = 120;
        }
        if (event.code === "Space" && !event.repeat) {
            const direcaoTiro = jogador.viradoPra === -1 ? 'esquerda' : 'direita';
            const posX = jogador.viradoPra === -1 ? jogador.posicaoX - 10 : jogador.posicaoX + jogador.width;
            criarProjectil(projecteis, posX, jogador.posicaoY + 10, direcaoTiro);   
            somTiro.currentTime = 0;
            somTiro.play();
        }
    }

    if (event.key === "y") p2 = true;

    // Player 2
    if (p2 && jogador2 && jogador2.vivo) {
        if (event.key === "o") jogador2.pular();
        if (event.key === "ç") { jogador2.andandoDireita = true; jogador2.viradoPra = 1; }
        if (event.key === "k") { jogador2.andandoEsquerda = true; jogador2.viradoPra = -1; }
        if (event.key === "1" && jogador2.podedash) {
            jogador2.dandoDash = true;
            jogador2.framesDash = 3;
            jogador2.andandoEsquerda = false;
            jogador2.andandoDireita = false;
            jogador2.colldowndash = 120;
        }
        if (event.code === "KeyM" && !event.repeat) {
            const direcaoTiroP2 = jogador2.viradoPra === -1 ? 'esquerda' : 'direita';
            const posX2 = jogador2.viradoPra === -1 ? jogador2.posicaoX - 10 : jogador2.posicaoX + jogador2.width;
            criarProjectil(projecteis, posX2, jogador2.posicaoY + 10, direcaoTiroP2);
            somTiro.currentTime = 0;
            somTiro.play();
        }
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key === "d") jogador.andandoDireita = false;
    if (event.key === "a") jogador.andandoEsquerda = false;
    if (jogador2) {
        if (event.key === "ç") jogador2.andandoDireita = false;
        if (event.key === "k") jogador2.andandoEsquerda = false;
    }
});

function init() {
    carregarImagens(() => {
        if (animacaoId) cancelAnimationFrame(animacaoId);

        p2 = false;
        jogador = new Player(10, 0, "blue");
        jogador2 = new Player(310, 0, "red");
        gameState = "Menu";
        backgroundAtual = new backgrounds({ image: IMGS.menu });
        criarInimigos();
        
        jogador.lifePool = [
            new Heart({ x: 20, y: 15, image: IMGS.vidaP1 }),
            new Heart({ x: 55, y: 15, image: IMGS.vidaP1 }),
            new Heart({ x: 90, y: 15, image: IMGS.vidaP1 })
        ];

        jogador2.lifePool = [
            new Heart({ x: C_WIDTH - 40, y: 15, image: IMGS.vidaP2 }),
            new Heart({ x: C_WIDTH - 75, y: 15, image: IMGS.vidaP2 }),
            new Heart({ x: C_WIDTH - 110, y: 15, image: IMGS.vidaP2 })
        ];
        
        animacaoId = requestAnimationFrame(animate);
    });
}

function animate() {
    animacaoId = requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. ESTADO DE MENU
    if (gameState === "Menu") {
        ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
        if (backgroundAtual && backgroundAtual.image) {
            ctx.drawImage(backgroundAtual.image, 0, 0, C_WIDTH, C_HEIGHT);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);
        }
    } 
    // 2. ESTADO DE JOGO
    else if (gameState === "Jogo") {
        if (IMGS && IMGS.MAPA1) {
            ctx.drawImage(IMGS.MAPA1, 0, 0, C_WIDTH, C_HEIGHT);
        } else {
            ctx.fillStyle = "#1a1a2e";
            ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);
        }

        // Desenha as plataformas do mapa
        desenharMapa(ctx, MAPA1, IMGS.MAPA1);
        
        /**
         * 
        
        // DEBUG: mostra em vermelho os blocos que a colisão usa (remova depois de testar)
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            MAPA1.layers[1].data.forEach((tile, i) => {
                if (tile !== 0) {
                    ctx.fillRect((i % MAPA1.width) * 32, Math.floor(i / MAPA1.width) * 32, 32, 32);
                 }
            });
        */
        // Atualiza e desenha o Player 1
        if (jogador && jogador.vivo) {
            jogador.update();
            resolverColisaoMapa(jogador, MAPA1);
            jogador.draw(ctx);

            processarColisoesJogadorInimigos(jogador, inimigos, () => {
                jogador.levaDano();
                if (seraGameOver(jogador, jogador2, p2)) {
                    gameState = "GameOver";
                }
            });

            let vidasP1Restantes = jogador.lifePool.filter(h => !h.broken).length;
            if (vidasP1Restantes <= 0) {
                jogador.vivo = false;
                gameState = "GameOver";
            }
        }

        // Atualiza e desenha o Player 2 (se ativo)
        if (p2 && jogador2 && jogador2.vivo) {
            jogador2.update();
            resolverColisaoMapa(jogador2, MAPA1);
            jogador2.draw(ctx);

            processarColisoesJogadorInimigos(jogador2, inimigos, () => {
                jogador2.levaDano();
                if (seraGameOver(jogador2, jogador, p2)) {
                    gameState = "GameOver";
                }
            });

            let vidasP2Restantes = jogador2.lifePool.filter(h => !h.broken).length;
            if (vidasP2Restantes <= 0) {
                jogador2.vivo = false;
                gameState = "GameOver";
            }
        }
    
        // Projéteis e Inimigos
        atualizarProjecteis(projecteis, C_WIDTH, MAPA1);
        processarColisoesProjeteisInimigos(projecteis, inimigos);

        inimigos = inimigos.filter(i => !i.derrotado);
        desenharProjecteis(projecteis, ctx);      

        inimigos.forEach(inimigo => {
            if (inimigo.posicaoX < 0) inimigo.posicaoX = 0;
            if (inimigo.posicaoX > C_WIDTH - 30) inimigo.posicaoX = C_WIDTH - 30;

            inimigo.update(MAPA1);
            inimigo.draw(ctx);
        });

        // Condição de Vitória
        const inimigosRestantes = inimigos.length;
        if (inimigosRestantes === 0) {
            gameState = "Vitoria";
        }

        // HUD / Textos e Corações
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Inimigos Restantes: ${inimigosRestantes}`, 20, 65);

        if (jogador && jogador.lifePool) {
            jogador.lifePool.forEach(h => h.draw(ctx));
        }
        if (p2 && jogador2 && jogador2.lifePool) {
            jogador2.lifePool.forEach(h => h.draw(ctx));
        }
    } 
    // 3. TELA DE GAME OVER OU VITÓRIA
    else if (gameState === "GameOver" || gameState === "Vitoria") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
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