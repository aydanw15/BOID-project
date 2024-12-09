//Group members: Aydan Willburn, Matt Acosta, Jonathan Pak

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.maxForce = 0.05;
        this.maxSpeed = 3;

        this.currentAnimation = img_S; //idleee
        this.frameIndex = 0;
        this.lastFrameTime = millis();
    }

    edges() {
        const spriteSize = 50; //approx width/height of the sprite

        //check right
        if (this.position.x + spriteSize >= width) {
            this.position.x = width - spriteSize;
            this.velocity.x *= -1;
        }
        //check left
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocity.x *= -1;
        }
        //check bottom
        if (this.position.y + spriteSize >= height) {
            this.position.y = height - spriteSize;
            this.velocity.y *= -1;
        }
        //check top
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y *= -1;
        }
    }

    applyBehaviors(boids, separationForce, alignmentForce, cohesionForce) {
        let separation = this.separate(boids).mult(separationForce);
        let alignment = this.align(boids).mult(alignmentForce);
        let cohesion = this.cohere(boids).mult(cohesionForce);

        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    separate(boids) {
        let desiredSeparation = 50;
        let steer = createVector(0, 0);
        let count = 0;

        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d > 0 && d < desiredSeparation) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) {
            steer.div(count);
        }
        if (steer.mag() > 0) {
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    align(boids) {
        let neighborDist = 50;
        let sum = createVector(0, 0);
        let count = 0;

        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d > 0 && d < neighborDist) {
                sum.add(other.velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    cohere(boids) {
        let neighborDist = 50;
        let sum = createVector(0, 0);
        let count = 0;

        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d > 0 && d < neighborDist) {
                sum.add(other.position);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum);
        } else {
            return createVector(0, 0);
        }
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    collidesWith(other) {
        let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        return distance < 25;
    }

    updateAnimation() {
        if (abs(this.velocity.x) > abs(this.velocity.y)) {
            this.currentAnimation = this.velocity.x > 0 ? img_E : img_W;
        } else {
            this.currentAnimation = this.velocity.y > 0 ? img_S : img_N;
        }

        if (millis() - this.lastFrameTime > 100) {
            this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
            this.lastFrameTime = millis();
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.updateAnimation();
    }

    show() {
        const frame = this.currentAnimation[this.frameIndex];
        image(frame, this.position.x, this.position.y, 50, 50); //size HERE
    }
}
