export class Player
    {
        width = 32;
        height = 32;
        gravidade = 0.4;
        velocidadeX = 0;
        velocidadeY = 0;
        velocidadeAndar = 4;
        forcaDoPulo = -9;
        estaNoChao = false;
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
            this.lifePool = [];
            this.imortal = false;
            this.vivo = true;
        }

        ficaImortal() {
            this.imortal = true;
            setTimeout(() => {
                this.imortal = false
            }, 1500)
        }

        checaVida() {
            let lifeAtual = 0;
            for (let i = (this.lifePool.length - 1); i >= 0; i--) {
                if (this.lifePool[i].broken === false) lifeAtual++;
            }
            return lifeAtual;
        }

        levaDano() {
            const lifeAtual = this.checaVida();

            if (lifeAtual > 0 && this.imortal === false) {
                this.ficaImortal();
                this.lifePool[lifeAtual-1].broken = true;
            }
        }

        draw(ctx) 
        {

            // Desenha a vida do player

            for (let i = this.lifePool.length - 1; i >= 0; i--) {
                this.lifePool[i].draw(ctx);
            }

            ctx.save();
            if (this.imortal === true) {
                ctx.globalAlpha = 0.5;
            } else {
                ctx.globalAlpha = 1;
            }
            ctx.fillStyle = this.color;
            ctx.fillRect(this.posicaoX, this.posicaoY, this.width, this.height);
            ctx.restore();
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

                this.posicaoX += this.velocidadeX;

                this.velocidadeY += this.gravidade;
                this.posicaoY += this.velocidadeY;
                this.estaNoChao = false;
                
            }
            // <--- AJUSTE 2: APAGAR OU COMENTAR ESTE BLOCO ABAIXO (deixar de usar o limite fixo do canvas.height)
            /*
            if (this.posicaoY + this.height >= canvas.height)
                {
                    this.posicaoY = canvas.height - this.height;
                    this.velocidadeY = 0;
                    this.estaNoChao = true;
                }
            */

                // Manter apenas os limites laterais da tela para não sair dos lados
                if (this.posicaoX + this.width >= canvas.width) this.posicaoX = canvas.width - this.width;
                if (this.posicaoX <= 0) this.posicaoX = 0;
        }

        pular()
        {
            if (this.estaNoChao === true) this.velocidadeY = this.forcaDoPulo;
        }
    }
