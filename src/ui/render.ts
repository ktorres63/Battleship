import { Game } from "../controllers/GameController.js";
import type { Gameboard } from "../models/Gameboard.js";
export function renderBoards(game: Game) {
  renderPlayerBoard(game.player.board);
  renderComputerBoard(game.computer.board);
}

function renderPlayerBoard(board:Gameboard) {
  const container = document.getElementById("player-board");
  container!.innerHTML = "";

  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const cellDiv = document.createElement("div");
      cellDiv.className =
        "cell w-10 h-10 border border-gray-500 flex items-center justify-center bg-blue-300";

      const cell = board.shipPlacement[y]![x];
      const attack = board.attackStatus[y]![x]

      //ships
      if(cell !== null){
        cellDiv.classList.add("bg-gray-700")
      }

      //show hit or miss
      if(attack === "hit"){
        cellDiv.classList.add("bg-red-500");
        
      }
      else if(attack =="missed"){
        cellDiv.classList.add("bg-white")
      }
      container?.appendChild(cellDiv)


    }
  }
}

function renderComputerBoard(board:Gameboard) {
  const container = document.getElementById("computer-board");
  container!.innerHTML = "";

  for (let y = 0; y < board.size; y++) {
    for (let x = 0; x < board.size; x++) {
      const cellDiv = document.createElement("div");

      cellDiv.className =
        "cell enemy w-10 h-10 border border-gray-500 bg-blue-200 hover:bg-blue-300 cursor-pointer flex items-center justify-center";

      cellDiv.dataset.x = x.toString();
      cellDiv.dataset.y = y.toString();

      const attack = board.attackStatus[y]![x];

      // Mostrar hit/miss sin revelar barcos
      if (attack === "hit") {
        cellDiv.classList.add("bg-red-500");
        cellDiv.innerHTML = `<img src="./src/ui/assets/sprites/explosion.gif" class="w-full h-full object-cover" />`;
        
      } else if (attack === "missed") {
        cellDiv.classList.add("bg-white");
      }

      container?.appendChild(cellDiv);
    }
  }
}
