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

//---------------------------CACTO------------------------------------

class Cacto extends Enemy {
    constructor(x, y) {
        // Cria o inimigo com posição, dimensões e 2 pontos de vida.
        super(x, y, 32, 32, 2);

        // Guarda a posição inicial do cacto.
        this.x = x;
        this.y = y;

        // Define as dimensões de cada cabeça.
        this.headWidth = 32;
        this.headHeight = 32;

        // O cacto começa com três cabeça.
        this.headCount = 3;

        // Limita o crescimento a três cabeças.
        this.maxHeads = 3;

        // Define o intervalo entre os crescimentos: 5 segundos.
        this.growthInterval = 5000;

        // Registra o tempo decorrido desde o último crescimento.
        this.growthTimer = 0;

        // Define o intervalo entre os disparos de cada cabeça.
        this.shootInterval = 1500;

        // Guarda os projéteis que estão ativos.
        this.projectiles = [];

        // Define a velocidade horizontal dos projéteis.
        this.projectileSpeed = 300;

        // Define o tamanho dos projéteis.
        this.projectileWidth = 10;
        this.projectileHeight = 6;

        // Define o dano causado por cada projétil.
        this.projectileDamage = 1;

        // Cria os temporizadores independentes das cabeças.
        this.headTimers = [0];

        // Controla se o inimigo ainda está vivo.
        this.vivo = true;
    }

    // Atualiza o comportamento do cacto a cada frame.
    // deltaTime deve ser informado em milissegundos.
    update(deltaTime, player) {
        // Não atualiza um cacto que já foi derrotado.
        if (!this.vivo) return;

        // Acumula o tempo necessário para o crescimento.
        this.growthTimer += deltaTime;

        // Verifica se já passaram 5 segundos e se ainda pode crescer.
        if (
            this.growthTimer >= this.growthInterval &&
            this.headCount < this.maxHeads
        ) {
            // Adiciona uma cabeça ao cacto.
            this.headCount++;

            // Reinicia o temporizador de crescimento.
            this.growthTimer = 0;

            // Cada nova cabeça começa com seu próprio temporizador.
            this.headTimers.push(0);
        }

        // Atualiza cada cabeça e controla seus disparos.
        for (let i = 0; i < this.headCount; i++) {
            // Soma o tempo transcorrido ao temporizador da cabeça.
            this.headTimers[i] += deltaTime;

            // Dispara se o intervalo definido já tiver passado.
            if (this.headTimers[i] >= this.shootInterval) {
                // Calcula a posição vertical desta cabeça.
                const headY =
                    this.y - i * this.headHeight;

                // Dispara horizontalmente na direção do jogador.
                this.shoot(headY, player);

                // Reinicia somente o temporizador desta cabeça.
                this.headTimers[i] = 0;
            }
        }

        // Atualiza a posição de todos os projéteis.
        for (const projectile of this.projectiles) {
            // Move o projétil em linha reta na horizontal.
            projectile.x +=
                projectile.velocityX * (deltaTime / 1000);
        }

        // Remove projéteis que saíram da área visível.
        this.projectiles = this.projectiles.filter(
            projectile =>
                projectile.x + projectile.width > 0 &&
                projectile.x < this.canvasWidth
        );
    }

    // Cria um projétil na altura de uma das cabeças.
    shoot(headY, player) {
        // Compara as posições para escolher a direção horizontal.
        const direction =
            player && player.x < this.x ? -1 : 1;

        // Cria o objeto que representa o projétil.
        const projectile = {
            // Posiciona o disparo junto à cabeça.
            x: direction === 1
                ? this.x + this.headWidth
                : this.x - this.projectileWidth,

            // Centraliza o projétil na altura da cabeça.
            y: headY + this.headHeight / 2,

            // Define as dimensões do projétil.
            width: this.projectileWidth,
            height: this.projectileHeight,

            // Define a direção e a velocidade do disparo.
            velocityX: direction * this.projectileSpeed,

            // Define o dano que será causado ao jogador.
            damage: this.projectileDamage
        };

        // Adiciona o novo projétil à lista de projéteis ativos.
        this.projectiles.push(projectile);
    }

    // Desenha o cacto e seus projéteis no Canvas.
    draw(ctx) {
        // Não desenha um inimigo que já foi derrotado.
        if (!this.vivo) return;

        // Desenha todas as cabeças do cacto.
        for (let i = 0; i < this.headCount; i++) {
            // Calcula a posição vertical de cada cabeça.
            const headY = this.y - i * this.headHeight;

            // Desenha o corpo verde da cabeça.
            ctx.fillStyle = "#2E9B43";
            ctx.fillRect(
                this.x,
                headY,
                this.headWidth,
                this.headHeight
            );

            // Desenha os espinhos laterais.
            ctx.fillStyle = "#17652C";
            ctx.fillRect(this.x - 3, headY + 10, 4, 4);
            ctx.fillRect(
                this.x + this.headWidth - 1,
                headY + 20,
                4,
                4
            );

            // Desenha os olhos.
            ctx.fillStyle = "#102A17";
            ctx.fillRect(this.x + 8, headY + 9, 4, 5);
            ctx.fillRect(this.x + 20, headY + 9, 4, 5);
        }

        // Desenha cada projétil ativo.
        ctx.fillStyle = "#D5E86C";

        for (const projectile of this.projectiles) {
            ctx.fillRect(
                projectile.x,
                projectile.y,
                projectile.width,
                projectile.height
            );
        }
    }

    // Retira vida do cacto quando ele recebe um ataque.
    takeDamage(amount = 1) {
        // Não aplica dano adicional se já estiver derrotado.
        if (!this.isAlive) return;

        // Subtrai a quantidade de dano recebida.
        this.health -= amount;

        // Derrota o cacto quando sua vida chega a zero.
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;

            // Limpa os projéteis quando o cacto morre.
            this.projectiles = [];
        }
    }
}


//-------------------------------PITERO-----------------------------


class Pitero extends Enemy {
    constructor(x, y, patrolPoints, groundY) {
        // Inicializa o inimigo usando a classe Enemy.
        // Parâmetros: posição X, posição Y, largura, altura e vida.
        super(x, y, 48, 32, 3);

        // Guarda a posição inicial do inimigo.
        this.x = x;
        this.y = y;

        // Define as dimensões do Pitero.
        this.width = 48;
        this.height = 32;

        // Define a vida inicial do inimigo.
        this.health = 3;
        this.isAlive = true;

        // Guarda as posições da matriz de patrulha.
        // Cada posição é um objeto com coordenadas x e y.
        this.patrolPoints = patrolPoints;

        // Começa pela primeira posição da matriz.
        this.currentPoint = 0;

        // Define a velocidade de voo durante a patrulha.
        this.patrolSpeed = 100;

        // Define a velocidade da descida durante o rasante.
        this.diveSpeed = 350;

        // Define a velocidade lenta de subida após o ataque.
        this.riseSpeed = 70;

        // Guarda a altura do chão do cenário.
        this.groundY = groundY;

        // Define o estado inicial do inimigo.
        this.state = "patrol";

        // Define as dimensões da área de ataque.
        this.attackWidth = 96;
        this.attackHeight = 128;

        // Define o tempo necessário para causar dano: 0,5 segundo.
        this.attackDelay = 500;

        // Guarda quanto tempo o jogador permaneceu na área.
        this.attackTimer = 0;

        // Indica se o dano já foi aplicado neste rasante.
        this.damageApplied = false;

        // Guarda a posição horizontal escolhida para o rasante.
        this.targetX = x;

        // Define a tolerância para considerar o jogador alinhado.
        this.alignmentTolerance = 24;
    }

    // Calcula a distância entre dois valores.
    // Esse método ajuda a movimentar o inimigo até um destino.
    distance(a, b) {
        return Math.abs(a - b);
    }

    // Move o inimigo em direção a uma posição.
    moveTowards(targetX, targetY, speed, deltaTime) {
        // Calcula a distância horizontal até o destino.
        const dx = targetX - this.x;

        // Calcula a distância vertical até o destino.
        const dy = targetY - this.y;

        // Converte o tempo de milissegundos para segundos.
        const seconds = deltaTime / 1000;

        // Calcula quanto o inimigo pode se mover neste frame.
        const movement = speed * seconds;

        // Calcula a distância total até o destino.
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Se estiver perto o suficiente, chega exatamente ao destino.
        if (distance <= movement || distance === 0) {
            this.x = targetX;
            this.y = targetY;
            return true;
        }

        // Move horizontalmente proporcional à distância.
        this.x += (dx / distance) * movement;

        // Move verticalmente proporcional à distância.
        this.y += (dy / distance) * movement;

        // Informa que ainda não chegou ao destino.
        return false;
    }

    // Verifica se dois retângulos estão se tocando.
    intersects(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    // Verifica se o jogador está na mesma linha horizontal do Pitero.
    isPlayerAligned(player) {
        // Calcula o centro horizontal do Pitero.
        const piteroCenter = this.x + this.width / 2;

        // Calcula o centro horizontal do jogador.
        const playerCenter = player.x + player.width / 2;

        // Considera o jogador alinhado se estiver próximo horizontalmente.
        return (
            this.distance(piteroCenter, playerCenter) <=
            this.alignmentTolerance
        );
    }

    // Retorna a área retangular atingida pelo rasante.
    getAttackArea() {
        return {
            // Centraliza a área de ataque horizontalmente no Pitero.
            x: this.x + this.width / 2 - this.attackWidth / 2,

            // Posiciona a área abaixo da posição atual do inimigo.
            y: this.y,

            // Define as dimensões exatas da área de ataque.
            width: this.attackWidth,
            height: this.attackHeight
        };
    }

    // Atualiza o comportamento do inimigo a cada frame.
    // deltaTime deve estar em milissegundos.
    update(deltaTime, player) {
        // Não atualiza o Pitero se ele estiver morto.
        if (!this.isAlive) return;

        // Converte o tempo transcorrido em segundos.
        const seconds = deltaTime / 1000;

        // Executa o comportamento correspondente ao estado atual.
        switch (this.state) {
            case "patrol": {
                // Obtém o destino atual na matriz de patrulha.
                const point = this.patrolPoints[this.currentPoint];

                // Se não houver posições de patrulha, permanece parado.
                if (!point) return;

                // Voa até a próxima posição da matriz.
                const arrived = this.moveTowards(
                    point.x,
                    point.y,
                    this.patrolSpeed,
                    deltaTime
                );

                // Quando chega ao destino, seleciona a próxima posição.
                if (arrived) {
                    this.currentPoint =
                        (this.currentPoint + 1) %
                        this.patrolPoints.length;
                }

                // Se o jogador estiver alinhado, inicia o rasante.
                if (player && this.isPlayerAligned(player)) {
                    // Escolhe a posição horizontal do jogador como alvo.
                    this.targetX =
                        player.x + player.width / 2 - this.width / 2;

                    // Reinicia o temporizador do ataque.
                    this.attackTimer = 0;

                    // Permite aplicar dano no próximo ataque.
                    this.damageApplied = false;

                    // Muda o estado para iniciar a descida.
                    this.state = "dive";
                }

                break;
            }

            case "dive": {
                // Define a posição do chão considerando a altura do Pitero.
                const landingY = this.groundY - this.height;

                // Desce em direção ao chão, mirando a posição escolhida.
                const arrived = this.moveTowards(
                    this.targetX,
                    landingY,
                    this.diveSpeed,
                    deltaTime
                );

                // Verifica se o Pitero chegou ao chão.
                if (arrived) {
                    // Começa a subida lenta após completar a descida.
                    this.state = "rise";
                }

                // Calcula a área de ataque durante o rasante.
                const area = this.getAttackArea();

                // Verifica se o jogador está dentro da área de ataque.
                if (player && this.intersects(area, player)) {
                    // Conta quanto tempo o jogador permanece na área.
                    this.attackTimer += deltaTime;

                    // Aplica dano após meio segundo, uma vez por rasante.
                    if (
                        this.attackTimer >= this.attackDelay &&
                        !this.damageApplied
                    ) {
                        // Causa 2 pontos de dano ao jogador.
                        if (typeof player.takeDamage === "function") {
                            player.takeDamage(2);
                        } else if (typeof player.health === "number") {
                            // Alternativa para jogadores sem takeDamage().
                            player.health = Math.max(0, player.health - 2);
                        }

                        // Impede dano repetido durante o mesmo rasante.
                        this.damageApplied = true;
                    }
                } else {
                    // Reinicia a contagem se o jogador sair da área.
                    this.attackTimer = 0;
                }

                break;
            }

            case "rise": {
                // Define a altura original de voo usando o primeiro ponto.
                const topY = this.patrolPoints[0]
                    ? this.patrolPoints[0].y
                    : 0;

                // Sobe lentamente até a altura original.
                const arrived = this.moveTowards(
                    this.x,
                    topY,
                    this.riseSpeed,
                    deltaTime
                );

                // Quando chega ao topo, volta a patrulhar.
                if (arrived) {
                    this.state = "patrol";

                    // Reinicia a contagem para o próximo rasante.
                    this.attackTimer = 0;
                    this.damageApplied = false;
                }

                break;
            }
        }
    }

    // Desenha o inimigo e sua área de ataque.
    draw(ctx, showAttackArea = false) {
        // Não desenha um Pitero derrotado.
        if (!this.isAlive) return;

        // Desenha o corpo do Pitero.
        ctx.fillStyle = "#7352A3";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Desenha a cabeça.
        ctx.fillStyle = "#9873C7";
        ctx.fillRect(this.x + 30, this.y + 2, 18, 14);

        // Desenha o bico.
        ctx.fillStyle = "#E6B84A";
        ctx.fillRect(this.x + 44, this.y + 7, 9, 5);

        // Desenha as asas.
        ctx.fillStyle = "#503574";
        ctx.fillRect(this.x + 4, this.y - 8, 25, 12);

        // Desenha os olhos.
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.x + 39, this.y + 4, 4, 4);

        // Opcionalmente mostra a área de ataque para depuração.
        if (showAttackArea && this.state === "dive") {
            const area = this.getAttackArea();

            // Desenha a área semitransparente para facilitar os testes.
            ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
            ctx.fillRect(
                area.x,
                area.y,
                area.width,
                area.height
            );

            // Desenha o contorno da área de ataque.
            ctx.strokeStyle = "#FF0000";
            ctx.strokeRect(
                area.x,
                area.y,
                area.width,
                area.height
            );
        }
    }

    // Recebe dano de ataques do jogador.
    takeDamage(amount = 1) {
        // Ignora ataques se o Pitero já estiver morto.
        if (!this.isAlive) return;

        // Reduz a vida do inimigo.
        this.health -= amount;

        // Verifica se a vida chegou a zero.
        if (this.health <= 0) {
            // Impede que a vida fique negativa.
            this.health = 0;

            // Marca o inimigo como derrotado.
            this.isAlive = false;
        }
    }
}


------------------------------meteoro--------------------------------------

class MeteoroVivo extends Enemy {
    constructor(x, y, patrolPoints, groundY, canvasWidth, canvasHeight) {
        // Inicializa o boss com 64x64 pixels e 50 pontos de vida.
        super(x, y, 64, 64, 50);

        // Define a posição inicial do boss.
        this.x = x;
        this.y = y;

        // Define o tamanho do meteoro.
        this.width = 64;
        this.height = 64;

        // Define a vida inicial e o estado do boss.
        this.health = 50;
        this.maxHealth = 50;
        this.isAlive = true;

        // Guarda as posições da patrulha no topo do cenário.
        this.patrolPoints = patrolPoints;
        this.currentPoint = 0;

        // Guarda as dimensões do cenário.
        this.groundY = groundY;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Define as velocidades de movimento.
        this.patrolSpeed = 90;
        this.diveSpeed = 400;
        this.riseSpeed = 80;

        // Define a tolerância para iniciar um rasante.
        this.alignmentTolerance = 32;

        // Começa na primeira fase do combate.
        this.phase = 1;

        // Define o estado inicial.
        this.state = "patrol";

        // Define a área do rasante e da labareda.
        this.attackWidth = 96;
        this.attackHeight = 128;

        // Define o tempo de espera antes da labareda.
        this.flameDelay = 500;

        // Define quanto tempo a labareda permanece ativa.
        this.flameDuration = 900;

        // Guarda os temporizadores da labareda.
        this.flameTimer = 0;
        this.flameActiveTimer = 0;

        // Indica se a labareda está ativa.
        this.flameActive = false;

        // Impede que o jogador receba dano repetido da mesma labareda.
        this.flameDamageApplied = false;

        // Registra se o boss saiu completamente da tela.
        this.exitedScreen = false;

        // Guarda o destino horizontal do rasante.
        this.targetX = x;

        // Define a velocidade dos projéteis da segunda fase.
        this.projectileSpeed = 280;

        // Define o intervalo entre disparos comuns.
        this.shootInterval = 1200;

        // Define o intervalo entre bolas de fogo.
        this.fireballInterval = 2200;

        // Inicializa os temporizadores dos ataques à distância.
        this.shootTimer = 0;
        this.fireballTimer = 0;

        // Armazena todos os projéteis ativos.
        this.projectiles = [];

        // Armazena as bolas de fogo maiores.
        this.fireballs = [];

        // Controla o intervalo entre os ataques da primeira fase.
        this.diveCooldown = 0;

        // Define o tempo de espera antes de iniciar outro rasante.
        this.diveCooldownDuration = 700;
    }

    // Move o boss em direção a uma posição usando a velocidade definida.
    moveTowards(targetX, targetY, speed, deltaTime) {
        // Calcula a distância horizontal até o destino.
        const dx = targetX - this.x;

        // Calcula a distância vertical até o destino.
        const dy = targetY - this.y;

        // Converte o tempo de milissegundos para segundos.
        const seconds = deltaTime / 1000;

        // Calcula a distância que o boss pode percorrer neste frame.
        const movement = speed * seconds;

        // Calcula a distância total até o destino.
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Se já estiver perto do destino, posiciona o boss exatamente nele.
        if (distance <= movement || distance === 0) {
            this.x = targetX;
            this.y = targetY;
            return true;
        }

        // Move o boss proporcionalmente na direção do destino.
        this.x += (dx / distance) * movement;
        this.y += (dy / distance) * movement;

        // Informa que o destino ainda não foi alcançado.
        return false;
    }

    // Verifica a colisão entre dois retângulos.
    intersects(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    // Verifica se o jogador está alinhado horizontalmente com o boss.
    isPlayerAligned(player) {
        // Calcula o centro horizontal do meteoro.
        const bossCenter = this.x + this.width / 2;

        // Calcula o centro horizontal do jogador.
        const playerCenter = player.x + player.width / 2;

        // Considera o jogador alinhado dentro da tolerância definida.
        return Math.abs(bossCenter - playerCenter) <=
            this.alignmentTolerance;
    }

    // Retorna a área retangular usada pelo rasante.
    getAttackArea() {
        return {
            // Centraliza a área de ataque no alvo horizontal.
            x: this.targetX + this.width / 2 -
                this.attackWidth / 2,

            // Posiciona a área sobre o chão do cenário.
            y: this.groundY - this.attackHeight,

            // Define a largura da área.
            width: this.attackWidth,

            // Define a altura da área.
            height: this.attackHeight
        };
    }

    // Inicia um novo rasante na direção do jogador.
    startDive(player) {
        // Mira a posição horizontal atual do jogador.
        this.targetX =
            player.x + player.width / 2 - this.width / 2;

        // Limita o alvo para manter o boss dentro da largura do cenário.
        this.targetX = Math.max(
            0,
            Math.min(this.targetX, this.canvasWidth - this.width)
        );

        // Reinicia os controles da labareda.
        this.flameTimer = 0;
        this.flameActiveTimer = 0;
        this.flameActive = false;
        this.flameDamageApplied = false;
        this.exitedScreen = false;

        // Muda o estado para iniciar o rasante.
        this.state = "dive";
    }

    // Cria um projétil comum, semelhante ao disparo do Cacto.
    shootProjectile(direction) {
        // Cria um projétil pequeno que se move horizontalmente.
        const projectile = {
            // Posiciona o projétil na lateral do meteoro.
            x: direction > 0
                ? this.x + this.width
                : this.x - 10,

            // Centraliza o disparo verticalmente no meteoro.
            y: this.y + this.height / 2,

            // Define as dimensões do projétil.
            width: 10,
            height: 8,

            // Define a velocidade e o sentido do disparo.
            velocityX: direction * this.projectileSpeed,

            // Define o dano causado ao jogador.
            damage: 1
        };

        // Adiciona o projétil à lista de projéteis ativos.
        this.projectiles.push(projectile);
    }

    // Cria uma bola de fogo que cruza o cenário horizontalmente.
    shootFireball(direction) {
        // Cria uma bola de fogo maior e mais lenta.
        const fireball = {
            // Posiciona a bola de fogo na lateral do boss.
            x: direction > 0
                ? this.x + this.width
                : this.x - 24,

            // Define a altura do disparo.
            y: this.y + this.height / 2 - 12,

            // Define o tamanho da bola de fogo.
            width: 24,
            height: 24,

            // Define o sentido e a velocidade horizontal.
            velocityX: direction * 200,

            // Define o dano causado ao jogador.
            damage: 2
        };

        // Adiciona a bola de fogo à lista de ataques ativos.
        this.fireballs.push(fireball);
    }

    // Atualiza a posição dos projéteis e das bolas de fogo.
    updateProjectiles(deltaTime, player) {
        // Converte o tempo para segundos.
        const seconds = deltaTime / 1000;

        // Move cada projétil horizontalmente.
        for (const projectile of this.projectiles) {
            projectile.x += projectile.velocityX * seconds;

            // Aplica dano se o projétil atingir o jogador.
            if (
                player &&
                this.intersects(projectile, player) &&
                !projectile.hit
            ) {
                // Causa um ponto de dano ao jogador.
                if (typeof player.takeDamage === "function") {
                    player.takeDamage(projectile.damage);
                } else if (typeof player.health === "number") {
                    player.health = Math.max(
                        0,
                        player.health - projectile.damage
                    );
                }

                // Impede que o mesmo projétil cause dano repetido.
                projectile.hit = true;
            }
        }

        // Move cada bola de fogo horizontalmente.
        for (const fireball of this.fireballs) {
            fireball.x += fireball.velocityX * seconds;

            // Aplica dano se a bola de fogo atingir o jogador.
            if (
                player &&
                this.intersects(fireball, player) &&
                !fireball.hit
            ) {
                // Causa dois pontos de dano.
                if (typeof player.takeDamage === "function") {
                    player.takeDamage(fireball.damage);
                } else if (typeof player.health === "number") {
                    player.health = Math.max(
                        0,
                        player.health - fireball.damage
                    );
                }

                // Marca a bola de fogo para evitar dano repetido.
                fireball.hit = true;
            }
        }

        // Remove projéteis que já atingiram o jogador ou saíram da tela.
        this.projectiles = this.projectiles.filter(projectile =>
            !projectile.hit &&
            projectile.x + projectile.width > 0 &&
            projectile.x < this.canvasWidth
        );

        // Remove bolas de fogo que já atingiram o jogador ou saíram da tela.
        this.fireballs = this.fireballs.filter(fireball =>
            !fireball.hit &&
            fireball.x + fireball.width > 0 &&
            fireball.x < this.canvasWidth
        );
    }

    // Atualiza o estado do boss a cada frame.
    // deltaTime deve estar em milissegundos.
    update(deltaTime, player) {
        // Não executa a lógica se o boss já foi derrotado.
        if (!this.isAlive) return;

        // Verifica se deve iniciar a segunda fase.
        if (this.phase === 1 && this.health <= 25) {
            // Ativa a segunda fase.
            this.phase = 2;

            // Volta para o topo do cenário.
            this.state = "phase2";

            // Desativa qualquer labareda pendente.
            this.flameActive = false;

            // Reinicia os temporizadores dos ataques à distância.
            this.shootTimer = 0;
            this.fireballTimer = 0;
        }

        // Atualiza os ataques à distância na segunda fase.
        if (this.phase === 2) {
            // Acumula o tempo entre os disparos.
            this.shootTimer += deltaTime;
            this.fireballTimer += deltaTime;

            // Dispara projéteis comuns no intervalo definido.
            if (this.shootTimer >= this.shootInterval) {
                // Mira o jogador para decidir a direção horizontal.
                const direction = player &&
                    player.x + player.width / 2 < this.x
                    ? -1
                    : 1;

                // Dispara um projétil comum.
                this.shootProjectile(direction);

                // Reinicia o temporizador dos disparos.
                this.shootTimer = 0;
            }

            // Dispara bolas de fogo em intervalos separados.
            if (this.fireballTimer >= this.fireballInterval) {
                // Escolhe a direção da bola de fogo.
                const direction = player &&
                    player.x + player.width / 2 < this.x
                    ? -1
                    : 1;

                // Cria a bola de fogo.
                this.shootFireball(direction);

                // Reinicia o temporizador das bolas de fogo.
                this.fireballTimer = 0;
            }

            // Atualiza os projéteis ativos.
            this.updateProjectiles(deltaTime, player);

            // Mantém o boss no estado de combate à distância.
            this.state = "phase2";

            // Encerra a atualização da primeira fase.
            return;
        }

        // Atualiza o movimento e o ataque da primeira fase.
        switch (this.state) {
            case "patrol": {
                // Reduz o tempo restante antes do próximo rasante.
                this.diveCooldown = Math.max(
                    0,
                    this.diveCooldown - deltaTime
                );

                // Obtém o ponto atual da matriz de patrulha.
                const point = this.patrolPoints[this.currentPoint];

                // Percorre os pontos se a matriz não estiver vazia.
                if (point) {
                    // Voa até a próxima posição.
                    const arrived = this.moveTowards(
                        point.x,
                        point.y,
                        this.patrolSpeed,
                        deltaTime
                    );

                    // Avança para o próximo ponto quando chega ao destino.
                    if (arrived) {
                        this.currentPoint =
                            (this.currentPoint + 1) %
                            this.patrolPoints.length;
                    }
                }

                // Inicia o rasante quando o jogador está alinhado.
                if (
                    player &&
                    this.diveCooldown === 0 &&
                    this.isPlayerAligned(player)
                ) {
                    this.startDive(player);
                }

                break;
            }

            case "dive": {
                // Calcula a posição do chão, sem deixar o meteoro atravessá-lo.
                const landingY = this.groundY - this.height;

                // Desce até a altura do chão na posição escolhida.
                const arrived = this.moveTowards(
                    this.targetX,
                    landingY,
                    this.diveSpeed,
                    deltaTime
                );

                // Quando chega ao chão, começa a sair da tela.
                if (arrived) {
                    this.state = "exit";
                }

                break;
            }

            case "exit": {
                // Continua descendo até o meteoro sair totalmente da tela.
                this.y += this.diveSpeed * (deltaTime / 1000);

                // Verifica se o meteoro saiu pela parte inferior.
                if (this.y > this.canvasHeight) {
                    // Inicia o temporizador da labareda.
                    this.state = "flameDelay";
                    this.flameTimer = 0;
                    this.exitedScreen = true;
                }

                break;
            }

            case "flameDelay": {
                // Espera meio segundo depois de sair da tela.
                this.flameTimer += deltaTime;

                // Ativa a labareda quando o tempo termina.
                if (this.flameTimer >= this.flameDelay) {
                    this.state = "flame";
                    this.flameActive = true;
                    this.flameActiveTimer = 0;
                    this.flameDamageApplied = false;
                }

                break;
            }

            case "flame": {
                // Acumula o tempo em que a labareda fica ativa.
                this.flameActiveTimer += deltaTime;

                // Obtém a área incendiada.
                const area = this.getAttackArea();

                // Verifica se o jogador está dentro da área da labareda.
                if (player && this.intersects(area, player)) {
                    // Aplica dois pontos de dano apenas uma vez por labareda.
                    if (!this.flameDamageApplied) {
                        if (typeof player.takeDamage === "function") {
                            player.takeDamage(2);
                        } else if (typeof player.health === "number") {
                            player.health = Math.max(
                                0,
                                player.health - 2
                            );
                        }

                        this.flameDamageApplied = true;
                    }
                }

                // Encerra a labareda após a duração definida.
                if (this.flameActiveTimer >= this.flameDuration) {
                    this.flameActive = false;
                    this.state = "rise";
                }

                break;
            }

            case "rise": {
                // Usa a altura do primeiro ponto como referência do topo.
                const topY = this.patrolPoints[0]
                    ? this.patrolPoints[0].y
                    : 0;

                // Sobe lentamente de volta ao topo.
                const arrived = this.moveTowards(
                    this.targetX,
                    topY,
                    this.riseSpeed,
                    deltaTime
                );

                // Quando chega ao topo, retoma a patrulha.
                if (arrived) {
                    this.state = "patrol";

                    // Impede que outro rasante comece imediatamente.
                    this.diveCooldown = this.diveCooldownDuration;
                }

                break;
            }
        }

        // Mantém os projéteis atualizados durante a primeira fase também.
        this.updateProjectiles(deltaTime, player);
    }

    // Recebe dano dos ataques do jogador.
    takeDamage(amount = 1) {
        // Ignora ataques se o boss já foi derrotado.
        if (!this.isAlive) return;

        // Reduz a vida do boss.
        this.health -= amount;

        // Impede que a vida fique negativa.
        this.health = Math.max(0, this.health);

        // Derrota o boss quando sua vida chega a zero.
        if (this.health <= 0) {
            this.isAlive = false;

            // Remove todos os projéteis e efeitos ativos.
            this.projectiles = [];
            this.fireballs = [];
            this.flameActive = false;
        }
    }

    // Desenha o boss e seus ataques.
    draw(ctx, showHitboxes = false) {
        // Não desenha o boss derrotado.
        if (!this.isAlive) return;

        // Desenha o corpo rochoso do meteoro.
        ctx.fillStyle = "#6B3B35";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Desenha detalhes da superfície rochosa.
        ctx.fillStyle = "#A94B2B";
        ctx.fillRect(this.x + 8, this.y + 8, 16, 12);
        ctx.fillRect(this.x + 36, this.y + 28, 18, 14);

        // Desenha as chamas que envolvem o meteoro.
        ctx.fillStyle = "#FF6A00";
        ctx.fillRect(this.x + 4, this.y - 6, 12, 10);
        ctx.fillRect(this.x + 30, this.y - 8, 14, 12);
        ctx.fillRect(this.x + 48, this.y + 8, 10, 12);

        // Desenha o núcleo incandescente.
        ctx.fillStyle = "#FFD447";
        ctx.fillRect(this.x + 24, this.y + 20, 16, 16);

        // Desenha os projéteis comuns.
        ctx.fillStyle = "#FF9D35";
        for (const projectile of this.projectiles) {
            ctx.fillRect(
                projectile.x,
                projectile.y,
                projectile.width,
                projectile.height
            );
        }

        // Desenha as bolas de fogo.
        for (const fireball of this.fireballs) {
            ctx.fillStyle = "#FF3B0A";
            ctx.fillRect(
                fireball.x,
                fireball.y,
                fireball.width,
                fireball.height
            );

            // Desenha o núcleo amarelo da bola de fogo.
            ctx.fillStyle = "#FFD447";
            ctx.fillRect(
                fireball.x + 6,
                fireball.y + 6,
                12,
                12
            );
        }

        // Desenha a área da labareda quando ela estiver ativa.
        if (this.flameActive) {
            const area = this.getAttackArea();

            // Aplica transparência para mostrar a área incendiada.
            ctx.fillStyle = "rgba(255, 60, 0, 0.35)";
            ctx.fillRect(
                area.x,
                area.y,
                area.width,
                area.height
            );

            // Desenha o contorno da labareda para testes.
            if (showHitboxes) {
                ctx.strokeStyle = "#FF0000";
                ctx.strokeRect(
                    area.x,
                    area.y,
                    area.width,
                    area.height
                );
            }
        }

        // Desenha a barra de vida do boss.
        const barWidth = 64;
        const barHeight = 6;
        const healthRatio = this.health / this.maxHealth;

        // Desenha o fundo da barra.
        ctx.fillStyle = "#333333";
        ctx.fillRect(
            this.x,
            this.y - 16,
            barWidth,
            barHeight
        );

        // Desenha a vida restante.
        ctx.fillStyle = this.phase === 1 ? "#E74C3C" : "#FF8C00";
        ctx.fillRect(
            this.x,
            this.y - 16,
            barWidth * healthRatio,
            barHeight
        );
    }
}
