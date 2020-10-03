//Gamestates
var PLAY, END, gameState;
PLAY = 1
END = 0;
gameState = PLAY

//Background Image
var backgroundImage;

//ground and ground image
var ground, groundImage;

// Robot sprite and robot animation
var robot, robotRunning, robotJumping, robotStill;

//obstacle
var obstacle, obstacleImage, obstacleGroup;

//obstacle2
var obstacle2, obstacleImage2, obstacleGroup2;

// Gameover things
var gameOverSprite, gameOverImage, restartSprite, restartImage;

//score
var score;
score = 0;

//highscore
localStorage["Highscore"] = 0

function preload() {
  // ground image
  groundImage = loadImage("industrialPlatform.png");
  
  //background image
  backgroundImage = loadImage("industrialBackground.png");
  
  // robot running
  robotRunning = loadAnimation("run00.png", "run01.png", "run02.png", "run03.png", "run04.png", "run05.png", "run06.png", "run07.png");
  
  // robot jumping
  robotJumping = loadAnimation("jump00.png", "jump01.png", "jump02.png", "jump03.png", "jump04.png", "jump05.png", "jump06.png", "jump07.png", "jump08.png", "jump09.png");
  
  // robot still
  robotStill = loadAnimation("run00.png");
  
  // obstacles images
  obstacleImage = loadImage("spikeBlock.png");
  obstacleImage2 = loadImage("blast.png");
  
  // gameover images
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restartButton.png");
}

function setup() {
  createCanvas(600, 200);
  
  // ground sprite
  ground = createSprite(200, 200, 400, 20);
  ground.addImage(groundImage);
  
  // robot sprite
  robot = createSprite(25, 180, 20, 50);
  robot.addAnimation("running", robotRunning);
  robot.addAnimation("jumping", robotJumping);
  robot.addAnimation("still", robotStill);
  robot.setCollider("rectangle", 0, 0, 35, robot.height);
  
  //groups
  obstacleGroup = new Group();
  obstacleGroup2 = new Group();
  
  // gameover sprites
  gameOverSprite = createSprite(300, 100);
  gameOverSprite.addImage(gameOverImage)
  gameOverSprite.scale = 0.5;
  
  restartSprite = createSprite(300, 140);
  restartSprite.addImage(restartImage);
  restartSprite.scale = 0.75;
}

function draw() {
  background(backgroundImage);
  
  //score and highscore display
  textSize(20);
  fill("yellow");
  text("Score: " + score, 10, 50);
  fill("red");
  text("Highscore: " + localStorage["Highscore"], 410, 50);
  
  if (gameState === PLAY) {
    //score calculation
    score = Math.round(frameCount/60);
    
    //ground motion
    ground.velocityX = -(6 + score/10);
    
    // infinite ground
    if (ground.x < 0) {
      ground.x = ground.width/2;
    }
    
    // robot jump
    if (keyDown("space") && robot.y > 149) {
      robot.velocityY = -14;
      robot.changeAnimation("jumping", robotJumping);
      setTimeout(changeAnim, 1000);
    }
    
    // Garvity effect
    robot.velocityY = robot.velocityY + 0.8
    robot.collide(ground);
    
    //spawn obstacles
    spawnObstacle();
    spawnObstacle2();
    
    // blast effect
    if (robot.isTouching(obstacleGroup2)) {
      robot.velocityY = 0;
      robot.y = 150
      obstacleGroup2.destroyEach();
      setTimeout(changeAnim, 1); 
    }
    
    // gameover
    if (robot.isTouching(obstacleGroup)) {
      gameState = END;
    }
    
    //hide game over sprites
    gameOverSprite.y = 500;
    restartSprite.y = 500;
    gameOverSprite.visible = false;
    restartSprite.visible = false;
    
  }else if (gameState === END) {
    // stops everthing
    ground.velocityX = 0;
    obstacleGroup.setVelocityEach(0, 0);
    obstacleGroup2.setVelocityEach(0, 0);
    robot.changeAnimation("still", robotStill);
    robot.setVelocity(0, 0);
    
    // prevents obstacles from despawing
    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup2.setLifetimeEach(-1);
    
    // shows game over sprites
    gameOverSprite.y = 100;
    restartSprite.y = 140;
    gameOverSprite.visible = true;
    restartSprite.visible = true;
    
    // restart
    if (mousePressedOver(restartSprite)) {
      reset();
    }
  }
  
  drawSprites();
}

function changeAnim() {
  robot.changeAnimation("running", robotRunning);
}

function spawnObstacle() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 150, 20, 20);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -(6 + score/10);
    obstacle.setlifetime = 100;
    obstacle.scale = 0.5;
    obstacle.collide(ground);
    
    obstacleGroup.add(obstacle);
  }
}

function spawnObstacle2() {
  if (frameCount % 120 === 0) {
    obstacle2 = createSprite(500, random(100, 200), 20, 20);
    obstacle2.addImage(obstacleImage2);
    obstacle2.velocityX = -(6 + score/10);
    obstacle2.setlifetime = 100;
    obstacle2.scale = 0.5;
    
    obstacleGroup2.add(obstacle2);
  }
}

function reset() {
  gameState = PLAY;
  
  obstacleGroup.destroyEach();
  obstacleGroup2.destroyEach();
  
  robot.changeAnimation("running", robotRunning);
  
  if (localStorage["Highscore"] < score) {
    localStorage["Highscore"] = score;
  }
  
  score = 0;
  
  frameCount = 0;
}