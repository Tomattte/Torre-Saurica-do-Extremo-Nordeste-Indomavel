const canvas = document.getElementById ("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = 700;

    const GRAVIDADE = 0.4;
    let p2 = false;

    class Player
    {
        width = 20;
        height = 60;
        velocidadeX = 0;
        velocidadeY = 0;
        velocidadeAndar = 10;
        forcaDoPulo = -15;
        estaNoChao = true;
        andandoDireita = false;
        andandoEsquerda = false;
        viradoPra = 0;
        podedash = true;
        colldowndash = 0;
        dandoDash = false;
        velocidadeDash = 30;
        framesDash = 0;

        constructor(posicaoX, posicaoY, color)
        {
            this.posicaoX = posicaoX;
            this.posicaoY = posicaoY - this.height;
            this.color = color;
        }

        draw() 
        {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.posicaoX, this.posicaoY, this.width, this.height);
        }

        update()
        {
            if (this.colldowndash > 0) 
            {
                this.colldowndash--;
                this.podedash = false;
            }
            else this.podedash = true;

            if (this.dandoDash === true)
            {
                this.velocidadeX = this.velocidadeDash * this.viradoPra;
                this.velocidadeY = 0;
                this.posicaoX += this.velocidadeX;
                this.framesDash--;

                if (this.framesDash <= 0) this.dandoDash = false;
            }
            else
            {
                this.velocidadeX = 0;

                if(this.andandoDireita) this.velocidadeX = this.velocidadeAndar;

                if(this.andandoEsquerda) this.velocidadeX = - this.velocidadeAndar;

                this.posicaoX +=this.velocidadeX;

                this.velocidadeY += GRAVIDADE;
                this.posicaoY += this.velocidadeY;
                this.estaNoChao = false;
                
            }
            
            if (this.posicaoY + this.height >= canvas.height)
                {
                    this.posicaoY = canvas.height - this.height;
                    this.velocidadeY = 0;
                    this.estaNoChao = true;
                }
                if (this.posicaoX + this.width >= canvas.width) this.posicaoX = canvas.width - this.width;
                if (this.posicaoX <= 0) this.posicaoX = 0;
        }

        pular()
        {
            if (this.estaNoChao === true) this.velocidadeY = this.forcaDoPulo;
        }
    }

const jogador = new Player(100, 700, "blue");
const jogador2 = new Player(1200, 700, "red");

window.addEventListener("keydown", (event) =>
{
    //Player 1
    if (event.key === "w") jogador.pular();
    if (event.key === "d") 
    {
        jogador.andandoDireita = true;
        jogador.viradoPra = 1;
    }
    if (event.key === "a") 
    {
        jogador.andandoEsquerda = true;
        jogador.viradoPra = -1;
    }
    if (event.code === "ShiftLeft") 
    {
        if (jogador.podedash === true)
        {
            jogador.dandoDash = true;
            jogador.framesDash = 10;
            jogador.andandoEsquerda = false;
            jogador.andandoDireita = false;
            jogador.colldowndash = 120;
        }
    }

    //Player 2
    if (event.key === "o") jogador2.pular();
    if (event.key === "ç")
    {
        jogador2.andandoDireita = true;
        jogador2.viradoPra = 1;
    }
    if (event.key === "k")
    {
        jogador2.andandoEsquerda = true;
        jogador2.viradoPra = -1;
    }
    if (event.key === "y") p2 = true;

    if (event.key === "1") 
    {
        if (jogador2.podedash === true)
        {
            jogador2.dandoDash = true;
            jogador2.framesDash = 10;
            jogador2.andandoEsquerda = false;
            jogador2.andandoDireita = false;
            jogador2.colldowndash = 120;
        }
    }

})

window.addEventListener("keyup", (event) =>
{
    if (event.key === "d") jogador.andandoDireita = false;
    if (event.key === "a") jogador.andandoEsquerda = false;

    if (event.key === "ç") jogador2.andandoDireita = false;
    if (event.key === "k") jogador2.andandoEsquerda = false;
    if (event.key === "u") p2 = false;
})

function animate()
{
    requestAnimationFrame(animate);

    ctx.clearRect (0, 0, canvas.width, canvas.height);

    jogador.update();
    jogador.draw();
    if (p2 === true) 
    {
        jogador2.update();
        jogador2.draw();
    }
}

animate();