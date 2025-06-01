// BackgroundService: анімований фон із пташками на будь-яких сторінках


import {BaseBird} from "./BaseBird.js";

export class BackgroundService {
    constructor(options = {}) {
        this.options = options;
        this.canvas = null;
        this.ctx = null;
        this.birds = [];
        this.svgUrls = options.svgUrls ||
            ['./images/bird-up.svg', './images/bird-logo.svg', './images/bird-down.svg'];
        this.loadedImgs = [];
        this.loadedCount = 0;
        this.numBirds = options.numBirds || 6;
        this.birdSize = options.birdSize || 60;
        this.frameDelay = options.frameDelay || 8;
        this.autoFlapMin = options.autoFlapMin || 20;
        this.autoFlapMax = options.autoFlapMax || 50;
        this.gravity = options.gravity || 0.2;
        this.jumpVelocity = options.jumpVelocity || -4;

        this._initCanvas();
        this._loadImages();
        this._addJumpListener();
    }

    _initCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.options.canvasId || 'bgCanvas';
        document.body.prepend(this.canvas);
        Object.assign(this.canvas.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100%', height: '100%', zIndex: '-1', pointerEvents: 'none'
        });
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('resize', () => this._resize());
        this._resize();
    }

    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _loadImages() {
        this.svgUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.loadedImgs.push(img);
                this.loadedCount++;
                if (this.loadedCount === this.svgUrls.length) {
                    this._startAnimation();
                }
            };
        });
    }

    _addJumpListener() {
        document.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                this.birds.forEach(bird => bird.flap());
            }
        });
    }

    _startAnimation() {
        for (let i = 0; i < this.numBirds; i++) {
            const frames = [];
            for (let j = 0; j < 3; j++) {
                const idx = Math.floor(Math.random() * this.loadedImgs.length);
                frames.push(this.loadedImgs[idx]);
            }
            const speedX = Math.random() * 1 + 0.5;
            const bird = new BaseBird(
                frames,
                -this.birdSize,
                Math.random() * this.canvas.height,
                this.birdSize,
                this.frameDelay,
                this.gravity,
                this.jumpVelocity
            );
            bird.vx = speedX;
            bird.autoFlapTimer = this._randomAutoFlap();
            this.birds.push(bird);
        }
        requestAnimationFrame(() => this._animate());
    }

    _randomAutoFlap() {
        return Math.floor(
            Math.random() * (this.autoFlapMax - this.autoFlapMin + 1) + this.autoFlapMin
        );
    }

    _animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.birds.forEach(bird => {
            if (bird.x > this.canvas.width + bird.size) bird.x = -bird.size;
            if (--bird.autoFlapTimer <= 0) {
                bird.flap();
                bird.autoFlapTimer = this._randomAutoFlap();
            }
            bird.update(this.canvas);
            bird.draw(this.ctx);
        });
        requestAnimationFrame(() => this._animate());
    }
}