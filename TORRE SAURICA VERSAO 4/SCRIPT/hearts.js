export class Heart {
    constructor({
        x,
        y,
        width = 32,
        height = 32,
        image,
        spriteCropBox = {
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            frames: 2
        },
    }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.currentFrame = 0;

        this.currentSprite = spriteCropBox;
        this.broken = false;
    }
    draw (ctx) {
        let xScale = 1;

        if (this.broken) {
            this.currentFrame = 1;
        }
        ctx.save();
        ctx.scale(xScale, 1)
        ctx.drawImage(
            this.image,
            this.currentSprite.x + this.currentSprite.width * this.currentFrame,
            this.currentSprite.y,
            this.currentSprite.width,
            this.currentSprite.height,
            this.x,
            this.y,
            this.width,
            this.height,
        )
        ctx.restore()
    }
}