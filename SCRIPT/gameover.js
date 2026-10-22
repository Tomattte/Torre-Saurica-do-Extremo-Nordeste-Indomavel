export function seraGameOver(jogador1, jogador2, p2Ativo) {
    let vidasP1 = jogador1.checaVida();
    
    if (vidasP1 <= 0) {
        return true;
    }
    
    if (p2Ativo && jogador2) {
        let vidasP2 = jogador2.checaVida();
        if (vidasP2 <= 0) {
            return true;
        }
    }
    
    return false;
}