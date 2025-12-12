// @ts-ignore
import "./ui/styles/styles.css";
import { Game } from "./controllers/GameController.js";
import { ViewManager } from "./ui/views/viewManager.js";
import { PlacementView } from "./ui/views/placement.view.js";
import { BattleView } from "./ui/views/battle.view.js";

const appRoot = document.getElementById("app");
if (!appRoot) throw new Error("Root #app not found");

const game = new Game();

const viewManager = new ViewManager(game);

viewManager.start();

