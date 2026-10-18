// CRIADA POR JOAO SEGUINDO OS ENSINAMENTOS DO VIDEO
/*
export class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.loaded = false;

        // SE TIVER PRONTA ELA APARECE
        this.image.onload = () => {
            this.loaded = true;
        };
    }

    draw(ctx) {
    if (!this.loaded) return;
    // TENTA OCUPAR GERAL
    ctx.drawImage(this.image, this.position.x, this.position.y, ctx.canvas.width, ctx.canvas.height);
}

    update(ctx) {
        this.draw(ctx);
    }
}
*/
export class backgrounds {
    constructor({image}) {
        this.position = {
            x: 0,
            y: 0
        }
        this.image = image;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }

    update(ctx) {
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
