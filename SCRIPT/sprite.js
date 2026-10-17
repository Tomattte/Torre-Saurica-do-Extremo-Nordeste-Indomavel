// CRIADA POR JOAO SEGUINDO OS ENSINAMENTOS DO VIDEO
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