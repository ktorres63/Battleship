import { describe, expect, it, beforeEach, vi } from "vitest";
import { Gameboard } from "../../models/Gameboard.js";
import { Ship } from "../../models/Ship.js";
import { Player } from "../../models/Player.js";
import { Game } from "../../controllers/GameController.js";

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
    game.start();
  });
  it("should place computer ships on start", () => {
    const computerBoard = game.computer.board;

    expect(computerBoard.ships.length).toBeGreaterThan(0);

    computerBoard.ships.forEach((ship) => {
      const found = computerBoard.shipPlacement.flat().includes(ship);
      expect(found).toBe(true);
    });
  });

  it("should allow player to hit a computer ship", () => {
    const computerBoard = game.computer.board;
    const ship = new Ship(2);
    computerBoard.placeShip(ship, { x: 1, y: 1 }, "horizontal");

    const hitSpy = vi.spyOn(ship, "hit");

    const result = game.playerAttack({ x: 1, y: 1 });

    expect(result).toBe("hit");
    expect(hitSpy).toHaveBeenCalled();
  });
  it("should trigger computer attack after player attack", () => {
    const playerBoard = game.player.board;
    const computerAttackSpy = vi.spyOn(game, "computerAttack");
    const attackCoord = { x: 0, y: 0 };

    game.playerAttack(attackCoord);
    expect(computerAttackSpy).toHaveBeenCalledTimes(1);

    const totalAttacks = playerBoard.attackStatus
      .flat()
      .filter((c) => c !== null).length;

    expect(totalAttacks).toBe(1);
  });

  it("should detect when human wins", () => {
    const computerBoard = game.computer.board;

    expect(game.isHumanWinner()).toBe(false);

    const shipCells = [];

    for (let y = 0; y < computerBoard.size; y++) {
      for (let x = 0; x < computerBoard.size; x++) {
        if (computerBoard.shipPlacement[y]![x] != null) {
          shipCells.push({ x, y });
        }
      }
    }

    shipCells.forEach((cell) => {
      game.playerAttack(cell);
    });

    expect(computerBoard.allShipsSunk()).toBe(true);
    expect(game.isHumanWinner()).toBe(true);
  });
});
