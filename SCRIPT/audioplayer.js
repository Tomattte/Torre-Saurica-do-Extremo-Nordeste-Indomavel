import { TRACKS } from './assetloader.js';

// Variável para guardar a referência da música que está tocando atualmente
let musicaAtual = null;

export function tocarMusicaFundo(novaMusica) {

    // Confere se tem outra música tocando

    if (musicaAtual !== novaMusica) {

        // Se musicaAtual não for null, pausa ela e reseta ela

        if (musicaAtual) {
            musicaAtual.pause();
            musicaAtual.currentTime = 0;
        }
        // Define música desejada como a atual
        musicaAtual = novaMusica;
        musicaAtual.currentTime = 0;
        musicaAtual.loop = true;
        musicaAtual.volume = 0.15;
    }

    // Se a música desejada estiver pausada, da play nela

    if (musicaAtual.paused) {
        musicaAtual.play().catch(erro => {
            // Continua ignorando o erro silenciosamente até que o usuário interaja de vez
        });
    }
}

export function tocarEfeitoSonoro(Efeito) {

    if (!Efeito) return;

    // Reseta o áudio para o início caso ele já estivesse tocando

    Efeito.currentTime = 0;

    Efeito.volume = 0.3;
    Efeito.play().catch(erro => {
        // Ignora caso o navegador bloqueie antes da primeira interação
    });
}