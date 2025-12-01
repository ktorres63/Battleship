import { Ship } from "../models/Ship.js";

export type CellContent = Ship | null;
interface ICoordinates {
  x: number;
  y: number;
}

export class Gameboard {
  grid: CellContent[][];
  size: number;
  constructor(size: number) {
    if (size <= 0) {
      throw new Error("GameBoard size must be positive.");
    }
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(null));
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
        this.grid[y]![x + i] = ship;
      }
    }
    if (orientation === "vertical") {
      for (let i = 0; i < shipLenght; i++) {
        this.grid[y + i]![x] = ship;
      }
    }
  }
}
