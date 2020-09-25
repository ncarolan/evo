let width = 800;
let height = 400;

let clouds = [];
let mountains = [];

let water_level = 0;

function setup() {
  createCanvas(width, height);
  for(let i=0;i<width;i+=70){
    mountains.push(random(height-120,height-water_level));
  }
  windowResized();
}

function draw() {
  background(102,178,255);
  let t = frameCount / 60;
  
  //Draw water
  strokeWeight(0);
  //fill(0,51,102);
  //quad(0,height,width,height,width,height-water_level,0,height-water_level);
  
  //Draw mountains
  fill(36,57,21);
  for(let i=0;i<width;i+=70){
    triangle(i,mountains[i/70],i-100,height,i+100,height);
  }
  
  
  if(random() > 0.99){
      clouds.push(new cloud());
    }

  for(let cloud of clouds){
      cloud.update();
      cloud.display();
    }
  
  //Title
  strokeWeight(5);
  stroke(255, 204, 0);
  fill(102,178,255);
  textSize(50);
  text('KOOPS',(width/2)-100,(height/2)-50,(width/2)+50,(height/2)+50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function cloud() {
  this.X = width;
  this.Y = random(0,height/2);
  
  this.circlesX = [];
  this.circlesY = [];
  
  this.size = this.Y / 8;
  this.speed = this.Y / 300;
  this.count = random(4,10);
  
  for (let i=0;i<this.count;i++){
      this.circlesX.push(random(-this.size,this.size));
      this.circlesY.push(random(-this.size/2,this.size/2));
  }
  
  this.update = function(time){
    this.X -= this.speed;

    //Remove clouds once they pass beyond the screen
    if(this.X < -50){
      let index = clouds.indexOf(this);
      clouds.splice(index, 1);
    }
  };
  
  this.display = function(){
    noStroke();
    fill(255);
    for (let i=0;i<this.count;i++){
      ellipse(this.X+this.circlesX[i],this.Y+this.circlesY[i],this.size);
    }
  }; 
}

function tree() {
  this.Y = height - water_level;
}