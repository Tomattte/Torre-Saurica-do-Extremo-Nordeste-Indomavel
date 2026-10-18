class Enemy {
    constructor(x, y, largura = 32, altura = 32) {
        this.x = x;
        this.y = y;

        this.largura = largura;
        this.altura = altura;

        this.velocidade = 70;
        this.dano = 1;
        this.vivo = true;

        this.direcao = 1;
    }

    atualizar(deltaTime) {
        // A classe base não define um comportamento específico.
        // Cada tipo de inimigo fará seu próprio movimento.
    }

    desenhar(ctx) {
        if (!this.vivo) return;

        // Desenho provisório para testar o inimigo.
        ctx.fillStyle = "red";
        ctx.fillRect(
            this.x,
            this.y,
            this.largura,
            this.altura
        );
    }

    receberDano() {
        this.vivo = false;
    }

    colideCom(outro) {
        return (
            this.x < outro.x + outro.largura &&
            this.x + this.largura > outro.x &&
            this.y < outro.y + outro.altura &&
            this.y + this.altura > outro.y
        );
    }
}

class Galinha extends Enemy {
    constructor(x, y, limiteMin, limiteMax) {
        super(x, y, 32, 32);

        this.velocidade = 70;
        this.dano = 1;

        this.limiteMin = limiteMin;
        this.limiteMax = limiteMax;

        // Controle da reprodução
        this.intervaloOvo = 2500;
        this.ultimoOvo = performance.now();
    }

    atualizar(deltaTime, agora, ovos) {
        if (!this.vivo) return;

        // Movimento horizontal
        this.x +=
            this.direcao * this.velocidade * deltaTime;

        // Inverte a direção ao atingir os limites
        if (this.x <= this.limiteMin) {
            this.x = this.limiteMin;
            this.direcao = 1;
        }

        if (this.x + this.largura >= this.limiteMax) {
            this.x = this.limiteMax - this.largura;
            this.direcao = -1;
        }

        // Põe um ovo a cada 2,5 segundos
        if (agora - this.ultimoOvo >= this.intervaloOvo) {
            ovos.push(
                new Ovo(
                    this.x + this.largura / 2 - 6,
                    this.y + this.altura - 8,
                    this.limiteMin,
                    this.limiteMax
                )
            );

            this.ultimoOvo = agora;
        }
    }

    desenhar(ctx) {
        if (!this.vivo) return;

        // Temporário: substituir pelo sprite da galinha.
        ctx.fillStyle = "orange";
        ctx.fillRect(
            this.x,
            this.y,
            this.largura,
            this.altura
        );
    }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cria uma galinha na posição x=200, y=200
const galinhas = [
    new Galinha(200, 200, 0, canvas.width)
];

let ultimoQuadro = performance.now();

function desenharJogo(agora) {
    const deltaTime = Math.min(
        (agora - ultimoQuadro) / 1000,
        0.05
    );

    ultimoQuadro = agora;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const galinha of galinhas) {
        galinha.atualizar(deltaTime, agora, ovos);
        galinha.desenhar(ctx);
    }

    requestAnimationFrame(desenharJogo);
}

const ovos = [];

requestAnimationFrame(desenharJogo);