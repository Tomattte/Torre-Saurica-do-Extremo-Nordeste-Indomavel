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
            this.posicaoY = posicaoY - this.height;
            this.img = imgskin;
            this.lifePool = [];
            this.imortal = false;
            this.vivo = true;

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
            // TESTE PARA RODAR O COOLDOWN DO DASH, DECREMENTANDO ENQUANTO HOUVER COLLDOWN MAIOR QUE ZERO
            if (this.colldowndash > 0) 
            {
                this.colldowndash--;
                this.podedash = false;
            }
            else this.podedash = true; // SE = 0, PODE DAR DASH NOVAMENTE

            // LÓGICA DO DASH, SE ESTIVER DANDO, MOVE O PLAYER NA DIREÇÃO QUE ESTÁ VIRADO
            if (this.dandoDash === true)
            {
                this.velocidadeX = this.velocidadeDash * this.viradoPra;
                this.velocidadeY = 0;
                this.posicaoX += this.velocidadeX;
                this.framesDash--; // GARANTE A DURAÇÃO DO DASH CONFIGURADA NO GAME.JS PELA DISTANCIA E VELOCIDADE

                if (this.framesDash <= 0) this.dandoDash = false; // QUANDO FRAMES CHEGA A ZERO, ENCERRA ESSA FUNÇÃO
            }
            else // "CASO" NÃO ESTEJA DANDO DASH, EXECUTA A LÓGICA NORMAL DE MOVIMENTO
            {
                this.velocidadeX = 0;

                if(this.andandoDireita)
                {
                    this.velocidadeX = this.velocidadeAndar; // ANDAR PRA DIREITA
                    this.viradoPra = 1; // CONFIGURA O PLAYER PRA FICAR VIRADO PARA A DIREITA JA Q TAVA ANDANDO PRA DIREITA
                }
                if(this.andandoEsquerda)
                {
                    this.velocidadeX = - this.velocidadeAndar; // ANDAR PRA ESQUERDA DECREMENTANDO A VELOCIDADE X
                    this.viradoPra = -1; // CONFIGURA O PLAYER PARA FICAR VIRADO PRA ESQUERDA JA Q TAVA ANDANDO PRA ESQUERDA
                }

                this.posicaoX +=this.velocidadeX; // CASO FOSSE NEGATIVA, O PLAYER ANDARIA PRA ESQUERDA, CASO POSITIVA, ANDARIA PRA DIREITA
                this.velocidadeY += this.gravidade; // CONFIGURA A GRAVIDADE, DECREMENTANDO A VELOCIDADE Y, PARA QUE O PLAYER CAIA
                this.posicaoY += this.velocidadeY; // CONFIGURA A POSIÇÃO Y, DECREMENTANDO A POSIÇÃO Y, PARA QUE O PLAYER CAIA
                this.estaNoChao = false; // CASO NAO ESTEJA FAZENDO AS FUNÇÕES ACIMA, O PLAYER ESTÁ NO AR, LOGO, NÃO ESTÁ NO CHÃO
                
            }
            
            // TRAVA PARA O JOGADOR NAO SAIR DA TELA, SE CHEGAR NO CHÃO OU NAS LATERAIS, TRAVA A POSIÇÃO
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

            if (this.dandoDash) // DASHAR
            {
                this.frameY = this.viradoPra === 1 ? 5 : 4;
                this.velocidadeAnimacao = 6.25;
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar; 
                
                // Reseta enquanto usa frame estático
            } 
            else if (!this.estaNoChao) // PULAR (Agora baseado na velocidadeY)
            {
                this.frameY = this.viradoPra === 1 ? 7 : 6;

                // DEFINE SE O JOGADOR ESTÁ CAINDO OU SUBINDO BASEADO NO SINAL DE VELOCIDADEY (POSITIVO OU NEGATIVO)
                const estaSubindo = this.velocidadeY < 0;

                // USA O SPRITE CERTO BASEADO NA DIREÇÃO DO PERSONAGEM
                if (this.viradoPra === 1) {
                    // USA O FRAME 3 SE TIVER SUBINDO E O 4 SE TIVER CAINDO
                    this.frameX = estaSubindo ? 2 : 3;
                } else {
                    // USA O FRAME 2 SE TIVER SUBINDO E O 4 SE TIVER CAINDO
                    this.frameX = estaSubindo ? 1 : 3;
                }
            }
            else if (this.andandoDireita || this.andandoEsquerda) // ANDAR
            {
                this.frameY = this.viradoPra === 1 ? 3 : 2;
                this.velocidadeAnimacao = 15; // Ajuste da velocidade de animação para andar
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar;           
            } 
            else // IDDLE, ANIMAÇÃO PARADO.
            {
                this.frameY = this.viradoPra === 1 ? 1 : 0;
                this.velocidadeAnimacao = 25;
                this.contadorFrames++;
                let frameCalculado = Math.floor(this.contadorFrames / this.velocidadeAnimacao);
                this.frameX = frameCalculado % this.framesAndar;    
            }
            // Avança o contador de frames continuamente            
            // Math.floor garante que passemos de forma limpa por 0, 1, 2, 3 baseado no tempo real
        }

        pular() 
        {
            if (this.estaNoChao === true) this.velocidadeY = this.forcaDoPulo;
        }
}
