export class backgrounds {
    constructor({ image, FramesT = 1, VFrames = 10 }) {
        this.position = {
            x: 0,
            y: 0
        };
        this.image = image;
        
        this.FrameW = 640;          
        this.FrameH = 360;          
        this.FramesT = FramesT;     
        this.FrameAtual = 0;        
        this.contadorFrames = 0;    
        this.VFrames = VFrames;     
    }

    draw(ctx) {
        if (this.FramesT > 1) {
            ctx.drawImage(
                this.image,
                this.FrameAtual * this.FrameW,       
                0,                                   
                this.FrameW,                         
                this.FrameH,                         
                this.position.x,                     
                this.position.y,                     
                this.FrameW,                         
                this.FrameH                          
            );
        } else {
            ctx.drawImage(this.image, this.position.x, this.position.y);
        }
    }

    update(ctx) {
        if (this.FramesT > 1) {
            this.contadorFrames++;
            if (this.contadorFrames >= this.VFrames) {
                this.contadorFrames = 0;
                this.FrameAtual = (this.FrameAtual + 1) % this.FramesT; 
            }
        }
        this.draw(ctx);
    }
}

// Objeto interno para gerenciar o cache das imagens em uso
const imagensTilesets = {};

export function carregarImagensDoMapa(ObjMapa) {
    if (!ObjMapa || !ObjMapa.tilesets) return;
    
    // Limpa registros anteriores para evitar vazamento de memória
    for (const key in imagensTilesets) delete imagensTilesets[key];

    // Carrega dinamicamente cada folha de blocos do JSON do Tiled
    ObjMapa.tilesets.forEach(ts => {
        const img = new Image();
        img.src = ts.image;
        imagensTilesets[ts.name] = img;
    });
}

export function desenharMapa(ctx, ObjMapa) {
    if (!ObjMapa || !ObjMapa.layers) return;

    const tileSize = 32;
    const colunasMapa = ObjMapa.width;

    ObjMapa.layers.forEach((layer) => {
        if (!layer.visible || layer.type !== 'tilelayer' || !layer.data) return;

        const data = layer.data;

        for (let i = 0; i < data.length; i++) {
            const tileId = data[i];
            if (tileId === 0) continue; 

            let tilesetCorreta = null;
            for (let j = ObjMapa.tilesets.length - 1; j >= 0; j--) {
                if (tileId >= ObjMapa.tilesets[j].firstgid) {
                    tilesetCorreta = ObjMapa.tilesets[j];
                    break;
                }
            }

            if (!tilesetCorreta) continue;

            const ImgMapa = imagensTilesets[tilesetCorreta.name];
            const x = (i % colunasMapa) * tileSize;
            const y = Math.floor(i / colunasMapa) * tileSize;

            if (ImgMapa && ImgMapa.complete && ImgMapa.naturalWidth !== 0) {
                const indiceReal = tileId - tilesetCorreta.firstgid;
                const colunasTileset = tilesetCorreta.columns;

                const srcX = (indiceReal % colunasTileset) * tileSize;
                const srcY = Math.floor(indiceReal / colunasTileset) * tileSize;

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
    });
}