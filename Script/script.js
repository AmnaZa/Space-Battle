// create Ship class to use as prototype of all ships in the game
class Ship {
    constructor(name, hull, firepower, accuracy) {
      this.name = name;
      this.hull = hull;
      this.firepower = firepower;
      this.accuracy = accuracy;
      this.position = { x: 0, y: 0 }; // Initialize position
      this.speed = 5; // Speed of movement
    }
  
    moveUp() {
      this.position.y -= this.speed;
      this.updatePosition();
    }
  
    moveDown() {
      this.position.y += this.speed;
      this.updatePosition();
    }
  
    moveLeft() {
      this.position.x -= this.speed;
      this.updatePosition();
    }
  
    moveRight() {
      this.position.x += this.speed;
      this.updatePosition();
    }
  
    updatePosition() {
      console.log(`${this.name} position: x=${this.position.x}, y=${this.position.y}`);
      // Update the player's position on the screen
      const playerElement = document.getElementById("player");
      playerElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
  
    attack(enemy) {
      if (Math.random() > this.accuracy) {
        console.log("==============================");
        console.log(`${this.name} missed`);
        console.log("==============================");
        return `${enemy.name} hull: ${enemy.hull}`;
      } else {
        enemy.hull -= this.firepower;
        console.log("==============================");
        console.log(`${this.name} dealt ${this.firepower} damage.`);
        console.log("==============================");
        return `${enemy.name} hull: ${enemy.hull}`;
      }
    }
  
    update() {
      console.log(`*${this.name}'s hull: ${this.hull}`);
    }
  }
  
  // create USS Assembly ship with pre-determined parameters
  let USSA = new Ship("USS Assembly", 20, 5, 0.7);
  
  // Add event listeners for arrow key movements
  document.addEventListener("keydown", function(event) {
    switch (event.key) {
      case "ArrowUp":
        USSA.moveUp();
        break;
      case "ArrowDown":
        USSA.moveDown();
        break;
      case "ArrowLeft":
        USSA.moveLeft();
        break;
      case "ArrowRight":
        USSA.moveRight();
        break;
    }
  });
  
  // create array to hold 6 alien ships with randomly generated parameter values that fit within pre-determined range
  let alienFleet = [];
  
  // create for loop to create 6 alien ship objects and push them into the array
  for (let i = 0; i < 6; i++) {
    alienFleet[i] = new Ship(
      `Alien Ship ${i + 1}`,
      Math.floor(Math.random() * (7 - 3) + 3),
      Math.floor(Math.random() * (5 - 2) + 2),
      Math.random() * (0.8 - 0.6) + 0.6
    );
  }
  
  // set boolean variable for controlling loops
  let choice = true;
  
  // create button element and add click event listener to start the game
  const attackButton = document.getElementById("attack");
  attackButton.addEventListener("click", function () {
    choice = false;
    // loop for the whole game: while USSA hull > 0 and alienFleet.length > 0
    if (USSA.hull > 0 && alienFleet.length > 0 && !choice) {
      USSA.attack(alienFleet[0]);
      USSA.update();
      alienFleet[0].update();
  
      // check whether USSA.attack destroyed alienFleet[0]
      if (alienFleet[0].hull > 0) {
        // alienFleet[0] attacks USSA
        alienFleet[0].attack(USSA);
        USSA.update();
        alienFleet[0].update();
        choice = true;
        // check if alien attack destroyed USS Assembly
        if (USSA.hull <= 0) {
          const playerElement = document.getElementById("player");
          playerElement.classList.add("explosion");
          attackButton.remove();
          retreatButton.remove();
          setTimeout(function () {
            // remove current spaceship element from DOM
            playerElement.remove();
            // console log game over
            const fleetElement = document.getElementById("fleet");
            fleetElement.insertAdjacentHTML(
              "afterend",
              "<h1 class='message'>GAME OVER</h1><h2>Refresh the page to play again</h2>"
            );
          }, 1000);
        }
      } else {
        const firstShipElement = document.querySelector(".ship");
        firstShipElement.classList.add("explosion");
        setTimeout(function () {
          // remove 1st alien ship from alienFleet
          alienFleet.shift();
          console.log(`Alien Ships left: ${alienFleet.length}`);
          // remove current .ship element from DOM
          firstShipElement.remove();
          // console log victory if the while loop completes due to all alien ships being destroyed, not USSA.hull < 0
          if (USSA.hull > 0 && alienFleet.length === 0) {
            attackButton.remove();
            retreatButton.remove();
            const playerElement = document.getElementById("player");
            playerElement.insertAdjacentHTML(
              "beforebegin",
              "<h1 class='message'>Victory!</h1><h2>Refresh the page to play again</h2>"
            );
          }
        }, 1000);
        // switch value of choice to true in order to stop the while loop and await user input (button click event)
        choice = true;
      }
    }
  });
  
  // create retreat button element and add click event listener
  const retreatButton = document.getElementById("retreat");
  retreatButton.addEventListener("click", function () {
    const playerImage = document.getElementById("player");
    playerImage.remove();
    attackButton.remove();
    retreatButton.remove();
    const fleetElement = document.getElementById("fleet");
    fleetElement.insertAdjacentHTML("afterend", "<h1 class='message'>GAME OVER</h1>");
  });
  