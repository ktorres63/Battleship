import type { Game } from "../controllers/GameController.js";
import { paintPlacedShip } from "./render.js";
import { Ship } from "../models/Ship.js";

interface Coord {
  x: number;
  y: number;
}

interface PlacedShipData {
  ship: Ship;
  coords: Coord[];
  orientation: "horizontal" | "vertical";
  element: HTMLElement;
}

let currentOrientation: "horizontal" | "vertical" = "horizontal";
let draggedShip: HTMLElement | null = null;
let placedShips: Map<string, PlacedShipData> = new Map();

export function setupPlacementEvents(
  game: Game,
  boardEl: HTMLElement,
  shipsEl: HTMLElement
) {
  // Limpiar el tablero del jugador al iniciar
  game.player.board = new (game.player.board.constructor as any)(10);
  placedShips.clear();

  // Configurar botones de orientación
  const axisXBtn = document.getElementById("axis-x");
  const axisYBtn = document.getElementById("axis-y");

  const updateOrientationButtons = () => {
    axisXBtn?.setAttribute(
      "data-active",
      currentOrientation === "horizontal" ? "true" : "false"
    );

    axisYBtn?.setAttribute(
      "data-active",
      currentOrientation === "vertical" ? "true" : "false"
    );
  };
  updateOrientationButtons();

  axisXBtn?.addEventListener("click", () => {
    currentOrientation = "horizontal";
    updateOrientationButtons();
  });

  axisYBtn?.addEventListener("click", () => {
    currentOrientation = "vertical";
    updateOrientationButtons();
  });

  // Configurar drag & drop para los barcos
  const ships = shipsEl.querySelectorAll(".draggable-ship");

  ships.forEach((ship) => {
    const shipEl = ship as HTMLElement;

    shipEl.setAttribute("draggable", "true");

    shipEl.addEventListener("dragstart", (e: DragEvent) => {
      draggedShip = shipEl;
      shipEl.classList.add("opacity-50");

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
      }
    });

    shipEl.addEventListener("dragend", () => {
      shipEl.classList.remove("opacity-50");
      draggedShip = null;
    });
  });

  // Configurar las celdas del tablero
  const cells = boardEl.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const cellEl = cell as HTMLElement;

    cellEl.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
      }
    });

    cellEl.addEventListener("dragenter", (e: DragEvent) => {
      e.preventDefault();

      if (!draggedShip) return;

      const x = parseInt(cellEl.dataset.x || "0");
      const y = parseInt(cellEl.dataset.y || "0");
      const length = parseInt(draggedShip.dataset.length || "0");

      const coords = calculateShipCoords(x, y, length, currentOrientation);
      const canPlace = checkIfCanPlace(coords, boardEl);

      highlightCells(boardEl, coords, canPlace);
    });

    cellEl.addEventListener("dragleave", (e: DragEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (!relatedTarget || !cellEl.contains(relatedTarget)) {
        clearHighlight(boardEl);
      }
    });

    cellEl.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      clearHighlight(boardEl);

      if (!draggedShip) return;

      const x = parseInt(cellEl.dataset.x || "0");
      const y = parseInt(cellEl.dataset.y || "0");
      const length = parseInt(draggedShip.dataset.length || "0");
      const shipName = draggedShip.dataset.ship || "";

      const coords = calculateShipCoords(x, y, length, currentOrientation);

      if (checkIfCanPlace(coords, boardEl)) {
        placeShipOnBoard(
          game,
          draggedShip,
          coords,
          shipName,
          currentOrientation,
          boardEl,
          shipsEl
        );
      }
    });
  });

  // Permitir remover barcos haciendo click derecho
  boardEl.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    if (!target.classList.contains("cell")) return;

    const x = parseInt(target.dataset.x || "0");
    const y = parseInt(target.dataset.y || "0");

    removeShipAt(game, x, y, boardEl, shipsEl);
  });
}

function calculateShipCoords(
  x: number,
  y: number,
  length: number,
  orientation: "horizontal" | "vertical"
): Coord[] {
  const coords: Coord[] = [];

  for (let i = 0; i < length; i++) {
    if (orientation === "horizontal") {
      coords.push({ x: x + i, y });
    } else {
      coords.push({ x, y: y + i });
    }
  }

  return coords;
}

function checkIfCanPlace(coords: Coord[], boardEl: HTMLElement): boolean {
  // Verify limits on board
  for (const coord of coords) {
    if (coord.x < 0 || coord.x >= 10 || coord.y < 0 || coord.y >= 10) {
      return false;
    }
  }

  // Verify collisions
  for (const coord of coords) {
    const cell = boardEl.querySelector(
      `[data-y="${coord.y}"][data-x="${coord.x}"]`
    ) as HTMLElement;

    if (cell && cell.classList.contains("bg-amber-600")) {
      return false;
    }
  }

  return true;
}

function highlightCells(
  boardEl: HTMLElement,
  coords: Coord[],
  canPlace: boolean
) {
  clearHighlight(boardEl);

  coords.forEach((coord) => {
    const cell = boardEl.querySelector(
      `[data-y="${coord.y}"][data-x="${coord.x}"]`
    ) as HTMLElement;

    if (cell) {
      if (canPlace) {
        cell.classList.add("bg-green-500", "bg-opacity-50");
      } else {
        cell.classList.add("bg-red-500", "bg-opacity-50");
      }
    }
  });
}

function clearHighlight(boardEl: HTMLElement) {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("bg-green-500", "bg-red-500", "bg-opacity-50");
  });
}

function placeShipOnBoard(
  game: Game,
  shipEl: HTMLElement,
  coords: Coord[],
  shipName: string,
  orientation: "horizontal" | "vertical",
  boardEl: HTMLElement,
  shipsEl: HTMLElement
) {
  const length = coords.length;
  const ship = new Ship(length, shipName);

  try {
    game.player.board.placeShip(ship, coords[0]!, orientation);
    paintPlacedShip(boardEl, coords);

    placedShips.set(shipName, { ship, coords, orientation, element: shipEl });

    shipEl.remove();

    console.log("Ship placed:", shipName);
  } catch (error) {
    console.error("Error:", error);
    alert("Ship cannot be placed here");
  }
}

function removeShipAt(
  game: Game,
  x: number,
  y: number,
  boardEl: HTMLElement,
  shipsEl: HTMLElement
) {
  for (const [shipName, data] of placedShips.entries()) {
    const isInCoords = data.coords.some(
      (coord) => coord.x === x && coord.y === y
    );

    if (isInCoords) {
      data.coords.forEach((coord) => {
        const cell = boardEl.querySelector(
          `[data-y="${coord.y}"][data-x="${coord.x}"]`
        ) as HTMLElement;

        if (cell) {
          cell.classList.remove("bg-amber-600");
        }
      });

      // Devolver el barco al contenedor
      shipsEl.appendChild(data.element);

      // Remover del mapa
      placedShips.delete(shipName);

      // IMPORTANTE: Reconstruir el tablero del jugador desde cero
      rebuildPlayerBoard(game, boardEl);

      console.log("Barco removido:", shipName);
      console.log("Barcos restantes:", game.player.board.ships.length);

      break;
    }
  }
}

function rebuildPlayerBoard(game: Game, boardEl: HTMLElement) {
  // Crear un nuevo tablero limpio
  game.player.board = new (game.player.board.constructor as any)(10);

  // Re-colocar todos los barcos que siguen en placedShips
  for (const [shipName, data] of placedShips.entries()) {
    try {
      game.player.board.placeShip(data.ship, data.coords[0]!, data.orientation);
    } catch (error) {
      console.error(`Error al reconstruir barco ${shipName}:`, error);
    }
  }

  console.log(
    "Tablero reconstruido. Barcos totales:",
    game.player.board.ships.length
  );
}

export function getAllPlacedShips() {
  return placedShips;
}

export function resetPlacement() {
  placedShips.clear();
  currentOrientation = "horizontal";
}
