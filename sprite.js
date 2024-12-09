//Group members: Aydan Willburn, Matt Acosta, Jonathan Pak

class Sprite {
    constructor(images, x, y) {
        this.images = images;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 100;
    }

    draw() {
        image(this.images[this.frame], this.x, this.y, 50, 50);

        if (millis() - this.lastFrameTime > this.frameInterval) {
            this.frame = (this.frame + 1) % this.images.length;
            this.lastFrameTime = millis();
        }
    }
}
