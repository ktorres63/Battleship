export interface IShip {
  length: number;
  hits: number;
  hit(): void;
  isSunk(): boolean;
}

export class Ship implements IShip {
  hits: number;
  length: number;

  constructor(length: number) {
    if (length <= 0) {
      throw new Error("Ship length must be positive.");
    }
    this.length = length;
    this.hits = 0;
  }
  hit(): void {
    if (!this.isSunk()) {
      this.hits++;
    }
  }
  isSunk(): boolean {
    return this.hits >= this.length;
  }
}