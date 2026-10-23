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
        velocidadeDash = 0;
        framesDash = 0;
        lifeAtual = 3;

        imgWidth = 0;           // Largura de cada frame na imagem original
        imgHeight = 0;          // Altura de cada frame na imagem original
        frameX = 0;             // Coluna atual da animação (0, 1, 2...)
        frameY = 0;             // Linha atual da animação (ex: 0 para parado, 1 para andar)
        framesAndar = 4;        // Número total de frames para a animação de andar
        contadorFrames = 0;     // Controla a velocidade da troca de frames
        velocidadeAnimacao = 0; // Quanto menor, mais rápida é a animação

        constructor(posicaoX, posicaoY, imgskin) 
        {
            this.posicaoX = posicaoX;
            this.posicaoY = posicaoY;
            this.img = imgskin;
            this.lifePool = [];
            this.imortal = false;
            this.vivo = true;

            this.velocidadeX = 0;
            this.velocidadeY = 0;
            this.estaNoChao = false;

            // Otimização: Calcula o tamanho do frame assim que a imagem carregar
            if (this.img) 
            {
                const calcularFrames = () => 
                {
                    this.imgWidth = this.img.naturalWidth / 4;
                    this.imgHeight = this.img.naturalHeight / 12;
                };

                if (this.img.complete && this.img.naturalWidth > 0) 
                {
                    calcularFrames();
                } 
                else 
                {
                    this.img.addEventListener("load", calcularFrames, { once: true });
                }
            }
        }

        ficaImortal() {
            this.imortal = true;
            setTimeout(() => {
                this.imortal = false
            }, 1500)
        }

        checaVida() {
            this.lifeAtual = 0;
            for (let i = (this.lifePool.length - 1); i >= 0; i--) 
            {
                if (this.lifePool[i].broken === false) this.lifeAtual++;
            }
            return this.lifeAtual;
        }

        levaDano() {
            this.lifeAtual= this.checaVida();

            if (this.lifeAtual > 0 && this.imortal === false) {
                this.ficaImortal();
                this.lifePool[this.lifeAtual-1].broken = true;
            }
        }

        draw(ctx) 
        {
            // Desenha a vida do player

            for (let i = this.lifePool.length - 1; i >= 0; i--) {
                this.lifePool[i].draw(ctx);
            }

            // Deixa o player transparente se estiver imortal

            ctx.save();
            if (this.imortal === true) {
                ctx.globalAlpha = 0.5;
            } else {
                ctx.globalAlpha = 1;
            }

            // Desenha o player

            if (!this.imgWidth || !this.imgHeight) return; // Evita desenhar sem as dimensões

            ctx.drawImage
            (
            this.img, 
            this.frameX * this.imgWidth,  
            this.frameY * this.imgHeight, 
            this.imgWidth,                
            this.imgHeight,               
            this.posicaoX,                
            this.posicaoY,                
            this.width,                   
            this.height                   
            );
            ctx.restore();
        }
        
        update(canvas)
        {
            // TESTE PARA RODAR O COOLDOWN DO DASH
            if (this.colldowndash > 0) 
            {
                this.colldowndash--;
                this.podedash = false;
            }
            else this.podedash = true; 

            // LÓGICA DO DASH
            if (this.dandoDash === true)
            {
                this.velocidadeX = this.velocidadeDash * this.viradoPra;
                this.velocidadeY = 0;
                this.framesDash--; 

                if (this.framesDash <= 0) this.dandoDash = false; 
            }
            else 
            {
                this.velocidadeX = 0;

                if(this.andandoDireita)
                {
                    this.velocidadeX = this.velocidadeAndar; 
                    this.viradoPra = 1; 
                }
                if(this.andandoEsquerda)
                {
                    this.velocidadeX = - this.velocidadeAndar; 
                    this.viradoPra = -1; 
                }

                // REATIVADO: Adiciona a gravidade frame a frame para puxar o player para baixo
                this.velocidadeY += this.gravidade; 
            }
            
            // TRAVA DE LIMITES LATERAIS DO CANVAS
            if (this.posicaoX + this.width >= canvas.width) this.posicaoX = canvas.width - this.width;
            if (this.posicaoX <= 0) this.posicaoX = 0;

            /////////////////////////////////////////////////////////////////////////////////////////////////
            //Animação do Player

            if (this.lifeAtual <= 0) 
            {
                this.frameY = this.viradoPra === 1 ? 11 : 10;
                this.velocidadeAnimacao = 2;
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar; 
                this.vivo = false;
            } 
            else if (this.imortal) 
            {
                this.frameY = this.viradoPra === 1 ? 9 : 8;
                this.velocidadeAnimacao = 2;
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar; 
            } 
            else if (this.dandoDash) 
            {
                this.frameY = this.viradoPra === 1 ? 5 : 4;
                this.velocidadeAnimacao = 6.25;
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar; 
            } 
            else if (!this.estaNoChao) 
            {
                this.frameY = this.viradoPra === 1 ? 7 : 6;
                const estaSubindo = this.velocidadeY < 0;
                if (this.viradoPra === 1) {
                    this.frameX = estaSubindo ? 2 : 3;
                } else {
                    this.frameX = estaSubindo ? 1 : 3;
                }
            }
            else if (this.andandoDireita || this.andandoEsquerda) 
            {
                this.frameY = this.viradoPra === 1 ? 3 : 2;
                this.velocidadeAnimacao = 15; 
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar;           
            } 
            else 
            {
                this.frameY = this.viradoPra === 1 ? 1 : 0;
                this.velocidadeAnimacao = 25;
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar;    
            }
        }

        pular() 
        {
            if (this.estaNoChao === true) this.velocidadeY = this.forcaDoPulo;
        }
}
