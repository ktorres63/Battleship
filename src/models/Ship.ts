export interface IShip {
  name: string
  length: number;
  hits: number;
  hit(): void;
  isSunk(): boolean;
}

export class Ship implements IShip {
  hits: number;
  length: number;
  name: string

  constructor(length: number, name:string = "ship") {
    if (length <= 0) {
      throw new Error("Ship length must be positive.");
    }
    this.length = length;
    this.hits = 0;
    this.name = name
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