import type { Game } from "../controllers/GameController.js";

export function renderPlacementBoard(container: HTMLElement, size = 10) {
  container.innerHTML = "";

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");

      cell.dataset.y = String(y);
      cell.dataset.x = String(x);

      cell.className = "cell";
      container.appendChild(cell);
    }
  }
}

export function paintPlacedShip(
  board: HTMLElement,
  cells: { x: number; y: number }[],

) {
  if (cells.length === 0) return;

  cells.forEach(({ x, y }) => {
    const cell = board.querySelector(
      `[data-y="${y}"][data-x="${x}"]`
    ) as HTMLElement;

    if (cell) {
      cell.classList.add("bg-amber-600");
    }
  });
}
