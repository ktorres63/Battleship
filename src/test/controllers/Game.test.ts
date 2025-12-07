import { describe, expect, it, beforeEach, vi } from "vitest";
import { Gameboard } from "../../models/Gameboard.js";
import { Ship } from "../../models/Ship.js";
import { Player } from "../../models/Player.js";
import { Game } from "../../controllers/Game.js";

/*
should place computer ships on start
should allow player to hit a computer ship
should trigger computer attack after player attack
should detect when human wins
should detect when computer wins
*/
describe("Game", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });
  it("should place computer ships on start", () => {
    game.start();
    const computerBoard = game.computer.board;

    expect(computerBoard.ships.length).toBeGreaterThan(0);

    computerBoard.ships.forEach((ship) => {
      const found = computerBoard.shipPlacement.flat().includes(ship);
      expect(found).toBe(true);
    });
  });

  it("should allow player to hit a computer ship", () => {


  });
  // it("should trigger computer attack after player attack", () => {
  //   game.start();
  // });
  // it("should detect when human wins", () => {
  //   game.start();
  // });
});
