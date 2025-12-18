import type { Game } from "../../controllers/GameController.js";
import type { ViewManager } from "./viewManager.js";

export class BattleView {
  game: Game;
  viewManager: ViewManager;
  element: HTMLElement | null = null;
  playerBoardEl: HTMLElement | null = null;
  computerBoardEl: HTMLElement | null = null;

  constructor(game: Game, viewManager: ViewManager) {
    this.game = game;
    this.viewManager = viewManager;
  }

  init() {
    this.element = document.getElementById("battle-view");
    this.playerBoardEl = document.getElementById("player-board");
    this.computerBoardEl = document.getElementById("computer-board");

    // Renderizar tableros iniciales
    this.renderBoards();

    // Configurar eventos de ataque en el tablero del computador
    this.setupComputerBoardEvents();
  }

  renderBoards() {
    if (!this.playerBoardEl || !this.computerBoardEl) return;

    // Renderizar tablero del jugador (con barcos visibles)
    this.renderPlayerBoard();

    // Renderizar tablero del computador (sin barcos visibles)
    this.renderComputerBoard();
  }

  renderPlayerBoard() {
    if (!this.playerBoardEl) return;

    this.playerBoardEl.innerHTML = "";

    for (let y = 0; y < this.game.player.board.size; y++) {
      for (let x = 0; x < this.game.player.board.size; x++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);

        // Mostrar barcos del jugador
        const ship = this.game.player.board.shipPlacement[y]?.[x];
        if (ship) {
          cell.classList.add("bg-amber-600", "border-amber-700");
        }

        // Mostrar ataques recibidos
        const attackStatus = this.game.player.board.attackStatus[y]?.[x];
        if (attackStatus === "hit") {
          cell.classList.add("bg-red-600", "border-red-700");
          cell.innerHTML = '<span class="text-white font-bold">X</span>';
        } else if (attackStatus === "missed") {
          cell.classList.add("bg-gray-600", "border-gray-700");
          cell.innerHTML = '<span class="text-white">•</span>';
        }

        this.playerBoardEl.appendChild(cell);
      }
    }
  }

  renderComputerBoard() {
    if (!this.computerBoardEl) return;

    this.computerBoardEl.innerHTML = "";

    for (let y = 0; y < this.game.computer.board.size; y++) {
      for (let x = 0; x < this.game.computer.board.size; x++) {
        const cell = document.createElement("div");
        cell.className = "cell cursor-pointer hover:bg-red-700";
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);

        // NO mostramos los barcos del computador (están ocultos)
        // Solo mostramos los ataques que hemos hecho

        const attackStatus = this.game.computer.board.attackStatus[y]?.[x];
        if (attackStatus === "hit") {
          cell.classList.add("bg-red-600", "border-red-700");
          cell.classList.remove("hover:bg-red-700");
          cell.innerHTML = '<span class="text-white font-bold">X</span>';
        } else if (attackStatus === "missed") {
          cell.classList.add("bg-gray-600", "border-gray-700");
          cell.classList.remove("hover:bg-red-700");
          cell.innerHTML = '<span class="text-white">•</span>';
        }

        this.computerBoardEl.appendChild(cell);
      }
    }
  }

  setupComputerBoardEvents() {
    if (!this.computerBoardEl) return;

    this.computerBoardEl.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cell = target.closest(".cell") as HTMLElement;

      if (!cell) return;

      const x = parseInt(cell.dataset.x || "0");
      const y = parseInt(cell.dataset.y || "0");

      // Verificar si ya se atacó esa celda
      if (this.game.computer.board.attackStatus[y]?.[x] !== null) {
        console.log("Ya atacaste esa posición");
        return;
      }

      try {
        // Realizar el ataque
        const result = this.game.playerAttack({ x, y });

        console.log(`Ataque en (${x}, ${y}): ${result}`);

        // Re-renderizar ambos tableros
        this.renderBoards();

        // Verificar estado del juego
        this.checkGameStatus();
      } catch (error) {
        console.error("Error al atacar:", error);
      }
    });
  }

  checkGameStatus() {
    const status = this.game.getGameStatus();

    if (status === "human_wins") {
      setTimeout(() => {
        alert("🎉 ¡Ganaste! Has hundido todos los barcos enemigos.");
      }, 100);
    } else if (status === "computer_wins") {
      setTimeout(() => {
        alert("💥 Perdiste. El computador hundió todos tus barcos.");
      }, 100);
    } else if (status === "draw") {
      setTimeout(() => {
        alert("🤝 Empate. Ambos perdieron todos sus barcos.");
      }, 100);
    }
  }

  show() {
    this.element?.classList.remove("hidden");
    // Re-renderizar cuando se muestra la vista
    this.renderBoards();
  }

  hide() {
    this.element?.classList.add("hidden");
  }
}