export class Player
    {
        width = 32;
        height = 32;
        gravidade = 0.4;
        velocidadeX = 0;
        velocidadeY = 0;
        velocidadeAndar = 4;
        forcaDoPulo = -9;
        estaNoChao = true;
        andandoDireita = false;
        andandoEsquerda = false;
        viradoPra = 1;
        podedash = true;
        colldowndash = 0;
        dandoDash = false;
        velocidadeDash = 40;
        framesDash = 0;

        imgWidth = 0;       // Largura de cada frame na imagem original
        imgHeight = 0;      // Altura de cada frame na imagem original
        frameX = 0;             // Coluna atual da animação (0, 1, 2...)
        frameY = 0;             // Linha atual da animação (ex: 0 para parado, 1 para andar)
        framesAndar = 4;
        contadorFrames = 0;     // Controla a velocidade da troca de frames
        velocidadeAnimacao = 8; // Quanto menor, mais rápida é a animação

        constructor(posicaoX, posicaoY, imgskin)
        {
            this.posicaoX = posicaoX;
            this.posicaoY = posicaoY - this.height;
            this.img = imgskin;
        }

        draw(ctx) 
        {
            ctx.drawImage
            (
            this.img, 
            this.frameX * this.imgWidth,  // Posição X do corte
            this.frameY * this.imgHeight, // Posição Y do corte
            this.imgWidth,                // Largura do corte
            this.imgHeight,               // Altura do corte
            this.posicaoX,                // Posição X na tela
            this.posicaoY,                // Posição Y na tela
            this.width,                   // Largura final na tela
            this.height                   // Altura final na tela
            );
        }

        update(canvas)
        {

            if (this.img && this.img.complete) 
            {
                this.imgWidth = this.img.width / 4;   // 4 colunas
                this.imgHeight = this.img.height / 6; // 6 linhas
            }

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

                this.velocidadeY += this.gravidade;
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

            /////////////////////////////////////////////////////////////////////////////////////////////////
            //Animação do Player

            if (this.dandoDash)
            {
                this.frameY = this.viradoPra === 1 ? 4 : 1;
                this.frameX = 0; 
                this.contadorFrames = 0; // Reseta enquanto usa frame estático
            } 
            else if (!this.estaNoChao) 
            {
                this.frameY = this.viradoPra === 1 ? 4 : 2;
                this.frameX = 0;
                this.contadorFrames = 0; // Reseta enquanto usa frame estático
            } 
            else if (this.andandoDireita || this.andandoEsquerda) 
            {
                this.frameY = this.viradoPra === 1 ? 3 : 0;
            
            // Avança o contador de frames continuamente
                this.contadorFrames++;
            
            // Math.floor garante que passemos de forma limpa por 0, 1, 2, 3 baseado no tempo real
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar; 
            } 
            else
            {
                this.frameY = this.viradoPra === 1 ? 3 : 0;
                this.frameX = 0; 
                this.contadorFrames = 0; // Reseta o contador ao parar
            }
        }

    pular()
    {
        if (this.estaNoChao === true) this.velocidadeY = this.forcaDoPulo;
    }
}