import type { Game } from "../../controllers/GameController.js";
import type { ViewManager } from "./viewManager.js";

export class BattleView {
  game: Game;
  viewManager: ViewManager;
  element: HTMLElement | null = null;
  newGameBtn: HTMLElement | null = null;

  constructor(game: Game, viewManager: ViewManager) {
    this.game = game;
    this.viewManager = viewManager;
    
  }
  init() {
    this.element = document.getElementById("battle-view");
    this.newGameBtn = document.getElementById("new-game");


    this.newGameBtn?.addEventListener("click", () => {
      //Validacion de barcos colocados
      //...

      this.viewManager.showPlacementView();
    })
  }

  show(){
    this.element?.classList.remove("hidden")
  }
  hide(){
    this.element?.classList.add("hidden")

  }
}
