import type { Game } from "../../controllers/GameController.js";
import { renderPlacementBoard } from "../render.js";
import { setupPlacementEvents, getAllPlacedShips } from "../events.js";
import type { ViewManager } from "./viewManager.js";

export class PlacementView {
  game: Game;
  viewManager: ViewManager;
  element: HTMLElement | null = null;
  confirmBtn: HTMLElement | null = null;

  constructor(game: Game, viewManager: ViewManager) {
    this.game = game;
    this.viewManager = viewManager;
  }
  init() {
    this.element = document.getElementById("placement-view");
    this.confirmBtn = document.getElementById("confirm-placement");

    const board = document.getElementById("player-draggable-board")!;
    const shipsContainer = document.getElementById("ships-container")!;

    renderPlacementBoard(board);
    setupPlacementEvents(this.game, board, shipsContainer);

    this.confirmBtn?.addEventListener("click", () => {
      const placedShips = getAllPlacedShips();

      if (placedShips.size !== 5) {
        alert(
          `You must place all 5 ships. You have ${placedShips.size} placed.`
        );
        return;
      }

      this.viewManager.showBattleView();
      this.game.start();
    });
  }
  show() {
    this.element?.classList.remove("hidden");
  }
  hide() {
    this.element?.classList.add("hidden");
  }
}
