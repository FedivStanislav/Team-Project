export class BaseBird {
    constructor(frames, x, y, size, frameDelay, gravity, jumpVelocity) {
        this.frames = frames;
        this.x = x;
        this.y = y;
        this.size = size;
        this.frameDelay = frameDelay; 
        this.gravity = gravity; 
        this.jumpVelocity = jumpVelocity; 
        this.vx = 0; 
        this.vy = 0; 
        this.frameIndex = 1; 
        this.tick = 0;
        this.flapCount = 0; 
    }

    flap() {
        this.flapCount = this.frames.length;
        this.vy = this.jumpVelocity;
    }
    update(canvas) {
        this.vy += this.gravity;
        this.y += this.vy;
        this.x += this.vx;
        
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        
        if (this.flapCount > 0) {
            if (++this.tick >= this.frameDelay) {
                this.tick = 0;
                this.frameIndex = (this.frameIndex + 1) % this.frames.length;
                this.flapCount--;
            }
        } else {
            this.frameIndex = 1;
        }
    }
    
    draw(ctx) {
        const img = this.frames[this.frameIndex];
        ctx.drawImage(
            img,
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
}