import { Gameboard } from "./Gameboard.js";
interface ICoordinates {
  x: number;
  y: number;
}
export class Player {
  type: string;
  board: Gameboard;
  availableMoves: ICoordinates[] = [];

  constructor(type: string) {
    this.type = type;
    this.board = new Gameboard(10);
    this.generateAllMoves();
  }
  generateAllMoves(): void {
    for (let y = 0; y < this.board.size; y++) {
      for (let x = 0; x < this.board.size; x++) {
        this.availableMoves.push({ x, y });
      }
    }
  }

  attack(enemyBoard: Gameboard, coord: ICoordinates) {
    return enemyBoard.receiveAttack(coord);
  }
  randomAttack(enemyBoard: Gameboard) {
    if (this.availableMoves.length === 0) return null;

    const index = Math.floor(Math.random() * this.availableMoves.length);
    const removed = this.availableMoves.splice(index, 1);

    const coord = removed[0];
    if (!coord) throw new Error("Unexpected: coord was undefined");

    enemyBoard.receiveAttack(coord);
    return coord;
  }
}
