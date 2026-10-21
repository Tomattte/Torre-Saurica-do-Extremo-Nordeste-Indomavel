export class backgrounds {
    constructor({ image, FramesT = 1, VFrames = 10 }) {
        this.position = {
            x: 0,
            y: 0
        };
        this.image = image;
        
        // Propriedades necessárias para a animação do background

        this.FrameW = 640;          // Width
        this.FrameH = 360;          // Height
        this.FramesT = FramesT;     // Quantidade de frames (por padrão é 1)
        this.FrameAtual = 0;        // Define o 0 como frame inicial
        this.contadorFrames = 0;    // Controla a velocidade de troca
        this.VFrames = VFrames;     // Define quantos frames são necessárias para trocar para a próxima imagem
    }

    draw(ctx) {
        
        // Se o background tiver mais de 1 frame, desenha a parte atual da sprite sheet

        if (this.FramesT > 1) {
            ctx.drawImage(
                this.image,
                this.FrameAtual * this.FrameW,       // sourceX: corta a partir do X do frame atual
                0,                                   // sourceY: topo da imagem
                this.FrameW,                         // sourceWidth: largura do frame (640)
                this.FrameH,                         // sourceHeight: altura do frame (360)
                this.position.x,                     // destX: onde desenha na tela
                this.position.y,                     // destY: onde desenha na tela
                this.FrameW,                         // destWidth: largura exibida
                this.FrameH                          // destHeight: altura exibida
            );
        } else {

            // Se o background tiver só 1 frame definido, apenas desenha ele

            ctx.drawImage(this.image, this.position.x, this.position.y);
        }
    }

    update(ctx) {
        // Se houver mais de 1 frame, avança a animação progressivamente
        if (this.FramesT > 1) {
            this.contadorFrames++;
            if (this.contadorFrames >= this.VFrames) {
                this.contadorFrames = 0;
                this.FrameAtual = (this.FrameAtual + 1) % this.FramesT; // Vai de 0 até (FramesT - 1) e reinicia
            }
        }
        this.draw(ctx);
    }
}

export function desenharMapa(ctx, ObjMapa, ImgMapa) {
    if (!ObjMapa || !ObjMapa.layers) return;

    const tileSize = 32;
    const colunasMapa = ObjMapa.width || Math.floor(C_WIDTH / tileSize);

    ObjMapa.layers.forEach((layer) => {
        if (layer.type === 'tilelayer' || layer.data) {
            const data = layer.data;

            for (let i = 0; i < data.length; i++) {
                const tileId = data[i];
                if (tileId === 0) continue; // PULA OS BLOCO

                const x = (i % colunasMapa) * tileSize;
                const y = Math.floor(i / colunasMapa) * tileSize;

                // Verifica se a imagem do tileset já terminou de carregar
                if (ImgMapa && ImgMapa.complete && ImgMapa.naturalWidth !== 0) {
                    const colunasTileset = Math.floor(ImgMapa.width / tileSize);
                    const srcX = ((tileId - 1) % colunasTileset) * tileSize;
                    const srcY = Math.floor((tileId - 1) / colunasTileset) * tileSize;

                    ctx.drawImage(
                        ImgMapa,
                        srcX, srcY, tileSize, tileSize,
                        x, y, tileSize, tileSize
                    );
                } else {
                    ctx.fillStyle = "#555555";
                    ctx.fillRect(x, y, tileSize, tileSize);
                }
            }
        }
    });
}
