
import { describe, expect, it } from 'vitest';
import { Ship } from '../../models/Ship.js';

describe('Ship', () => {
  it('should create a ship, 0 hits, and no sunk', () => {
    const ship = new Ship(5);
    expect(ship.hits).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });
  it('should increase the number of hits when hit() is called', () => {
    const ship = new Ship(5);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });
  it('should return true for isSunk() if hits >= lenght', () => {
    const ship = new Ship(5);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
  it('Should return false for isSunk() if hits < length', () => {
    const ship = new Ship(5);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

});
