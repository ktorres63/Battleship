import type { Gameboard } from "../models/Gameboard.js";
import { Player } from "../models/Player.js";
import { Ship } from "../models/Ship.js";
interface ICoordinates {
  x: number;
  y: number;
}
export class Game {
  player: Player;
  computer: Player;
  started: boolean = false;

  constructor() {
    this.player = new Player("human");
    this.computer = new Player("computer");
  }
  start() {
    // this.placeComputerShips();
    this.staticPlaceComputerShips();
    this.started = true;
  }
  private staticPlaceComputerShips() {
    const ships = [
      new Ship(5), // portaaviones
      new Ship(4), // acorazado
      new Ship(3), // crucero
      new Ship(3), // submarino
      new Ship(2), // destructor
    ];

    this.computer.board.placeShip(ships[0]!, { x: 0, y: 0 }, "horizontal"); // (0,0)-(4,0)
    this.computer.board.placeShip(ships[1]!, { x: 2, y: 2 }, "vertical"); // (2,2)-(2,5)
    this.computer.board.placeShip(ships[2]!, { x: 5, y: 1 }, "horizontal"); // (5,1)-(7,1)
    this.computer.board.placeShip(ships[3]!, { x: 7, y: 3 }, "vertical"); // (7,3)-(7,5)
    this.computer.board.placeShip(ships[4]!, { x: 4, y: 6 }, "horizontal"); // (4,6)-(5,6)
  }

  playerAttack(coord: ICoordinates) {
    try {
      const result = this.computer.board.receiveAttack(coord);
      if (this.isHumanWinner()) {
        return result;
      }
      this.computerAttack();
      return result;
    } catch (err) {
      throw err;
    }
  }
  computerAttack(): ICoordinates | null {
    const coord = this.computer.randomAttack(this.player.board);
    if (!coord) {
      return null;
    }
    return coord;
  }
  isHumanWinner() {
    if (this.computer.board.ships.length === 0) return false;
    return this.computer.board.allShipsSunk();
  }
  isComputerWinner() {
    return this.player.board.allShipsSunk();
  }
  getGameStatus() {
    const humanWon = this.isHumanWinner();
    const computerWon = this.isComputerWinner();

    if (humanWon && computerWon) return "draw"; // empate
    if (humanWon) return "human_wins";
    if (computerWon) return "computer_wins";

    return "in_progress";
  }

  private placeComputerShips() {
    const ships = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];
    //TODO: create a function to random the placeShip
    ships.forEach((ship) => {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const MaxX =
          orientation === "horizontal"
            ? this.computer.board.size - ship.length
            : this.computer.board.size - 1;
        const MaxY =
          orientation === "vertical"
            ? this.computer.board.size - ship.length
            : this.computer.board.size - 1;

        const x = Math.floor(Math.random() * (MaxX + 1));
        const y = Math.floor(Math.random() * (MaxY + 1));

        if (
          this.canPlaceShip(this.computer.board, ship, { x, y }, orientation)
        ) {
          this.computer.board.placeShip(ship, { x, y }, orientation);
          placed = true;
        }
      }
    });
  }
  private canPlaceShip(
    board: Gameboard,
    ship: Ship,
    coord: ICoordinates,
    orientation: string
  ): boolean {
    const { x, y } = coord;
    const length = ship.length;

    if (orientation == "horizontal") {
      if (x + length > board.size) return false;
      for (let i = 0; i < length; i++) {
        if (board.shipPlacement[y]![x + i] !== null) return false;
      }
    }
    if (orientation == "vertical") {
      if (y + length > board.size) return false;
      for (let i = 0; i < length; i++) {
        if (board.shipPlacement[y + i]![x] !== null) return false;
      }
    }

    return true;
  }
}
