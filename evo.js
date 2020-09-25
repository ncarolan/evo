// GLOBAL VARIABLES ----------------------------------------------------------------------------

// Fallback display sizes
let height = 500;
let width = 1000;

// Objects for title screen sequence
let ax=[];
let ay=[];

let node_num=400;

let color_list = ['rgb(0,255,0)','rgb(255,51,255)','rgb(205,255,255)','rgb(255,178,102)'];

// Boolean to start simulation
let flag = false;

// Agent Parameters
let agents = [];
let agentCount = 10;

// Evolution Parameters
let EPOCHS = 100;
let epoch_count = 0;
let epoch_time = 10;
let start_time = 0;

//Food Parameters
let foodList = [];
let foodCount = 50;

// SETUP ----------------------------------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  for ( let i = 0; i < node_num; i++ ) {
    ax[i] = 0;
    ay[i] = 0;
  }
  height = windowHeight;
  width = windowWidth;
}

// WINDOW RESIZE --------------------------------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// DRAW -----------------------------------------------------------------------------------------
function draw() {
  let t = frameCount / 60;

  background(0);
  
  //Title Screen
  if(!flag){
    // Shift all elements 1 place to the left
    for ( let i = 1; i < node_num; i++ ) {
      ax[i - 1] = ax[i];
      ay[i - 1] = ay[i];
    }
    
    //Add nodes
      ax[node_num - 1] = random(-width, width);
      ay[node_num - 1] = random(-height, height);
    
    // Draw points
    for ( let j = 1; j < node_num; j++ ) {
      strokeWeight(5);
      stroke(random(color_list));
      point(ax[j], ay[j]);
    }
    
    // Draw title
    fill(0);
    textSize(70);
    textStyle(NORMAL);
    stroke('rgba(0,255,0,)');
    strokeWeight(5);
    text('E V O',(width/2)-100,(height/2)-30,(width/2)+50,(height/2)+50);

    if (t > 1){
      textSize(20);
      strokeWeight(0);
      fill(255);
      textStyle(BOLD);
      text('CLICK TO START',(width/2)-90,(height/2)+50,(width/2)+50,(height/2)+100);
    }
  } // End Title Screen

  // Begin Simulation
  if (mouseIsPressed && !flag && t>1){
    //Create initial agents
    for ( let i = 1; i <= agentCount; i++ ) {
        agents.push(new agent());
      }
    //Populate initial food
    for ( let i = 1; i <= foodCount; i++ ) {
        foodList.push(new food());
      }

    flag = true;

    //Start time
    start_time = t;
  }


  // SIMULATION
  if (flag){
    
    //Display Epoch Counter
    fill(255);
    text('EPOCH: '+ epoch_count,0,0,50,50);


    simulate();


    //Update epoch
    if((t - start_time) % epoch_time == 0){
      epoch_count += 1;

      //Perform selection and recombination after each epoch

      //Populate food for next epoch
      foodList = [];
      for ( let i = 1; i <= foodCount; i++ ) {
        foodList.push(new food());
      }
    }
  }

}

// RUN SIMULATION --------------------------------------------------------------------------------
function simulate(){
    for (let food of foodList){
      food.display();
    }
  // Update Agents + Draw
    for (let agent of agents){
      agent.update();
      agent.display();
    }
}

// Agent -----------------------------------------------------------------------------------------
function agent(){
  this.X = random(0,width);
  this.Y = random(0,height);

  this.color = random(color_list);

  this.size = 40;

  // Speed
  this.speed = 40;

  //Alive Flag
  this.alive = true;

  //Genetic Features
  //this.food_attraction = random(-10,10);
  //this.agent_attraction = random(-10,10);

  //Check Distance - determines if agent can eat pellets or agents
  this.check_distance = function(entity){
    let dist_x = abs(this.X-entity.X);
    let dist_y = abs(this.Y-entity.Y);

    let dist = sqrt(dist_x**2 + dist_y**2);
    if (dist <= this.size/2){
      return true;
    }else{
      return false;
    }
  }

  // Draws agent on the screen
  this.display = function(){
    noStroke();
    fill(this.color);
      ellipse(this.X,this.Y,this.size);
  }; 

  // UPDATE FUNCTION
  this.update = function(){
    if(this.alive){
        //Move in given direction


        //Identify nearest food and move toward it
        let nearestFoodDist = 999999;
        let dist_x = 0;
        let dist_y = 0;
        let dist = 0;
        let nearestFoodX = width/2;
        let nearestFoodY = height/2;
        for(let food of foodList){
          if(!food.eaten){
            dist_x = abs(this.X-food.X);
            dist_y = abs(this.Y-food.Y);
            dist = sqrt(dist_x**2 + dist_y**2);

            if(dist < nearestFoodDist){
              nearestFoodDist = dist; 
              nearestFoodX = food.X;
              nearestFoodY = food.Y;          
            }
          }
        }

        // Identify nearest agent and most away / toward it

        if(foodList.length > 0){
          //div_factor regulates speed
          let div_factor = 1 / (abs(nearestFoodX-this.X) + abs(nearestFoodY-this.Y));
          this.X += (nearestFoodX - this.X) * div_factor;
          this.Y += (nearestFoodY - this.Y) * div_factor;
          //Constrain to screen
        }

      //Check for food
      for(let food of foodList){
        if(this.check_distance(food) && !food.eaten){
          this.size += 1;
          this.speed = 40 / this.size;

          //Eat food / Make not accessible
          food.eaten = true;
          food.X = -100;
          food.Y = -100;
        }
      }

      //Check for other agents
      for(let otherAgent of agents){
        if(this.check_distance(otherAgent) && this.size > otherAgent.size && otherAgent.alive){
          this.size += otherAgent.size;

          //Eat food / Make not accessible
          otherAgent.X = -1000;
          otherAgent.Y = -1000;
          otherAgent.alive = false;
        }
      }

    } // End alive
  }


}

// Food Class --------------------------------------------------------------------------------------
function food(){
    this.X = random(0,width);
    this.Y = random(0,height);
    this.eaten = false;

  this.display = function(){
    noStroke();
    fill(random(color_list));
      ellipse(this.X,this.Y,5);
  }; 
}

// Selection process
// function eval_fitness(agent){
//  return agent.size;
//}

// Recombination



// Helper Functions
