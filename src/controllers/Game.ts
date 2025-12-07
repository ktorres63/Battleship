import { Player } from "../models/Player.js";
import { Ship } from "../models/Ship.js";

export class Game {
  player: Player;
  computer: Player;

  constructor() {
    this.player = new Player("human");
    this.computer = new Player("computer")

    this.placeComputerShips();
  }
  placeComputerShips(){
    // const ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];
    const ships = [new Ship(5)];
    
    //TODO: create a function to random the placeShip
    ships.forEach( ship => {
      this.computer.board.placeShip(ship, {x:0,y:0}, "horizontal")
    })
  
  }
  start(){}
}
