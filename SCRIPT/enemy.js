export class Inimigo {
    constructor(x, y, tipo = 1, xMin = 0, xMax = 640) {
        this.posicaoX = x;
        this.posicaoY = y;
        this.width = 32;
        this.height = 32;
        this.tipo = tipo; // 1: Patrulha horizontal, 2: Direção aleatória, 3: Pula e maior dano
        this.velocidadeX = 1.5;
        this.velocidadeY = 0;
        this.gravidade = 0.4;
        this.estaNoChao = false;
        this.derrotado = false;
        
        // Limites de patrulha para o Tipo 1
        this.xMin = xMin;
        this.xMax = xMax;

        // Timers para comportamentos baseados em intervalos (2 a 5 segundos = 120 a 300 frames)
        this.timer = 0;
        this.intervalo = Math.floor(Math.random() * 181) + 120;
        
        // Dano baseado no tipo
        this.dano = tipo === 3 ? 2 : 1;
    }

    update(mapa) {
        if (this.derrotado) return;

        this.timer++;

        if (this.tipo === 1) {
            // Anda de um lado para o outro entre xMin e xMax
            this.posicaoX += this.velocidadeX;
            if (this.posicaoX <= this.xMin || this.posicaoX + this.width >= this.xMax) {
                this.velocidadeX *= -1;
            }
        } else if (this.tipo === 2) {
            // Sorteia nova direção a cada intervalo
            if (this.timer >= this.intervalo) {
                this.velocidadeX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
                this.timer = 0;
                this.intervalo = Math.floor(Math.random() * 181) + 120;
            }
            this.posicaoX += this.velocidadeX;
        } else if (this.tipo === 3) {
            // Pula a cada intervalo se estiver no chão
            if (this.timer >= this.intervalo && this.estaNoChao) {
                this.velocidadeY = -8;
                this.timer = 0;
                this.intervalo = Math.floor(Math.random() * 181) + 120;
            }
        }

        // Aplica gravidade e colisão com o mapa para o inimigo andar nas plataformas
        this.velocidadeY += this.gravidade;
        this.posicaoY += this.velocidadeY;
        this.estaNoChao = false;

        this.resolverColisaoInimigoMapa(mapa);
    }

    resolverColisaoInimigoMapa(mapa) {
        if (!mapa || !mapa.layers) return;
        const tileSize = mapa.tileheight || 32;
        const colunas = mapa.width;
        const camadaColisao = mapa.layers[1];
        if (!camadaColisao || !camadaColisao.data) return;

        const data = camadaColisao.data;

        for (let i = 0; i < data.length; i++) {
            if (data[i] === 0) continue;

            const blocoX = (i % colunas) * tileSize;
            const blocoY = Math.floor(i / colunas) * tileSize;
            const bloco = { x: blocoX, y: blocoY, largura: tileSize, altura: tileSize };

            // Verifica colisão AABB
            if (
                this.posicaoX < bloco.x + bloco.largura &&
                this.posicaoX + this.width > bloco.x &&
                this.posicaoY < bloco.y + bloco.altura &&
                this.posicaoY + this.height > bloco.y
            ) {
                // Calcula sobreposições para saber se bateu por cima ou pelos lados
                const sobreposicaoEsquerda = (this.posicaoX + this.width) - bloco.x;
                const sobreposicaoDireita = (bloco.x + bloco.largura) - this.posicaoX;
                const sobreposicaoTopo = (this.posicaoY + this.height) - bloco.y;
                const sobreposicaoBaixo = (bloco.y + bloco.altura) - this.posicaoY;

                const menorX = Math.min(sobreposicaoEsquerda, sobreposicaoDireita);
                const menorY = Math.min(sobreposicaoTopo, sobreposicaoBaixo);

                if (menorX < menorY) {
                    // Colisão Lateral: bateu na parede, inverte a velocidade e empurra para fora
                    if (sobreposicaoEsquerda < sobreposicaoDireita) {
                        this.posicaoX = bloco.x - this.width;
                    } else {
                        this.posicaoX = bloco.x + bloco.largura;
                    }
                    this.velocidadeX *= -1; // Inverte o sentido do movimento ao bater na parede
                } else {
                    // Colisão Vertical (Chão)
                    if (sobreposicaoTopo < sobreposicaoBaixo && this.velocidadeY >= 0) {
                        this.posicaoY = bloco.y - this.height;
                        this.velocidadeY = 0;
                        this.estaNoChao = true;
                    } else if (this.velocidadeY < 0) {
                        this.posicaoY = bloco.y + bloco.altura;
                        this.velocidadeY = 0;
                    }
                }
            }
        }
    }

    draw(ctx) {
        if (this.derrotado) return;

        // Cores diferentes para cada tipo de inimigo
        if (this.tipo === 1) ctx.fillStyle = "purple";
        else if (this.tipo === 2) ctx.fillStyle = "orange";
        else ctx.fillStyle = "darkred";

        ctx.fillRect(this.posicaoX, this.posicaoY, this.width, this.height);
    }
}