import { Ship } from "../models/Ship.js";

type ShipPlacement = Ship | null;
type AttackStatus = "hit" | "missed" | null;
interface ICoordinates {
  x: number;
  y: number;
}

export class Gameboard {
  shipPlacement: ShipPlacement[][];
  attackStatus: AttackStatus[][];
  ships: Ship[] = [];
  size: number;
  missedAttacks: ICoordinates[] = [];

  constructor(size: number) {
    if (size <= 0) {
      throw new Error("GameBoard size must be positive.");
    }
    this.size = size;
    this.shipPlacement = Array.from({ length: size }, () =>
      Array(size).fill(null)
    );
    this.attackStatus = Array.from({ length: size }, () =>
      Array(size).fill(null)
    );
  }

  placeShip(ship: Ship, coordinates: ICoordinates, orientation: string) {
    const { x, y } = coordinates;
    const shipLenght = ship.length;
    if (orientation == "horizontal") {
      if (x + shipLenght > this.size) {
        throw new Error("Placement out of bounds");
      }
    }
    if (orientation == "vertical") {
      if (y + shipLenght > this.size) {
        throw new Error("Placement out of bounds");
      }
    }
    if (orientation === "horizontal") {
      for (let i = 0; i < shipLenght; i++) {
        this.shipPlacement[y]![x + i] = ship;
      }
    }
    if (orientation === "vertical") {
      for (let i = 0; i < shipLenght; i++) {
        this.shipPlacement[y + i]![x] = ship;
      }
    }

    //Add the ship to Ships Array
    if (!this.ships.includes(ship)) {
      this.ships.push(ship);
    }
  }
  receiveAttack(coordinates: ICoordinates): string {
    const cell = this.shipPlacement[coordinates.y]![coordinates.x];
    const { x, y } = coordinates;

    if (this.attackStatus[coordinates.y]![coordinates.x] !== null) {
      throw new Error("Spot already attacked");
    }

    if (cell == null) {
      this.missedAttacks.push(coordinates);
      this.attackStatus[y]![x] = "missed";
      return "miss";
    }
    if (typeof cell.hit === "function") {
      cell.hit();
      this.attackStatus[y]![x] = "hit";

      return "hit";
    }

    throw new Error("invalid cell state");
  }
  allShipsSunk(): boolean {

    if(this.ships.length == 0){
      return false
    }
    return this.ships.every(ship => ship.isSunk());
  }
}
