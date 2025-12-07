import { describe, expect, it, beforeEach, vi } from "vitest";
import { Gameboard,  } from "../../models/Gameboard.js";
import { Ship } from "../../models/Ship.js";

const ShipMock = vi.fn().mockImplementation((length) => ({
  length,
  hits: 0,
  hit: vi.fn(() => ({})),
  isSunk: vi.fn(() => false),
}));

describe("Gameboard", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard(10);
  });

  it("should create a gameboard with 10x10 grid", () => {
    expect(gameboard.shipPlacement.length).toBe(10);
    gameboard.shipPlacement.forEach(row => {
      expect(row).toBeDefined();
      expect(row.length).toBe(10)
    })
    
    expect(gameboard.shipPlacement[5]![5]!).toBeNull()
  });

  it("should be able to place a Ship at specific coordinates(horizontal)", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, { x: 0, y: 0 }, "horizontal");

    expect(gameboard.shipPlacement[0]![0]).toBe(ship);
    expect(gameboard.shipPlacement[0]![1]).toBe(ship);
    expect(gameboard.shipPlacement[0]![2]).toBe(ship);
    expect(gameboard.shipPlacement[0]![3]).toBeNull(); 
  });
  it("should be able to place a Ship at specific coordinates(vertical)", () => {
    const ship = new Ship(4);

    gameboard.placeShip(ship, { x: 5, y: 5 }, "vertical");

    expect(gameboard.shipPlacement[5]![5]).toBe(ship);
    expect(gameboard.shipPlacement[6]![5]).toBe(ship);
    expect(gameboard.shipPlacement[7]![5]).toBe(ship);
    expect(gameboard.shipPlacement[8]![5]).toBe(ship);
    expect(gameboard.shipPlacement[9]![5]).toBeNull();
  });
  it("should prevent placing ships that go out of bounds", () => {
    const ship = new Ship(3);

    expect(() =>
      gameboard.placeShip(ship, { x: 0, y: 8 }, "vertical")
    ).toThrow("Placement out of bounds");

    expect(() => gameboard.placeShip(ship, { x: 9, y: 0 }, "horizontal")).toThrow(
      "Placement out of bounds"
    );
  });
  it("should call the hit() function on the correct Ship object when attacked", () => {
    const shipMockInstance = ShipMock(3);
    gameboard.placeShip(
      shipMockInstance as unknown as Ship,
      { x: 2, y: 1 },
      "horizontal"
    );
    gameboard.receiveAttack({ x: 2, y: 1 });
    expect(shipMockInstance.hit).toHaveBeenCalledTimes(1);
  });
  it("should record missed attacks", () => {
    const coordMiss = { x: 0, y: 0 };

    gameboard.receiveAttack(coordMiss);
    expect(gameboard.missedAttacks).toContainEqual(coordMiss);
  });
  it("should return 'miss' for a missed attack or 'hit' for a successful attack", () => {
    const coordMiss = { x: 0, y: 0 };
    const coordSucc = { x: 3, y: 3 };

    const ship = new Ship(3);
    gameboard.placeShip(ship, { x: 3, y: 3 }, "horizontal");

    expect(gameboard.receiveAttack(coordMiss)).toBe("miss");
    expect(gameboard.receiveAttack(coordSucc)).toBe("hit");
  });

  it("should throw an error or handle attacks on already attacked spots", () => {
    const coords = { x: 3, y: 5 };
    gameboard.receiveAttack(coords);
    expect(() => gameboard.receiveAttack(coords)).toThrow(
      "Spot already attacked"
    );
  });

  // Game Status

  it("should report that not all ships are sunk when some are afloat", () => {
    const ship1 = new Ship(1);
    const ship2 = new Ship(2);

    gameboard.placeShip(ship1, { x: 0, y: 0 }, "horizontal");
    gameboard.placeShip(ship2, { x: 5, y: 5 }, "horizontal");

    expect(gameboard.allShipsSunk()).toBe(false);
    ship1.hit();
    expect(gameboard.allShipsSunk()).toBe(false);
  });

  it("should report that all ships are sunk when every ship is sunk", () => {
    const ship1 = new Ship(1);
    const ship2 = new Ship(2);

    gameboard.placeShip(ship1, { x: 0, y: 0 }, "horizontal");
    gameboard.placeShip(ship2, { x: 5, y: 5 }, "horizontal");

    expect(gameboard.allShipsSunk()).toBe(false);
    ship1.hit();
    expect(gameboard.allShipsSunk()).toBe(false);
    ship2.hit();
    ship2.hit();
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
