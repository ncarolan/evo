# E V O

<img src="evo.png">

evo is a playground for evolutionary agents in your browser, with world mechanics inspired by the popular web game <a href="https://agar.io">agar.io</a>. This project provides a clean, simple visual demonstration of the mechanisms of evolutionary computation.

### Here's how it works:

- Agents spawn into a virtual world filled with food pellets and other agents.
- Agents can eat food to grow, and can eat other agents smaller than them.
- Each agent has a "brain" that determines how it behaves. The parameters of an agent's brain are displayed in its color.
- After each epoch, the most successful alive agents reproduce to populate the next epoch.

### Agent Attributes/Genome:

1. Attraction to food
2. Repulsion from nearby larger agents
3. Attraction to nearby smaller agents


<hr>

### TODO:

- More variation in color representations
- Add selection/recombination methods
- Mini neural networks for agent "brains"?
