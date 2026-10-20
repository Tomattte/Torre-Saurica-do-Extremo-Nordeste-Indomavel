import { GameOver } from './game.js';

export function seraGameOver(player, outroPlayer, p2) {
    const lifeAtual = player.checaVida();
    if (lifeAtual < 1) {
        player.vivo = false;
        if (!p2 || outroPlayer.vivo === false) {
            setTimeout(() => {
                GameOver();
            }, 2000)
        }
    }
}