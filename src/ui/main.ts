// @ts-ignore
import "../styles/styles.css";
import { renderBoards } from "./render.js";
import { registerEvents } from "./events.js";
import { Game } from "../controllers/GameController.js";

const game = new Game();
game.start();

renderBoards(game);
registerEvents(game);

export { game };

