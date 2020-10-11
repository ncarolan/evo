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
        agents.push(new agent(10,1,-1));
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
      agents = selection(agents);

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

// Selection Function : returns list of agents for next epoch
function selection(agents){
  let total_eaten = 0;
  let survived_agents = [];

  for(let agent of agents){
    if(agent.alive){
      total_eaten += (agent.size-40);
      agent.size = 40;
      survived_agents.push(agent);
    }
  }

  // Create new agents if needed
  while(survived_agents.length < agentCount){
    survived_agents.push(new agent((Math.random() * 20) + 1, (Math.random() * 2), -1 - (Math.random() * 10)));
  }

  return survived_agents;

}

// Agent -----------------------------------------------------------------------------------------
function agent(food_attraction,agent_attraction,agent_fear){
  this.X = random(0,width);
  this.Y = random(0,height);

  this.color = [food_attraction*10, agent_attraction * 20, Math.abs(agent_fear)*100];

  this.size = 40;

  // Speed
  this.speed = 40;

  //Alive Flag
  this.alive = true;

  //Genetic Features
  this.food_attraction = food_attraction;
  this.agent_attraction = agent_attraction;
  this.agent_fear = agent_fear;

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
    let c = color(this.color[0],this.color[1],this.color[2])
    fill(c);
      ellipse(this.X,this.Y,this.size);
  }; 

  // Internal "brain"
  this.output = function(nearestFood,nearestBiggerAgent,nearestSmallerAgent){
    //let answer = [0,0];
    let X = this.food_attraction * (nearestFood[0]-this.X) + this.agent_fear * (nearestBiggerAgent[0]-this.X) + this.agent_attraction * (nearestSmallerAgent[0]-this.X);
    let Y = this.food_attraction * (nearestFood[1]-this.Y) + this.agent_fear * (nearestBiggerAgent[1]-this.Y) + this.agent_attraction * (nearestSmallerAgent[1]-this.Y);
    return [X,Y];
  }

  // UPDATE FUNCTION
  this.update = function(){
    if(this.alive){
        //Move in given direction


        //Identify nearest food and move toward it
        let nearestFoodDist = 999999;
        let dist_x = this.X;
        let dist_y = this.Y;
        let dist = 0;
        let nearestFood = [this.X,this.Y];
        for(let food of foodList){
          if(!food.eaten){
            dist_x = abs(this.X-food.X);
            dist_y = abs(this.Y-food.Y);
            dist = sqrt(dist_x**2 + dist_y**2);

            if(dist < nearestFoodDist){
              nearestFoodDist = dist; 
              nearestFood = [food.X, food.Y];         
            }
          }
        }

        // Identify nearest larger agent and most away / toward it
        let nearestAgentDist = 999999;
        let nearestLargerAgent = [this.X, this.Y];
        for(let otherAgent of agents){
          if(otherAgent.size > this.size){
            dist_x = abs(this.X-otherAgent.X);
            dist_y = abs(this.Y-otherAgent.Y);
            dist = sqrt(dist_x**2 + dist_y**2);

            if(dist < nearestAgentDist && dist < 50){
              nearestAgentDist = dist;
              nearestLargerAgent = [otherAgent.X, otherAgent.Y];
            }
          }
        }

        // Identify nearest larger agent and most away / toward it
        nearestAgentDist = 999999;
        let nearestSmallerAgent = [this.X,this.Y];
        for(let otherAgent of agents){
          if(otherAgent.size < this.size){
            dist_x = abs(this.X-otherAgent.X);
            dist_y = abs(this.Y-otherAgent.Y);
            dist = sqrt(dist_x**2 + dist_y**2);

            if(dist < nearestAgentDist && dist < 50){
              nearestAgentDist = dist;
              nearestSmallerAgent = [otherAgent.X, otherAgent.Y];
            }
          }
        }


      //div_factor regulates speed
      let output = this.output(nearestFood,nearestLargerAgent,nearestSmallerAgent);
      let deltaX = output[0];
      let deltaY = output[1];
      let div_factor = 100 / (this.size * (abs(deltaX) + abs(deltaY)));
      this.X += (deltaX) * div_factor;
      this.Y += (deltaY) * div_factor;
      //Constrain to screen
      if(this.X < this.size){
        this.X=this.size;
      }
      if(this.X > width-this.size){
        this.X=width-this.size;
      }
      if(this.Y-this.size < 0){
        this.Y=this.size;
      }
      if(this.Y > height-this.size){
        this.Y=height-this.size;
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
          this.size += sqrt(otherAgent.size);

          //Eat agent / Make not accessible
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
