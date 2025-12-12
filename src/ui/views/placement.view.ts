import type { Game } from "../../controllers/GameController.js";
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


    this.confirmBtn?.addEventListener("click", () => {
      //Validacion de barcos colocados
      //...

      this.viewManager.showBattleView();
      this.game.start();
    })
  }

  show(){
    this.element?.classList.remove("hidden")
  }
  hide(){
    this.element?.classList.add("hidden")

  }
}
