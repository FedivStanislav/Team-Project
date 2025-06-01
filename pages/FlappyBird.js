import { BaseBird } from "./BaseBird.js";

export class FlappyBird {
    constructor(containerId) {
        this.containerId = containerId;
        this.canvas = null;
        this.ctx = null;

        this.birdFrames = [];
        this.loadBirdFrames = [
            './images/bird-up.svg',
            './images/bird-logo.svg',
            './images/bird-down.svg'
        ];

        this.bird = new BaseBird(
            this.birdFrames,
            100, 300,
            40,
            1,
            0.5,
            -7.5
        );
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;
        this.pipeGap = 150;
        this.pipeSpeed = 2;
        this.pipeFrequency = 100;
        this.frameCount = 0;
    }
    
    loadImages(srcArray) {
        return new Promise((resolve) => {
            let loadedCount = 0;
            srcArray.forEach(src => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === srcArray.length) resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${src}`);
                    loadedCount++;
                    if (loadedCount === srcArray.length) resolve();
                };
                img.src = src;
                this.birdFrames.push(img);
            });
        });
    }

    renderGame() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found');
            return;
        }

        container.innerHTML = `
            <canvas id="flappyCanvas" style="border: 1px solid black" width="400" height="600"></canvas>
            <div id="gameOver" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: red; font-size: 24px;">
                Game Over!<br>Score: <span id="finalScore">0</span><br>Press Space to Restart
            </div>
            <div id="score" style="position: absolute; top: 10px; left: 10px; font-size: 20px; color: #000; font-family: Arial, sans-serif;">Score: 0</div>
        `;

        this.canvas = document.getElementById('flappyCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.addJumpEventListener();
        this.addRestartEventListener();
        
        this.loadImages(this.loadBirdFrames).then(() => {
            this.gameLoop();
        }).catch(error => {
            console.error('Error loading bird frames:', error);
        });
    }

    addJumpEventListener() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameOver) {
                this.jumpBird();
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.gameOver) {
                e.preventDefault();
                this.jumpBird();
            }
            else{
                this.restartGame();
            }
        });

        document.getElementById("flappyCanvas").addEventListener('touchstart', (e) => {
            if (!this.gameOver) {
                e.preventDefault();
                this.jumpBird();
            }
            else{
                this.restartGame();
            }
        });
    }

    addRestartEventListener() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameOver) {
                this.restartGame();
            }
        });
    }

    jumpBird() {
        this.bird.flap();
    }

    generatePipes() {
        this.frameCount++;
        if (this.frameCount % this.pipeFrequency === 0) {
            const gapY = Math.random() * (this.canvas.height - 200) + 100;
            this.pipes.push({
                x: this.canvas.width,
                top: gapY - this.pipeGap / 2,
                bottom: gapY + this.pipeGap / 2,
                passed: false,
            });
        }
    }

    updatePipes() {
        this.pipes.forEach((pipe) => {
            pipe.x -= this.pipeSpeed;
        });
        this.pipes = this.pipes.filter((pipe) => pipe.x > -50);
    }

    updateScore() {
        this.pipes.forEach((pipe) => {
            if (!pipe.passed && pipe.x < this.bird.x) {
                this.score += 1;
                pipe.passed = true;
                document.getElementById('score').textContent = `Score: ${this.score}`;
            }
        });
    }

    checkGameOver() {
        if (this.bird.y > this.canvas.height - 20 || this.bird.y < 0) {
            this.gameOver = true;
        }

        this.pipes.forEach((pipe) => {
            if (
                this.bird.x + 20 > pipe.x &&
                this.bird.x - 20 < pipe.x + 50 &&
                (this.bird.y - 20 < pipe.top || this.bird.y + 20 > pipe.bottom)
            ) {
                this.gameOver = true;
            }
        });

        if (this.gameOver) {
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('finalScore').textContent = this.score;
        }
    }

    restartGame() {
        this.bird = new BaseBird(
            this.birdFrames,
            100, 300,
            40,
            1,
            0.5,
            -7.5
        );
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;
        this.frameCount = 0;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bird.draw(this.ctx);

        this.ctx.fillStyle = 'green';
        this.pipes.forEach((pipe) => {
            this.ctx.fillRect(pipe.x, 0, 50, pipe.top);
            this.ctx.fillRect(pipe.x, pipe.bottom, 50, this.canvas.height - pipe.bottom);
        });
    }

    gameLoop() {
        if (!this.gameOver) {
            this.bird.update(this.canvas);
            this.generatePipes();
            this.updatePipes();
            this.updateScore();
            this.checkGameOver();
            this.draw();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}