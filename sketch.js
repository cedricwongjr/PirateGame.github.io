const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg, waterSound, backgroundMusic, cannonExplosion, pirateLaughSound;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];
var watersplashAnimation = [];
var watersplashSpritedata;
var watersplashSpritesheet;
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;
var score = 0;
var isGameOver = false;
var isLaughing = false;
var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  watersplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  watersplashSpritesheet = loadImage("assets/water_splash/water_splash.png");
  backgroundMusic = loadSound("assets/background_music.mp3");
  waterSound = loadSound("assets/cannon_water.mp3");
  pirateLaughSound = loadSound("assets/pirare_laugh.mp3");
  cannonExplosion = loadSound("assets/cannon_explosion.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = watersplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = watersplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    watersplashAnimation.push(img);
  }

}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();

  showBoats();
  showCannonBalls();

  for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];
    ball.display();
    ball.animate();
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if (collision.collided) {
          if (!boats[j].isBroken && !balls[i].isSink) {
            score += 5;
            boats[j].remove(j);
            j--;
          }

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
        }
      }
    }
  }

  cannon.display();
  tower.display();

  textSize(20);
  fill("#black");
  text("Score: " + score, width - 200, 50);

}

function keyPressed() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    var cannonball = new CannonBall(cannon.x, cannon.y);
    cannonball.shoot(); // Call the shoot() method to set the velocity of the cannonball
    balls.push(cannonball);
    waterSound.play();
  }
}

function showCannonBalls() {
  for (var i = 0; i < balls.length; i++) {
    if (balls[i]) {
      balls[i].display();
      balls[i].animate();
      if (balls[i].body.position.x >= width || balls[i].body.position.y >= height - 50) {
        if (!balls[i].isSink) {
          waterSound.play();
          balls[i].remove(i);
        }
      }
    }
  }
}

function showBoats() {
  if (boats.length < 4) {
    if (boats.length === 0 || boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      boat = new Boat(width, height - 100, 200, 200, position, boatAnimation);
      boats.push(boat);
    }
  }

    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });
        boats[i].display();
        boats[i].animate();

        var collision = Matter.SAT.collides(tower.body, boats[i].body);
        if (collision.collided && !boats[i].isBroken) {
          if (!isLaughing) {
            pirateLaughSound.play();
            isLaughing = true;
          }
          isGameOver = true;
          gameOver();
        }
      }
    }
  }


function gameOver() {
  swal(
    {
      title: "Game Over!!!",
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}





