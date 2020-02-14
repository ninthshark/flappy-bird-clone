const GRAVITY = 0.4;
const FLY = -8;
const PIPE_HEIGHT = 200;
const BIRD_X = 50;

let score = 0;
let highestScore = 0;
let bird;
let pipes = [];
let bird_img;

let bgImage;
let x1 = 0;
let x2;
let scrollSpeed = 1.2;

const audio = document.querySelector("#myAudio");
// const highScore = document.querySelector("#highestScore");

function preload() {
  bgImage = loadImage("bg.png");
  bird_img = loadImage("bird.png");
}

function setup() {
  createCanvas(500, 700);
  bird = new Bird();
  pipes.push(new Pipe());
  //imageMode(CENTER);
  x2 = width;
}

function draw() {
  //background(255);
  image(bgImage, x1, 0, width, height);
  image(bgImage, x2, 0, width, height);

  x1 -= scrollSpeed;
  x2 -= scrollSpeed;

  if (x1 < -width) {
    x1 = width;
  }
  if (x2 < -width) {
    x2 = width;
  }

  //draw bird
  bird.update();
  bird.draw();

  // remove pipe from array if off-screen
  for (let i = pipes.length - 1; i > 0; i--) {
    const pipe = pipes[i];

    pipe.update();
    pipe.draw();

    //check if birt hits the pipe
    if (bird.hits(pipe)) {
      //console.log("Bird dies!!!");
      pipes.splice(0, pipes.length - 1);
      score = 0;
    }

    if (pipe.isOffScreen()) {
      pipes.splice(i, 1);
    }
  }

  //draw pipes
  pipes.forEach(pipe => {});

  if (frameCount % 80 === 0) {
    pipes.push(new Pipe());
  }

  fill(50);
  textSize(20);
  text(`Score: ${score}`, width - 90, 30);
  text(`Highest Score: ${highestScore}`, 30, 30);
}

function keyPressed() {
  if (keyCode === 32) {
    bird.fly();
  }
}

class Bird {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.size = 40;

    this.yVelocity = 0;
  }

  draw() {
    fill(255, 0, 100);
    // noStroke();
    // circle(this.x, this.y, this.size, this.size);
    image(
      bird_img,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    // imageMode(CENTER);
  }

  update() {
    this.yVelocity += GRAVITY;
    this.y += this.yVelocity;

    if (this.y + this.size / 2 > height) {
      this.y = height - this.size / 2;
      this.yVelocity = 0;
    }

    //limit velocity to certain number
    if (this.yVelocity > 10) {
      this.yVelocity = 10;
    }

    if (this.yVelocity < -10) {
      this.yVelocity = -10;
    }
  }

  fly() {
    this.yVelocity += FLY;
  }

  hits(pipe) {
    if (
      this.y - this.size / 2 < pipe.top ||
      this.y + this.size / 2 > pipe.bottom
    ) {
      if (
        this.x + this.size / 2 > pipe.x &&
        this.x - this.size / 2 < pipe.x + pipe.width
      ) {
        return true;
      }
      return false;
    }
  }
}

class Pipe {
  constructor() {
    this.x = width;
    this.top = Math.random() * height - 100;
    this.bottom = this.top + PIPE_HEIGHT;
    this.width = 40;
    this.incrementScore = false;
    //console.log(this.top, this.bottom);
  }

  update() {
    this.x -= 3;
    if (this.x + this.width / 2 < BIRD_X) {
      if (!this.incrementScore) {
        score++;
        this.incrementScore = true;
        audio.play();

        if (score > highestScore) {
          highestScore = score;
          // highScore.play();
        } else {
          highestScore = highestScore;
        }
      }
    }
  }

  draw() {
    fill("#2ecc71");
    rect(this.x, 0, this.width, this.top);
    rect(this.x, this.bottom, this.width, height);
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}
