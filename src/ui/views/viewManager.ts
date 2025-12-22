import { PlacementView } from "./placement.view.js";
import { BattleView } from "./battle.view.js";
import type { Game } from "../../controllers/GameController.js";

export class ViewManager {
  game: Game;
  placementView: PlacementView;
  battleView: BattleView;

  constructor(game: Game) {
    this.game = game;
    this.placementView = new PlacementView(game, this);
    this.battleView = new BattleView(game, this);
  }

  start() {
    this.placementView.init();
    this.battleView.init();

    this.showPlacementView();
    // this.showBattleView();
  }
  showPlacementView() {
    this.battleView.hide();
    this.placementView.show();
  }
  showBattleView() {
    this.placementView.hide();
    this.battleView.show();
  }
}
