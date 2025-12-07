import { describe, expect, it, vi } from "vitest";
import { Gameboard } from "../../models/Gameboard.js";
import { Player } from "../../models/Player.js";

describe("Player", () => {
  it("should have its own gameboard", () => {
    const player = new Player("human");
    expect(player.board).toBeInstanceOf(Gameboard);
  });
  it("human player can attack enemy board", () => {
    const player = new Player("human");
    const enemy = new Player("computer");

    const spy = vi.spyOn(enemy.board, "receiveAttack");

    const coord = { x: 2, y: 3 };
    player.attack(enemy.board, coord);
    expect(spy).toHaveBeenCalledWith(coord);
    spy.mockRestore();
  });
  it("computer player makes a random valid move", () => {
    const computer = new Player("computer");
    const enemy = new Player("human");

    const spy = vi.spyOn(enemy.board, "receiveAttack");
    computer.randomAttack(enemy.board);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("computer should not repeat random moves", () => {
    const computer = new Player("computer");
    const enemy = new Player("human");

    const attacked = new Set<string>();
    const attempts = 50;

    for (let i = 0; i < attempts; i++) {
      const spy = vi.spyOn(enemy.board, "receiveAttack");
      computer.randomAttack(enemy.board);

      const lastCall = spy.mock.calls.at(-1);
      expect(lastCall).toBeDefined();

      const [coord] = lastCall!;

      const key = `${coord.x},${coord.y}`;

      expect(attacked.has(key)).toBe(false);
      attacked.add(key);
      spy.mockRestore();
    }
  });

  it("attack should return the value from reciveAttack", () => {
    const player = new Player("human");
    const enemy = new Player("computer");
    const coords = { x: 0, y: 0 };

    const spy = vi.spyOn(enemy.board, "receiveAttack").mockReturnValue("hit");
    const result = player.attack(enemy.board, coords);

    expect(result).toBe("hit");
    expect(spy).toHaveBeenCalledWith(coords);
    spy.mockRestore();
  });
});
