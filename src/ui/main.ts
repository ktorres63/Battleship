// @ts-ignore
import "../styles/styles.css";
import { renderBoards } from "./render.js";
import { registerEvents } from "./events.js";
import { Game } from "../controllers/GameController.js";

import { setupPlacementView } from "./placementView.js";
import { setupBattleView } from "./battleView.js";

const game = new Game();

const placementView = document.getElementById("placement-view");
const battleView = document.getElementById("battle-view");

export function showPlacementView() {
  placementView?.classList.remove("hidden");
  battleView?.classList.add("hidden");
  setupPlacementView();
}
export function showBattleView() {
  placementView?.classList.add("hidden");
  battleView?.classList.remove("hidden");
  setupBattleView();
}

showPlacementView();

game.start();

renderBoards(game);
registerEvents(game);

export { game };
