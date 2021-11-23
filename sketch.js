var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var sunImg;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("Mikecrack11.png","Mikecrack-.png","Mikecrack11.png","Mikecrack-.png");
  trex_collided = loadAnimation("mike.png");
  sunImg = loadImage("sun.png");
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
     
  sun = createSprite(width-50,100,10,10);
  sun.addImage("sun", sunImg);
  sun.scale = 0.1
  
       invisibleGround = createSprite(width/2,height-8,width,105); 
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.scale = 1.1
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
    
   gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.4;
  restart.scale = 0.08;
  
  gameOver.visible = false;
  restart.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  //console.log("Hello" + 5);
   
  
  trex.setCollider("rectangle",0,0,40,trex.height);

  trex.debug = false
  
  score = 0;
  
}

function draw() {
 
  
  background("lightblue");
  //displaying score
  fill("purple");
  textSize(20);
  text("Puntuación: "+ score, 30,50);
  
  //console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    
    //move the ground
    ground.velocityX = -(6 + 2* score/100)

    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score>0 && score%100 === 0){ checkPointSound.play() }

    if (ground.x < 300){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    
    //stop trex from falling down
    trex.collide(invisibleGround);
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      //trex.velocityY=-12
      //jumpSound.play();

    } 
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
 
  
  //condicion para reiniciar el juego
  if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
   }
  
  drawSprites();
}
 
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-95,20,30);
   obstacle.velocityX = -(6 + 3*score/100);

   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
     
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 234;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
   gameState = PLAY;
   gameOver.visible = false;
   restart.visible = false;
  
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
   
   trex.changeAnimation("running", trex_running);
  
   score = 0
 }
