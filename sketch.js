//Group members: Aydan Willburn, Matt Acosta, Jonathan Pak

let flock = [];
let img_N, img_S, img_E, img_W;
let explosionImage;
let collisionDetected = false;
let collisionTime = 0;
let explosionDuration = 100;
let explosionDelay = 1000;
let flockSize = 0;
let explosions = []; 

// Sliders
let numPenguinsSlider, separationSlider, alignmentSlider, cohesionSlider;

function preload() {
    // Load penguin animations
    img_S = [
        loadImage('Penguins/TenderBud/walk_S/0.png'),
        loadImage('Penguins/TenderBud/walk_S/1.png'),
        loadImage('Penguins/TenderBud/walk_S/2.png'),
        loadImage('Penguins/TenderBud/walk_S/3.png')
    ];
    img_N = [
        loadImage('Penguins/TenderBud/walk_N/0.png'),
        loadImage('Penguins/TenderBud/walk_N/1.png'),
        loadImage('Penguins/TenderBud/walk_N/2.png'),
        loadImage('Penguins/TenderBud/walk_N/3.png')
    ];
    img_E = [
        loadImage('Penguins/TenderBud/walk_E/0.png'),
        loadImage('Penguins/TenderBud/walk_E/1.png'),
        loadImage('Penguins/TenderBud/walk_E/2.png'),
        loadImage('Penguins/TenderBud/walk_E/3.png')
    ];
    img_W = [
        loadImage('Penguins/TenderBud/walk_W/0.png'),
        loadImage('Penguins/TenderBud/walk_W/1.png'),
        loadImage('Penguins/TenderBud/walk_W/2.png'),
        loadImage('Penguins/TenderBud/walk_W/3.png')
    ];

    explosionImage = loadImage('explode.gif');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container'); // Attach the canvas to the canvas-container

    // Create sliders
    createP('Number of Penguins').position(10, 10);
    numPenguinsSlider = createSlider(1, 50, 10, 1);
    numPenguinsSlider.position(150, 30);

    createP('Separation').position(10, 50);
    separationSlider = createSlider(0, 5, 1.5, 0.1);
    separationSlider.position(150, 70);

    createP('Alignment').position(10, 90);
    alignmentSlider = createSlider(0, 5, 1.0, 0.1);
    alignmentSlider.position(150, 110);

    createP('Cohesion').position(10, 130);
    cohesionSlider = createSlider(0, 5, 1.0, 0.1);
    cohesionSlider.position(150, 150);

    // Start with some boids
    for (let i = 0; i < numPenguinsSlider.value(); i++) {
        flock.push(new Boid());
    }
}

function draw() {
    clear(); // Clear the canvas for each frame

    // Handle the number of boids based on the slider
    let desiredCount = numPenguinsSlider.value();
    while (flock.length < desiredCount) {
        flock.push(new Boid());
    }
    while (flock.length > desiredCount) {
        flock.pop();
    }

    // Get slider values
    let separationForce = separationSlider.value();
    let alignmentForce = alignmentSlider.value();
    let cohesionForce = cohesionSlider.value();

    //collision detection & explosions
    for (let i = 0; i < flock.length; i++) {
        for (let j = i + 1; j < flock.length; j++) {
            if (flock[i].collidesWith(flock[j])) {
                //add explosion to the array with a timestamp
                explosions.push({
                    x: flock[i].position.x,
                    y: flock[i].position.y,
                    startTime: millis(),
                });
    
                //remove collided boids (1st & 2nd)
                flock.splice(j, 1);
                flock.splice(i, 1); 
                break;
            }
        }
     }

        //render & manage explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            let explosion = explosions[i];
            let elapsedTime = millis() - explosion.startTime;
        
            if (elapsedTime < explosionDuration) {
                //render explosion
                image(explosionImage, explosion.x, explosion.y, 50, 50);
            } else {
                //remove explosion after duration
                 explosions.splice(i, 1);
            }
        }

    // Update and display boids
    for (let boid of flock) {
        boid.applyBehaviors(flock, separationForce, alignmentForce, cohesionForce);
        boid.edges();
        boid.update();
        boid.show();
    }
}

function handleCollision(penguin1, penguin2) {
    //create explosion at the position of the first sprite
    let explosion = createSprite(penguin1.position.x, penguin1.position.y);
    explosion.addImage(explosionImage);
    explosion.scale = 0.5; // Adjust scale if needed

    //hide the penguins
    penguin1.remove();
    penguin2.remove();

    //remove the explosion sprite after a short duration
    setTimeout(() => {
        explosion.remove();
    }, explosionTimeout);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
