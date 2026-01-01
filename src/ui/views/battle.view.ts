import type { Game } from "../../controllers/GameController.js";
import type { ViewManager } from "./viewManager.js";

export class BattleView {
  game: Game;
  viewManager: ViewManager;
  element: HTMLElement | null = null;
  playerBoardEl: HTMLElement | null = null;
  computerBoardEl: HTMLElement | null = null;

  //sounds
  private hitSound: HTMLAudioElement;
  private missSound: HTMLAudioElement;
  private soundsLoaded: boolean = false;

  constructor(game: Game, viewManager: ViewManager) {
    this.game = game;
    this.viewManager = viewManager;

    this.hitSound = new Audio("/sounds/BangLong.ogg");
    this.missSound = new Audio("/sounds/watersplash.ogg");

    [this.hitSound, this.missSound].forEach((audio) => {
      audio.preload = "auto";
      audio.volume = 1.0;
    });
  }

  private unlockSounds() {
    if (this.soundsLoaded) return;

    [this.hitSound, this.missSound].forEach((audio) => {
      audio.muted = true;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {});
    });

    this.soundsLoaded = true;
    console.log("🔓 unlock audio");
  }

  private playSound(audio: HTMLAudioElement) {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn("block audio :", err);
    });
  }

  init() {
    this.element = document.getElementById("battle-view");
    this.playerBoardEl = document.getElementById("player-board");
    this.computerBoardEl = document.getElementById("computer-board");

    this.renderBoards();

    this.setupComputerBoardEvents();
  }

  renderBoards() {
    if (!this.playerBoardEl || !this.computerBoardEl) return;

    this.renderPlayerBoard();

    this.renderComputerBoard();
  }

  renderPlayerBoard() {
    if (!this.playerBoardEl) return;

    this.playerBoardEl.innerHTML = "";

    for (let y = 0; y < this.game.player.board.size; y++) {
      for (let x = 0; x < this.game.player.board.size; x++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.classList.add("bg-blue-800", "border", "border-blue-600");
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
          cell.classList.remove("bg-amber-600", "border-amber-700");
          cell.classList.add("bg-red-600", "border-red-700");

          cell.innerHTML = '<span class="text-white font-bold">X</span>';
        } else if (attackStatus === "missed") {
          cell.classList.add("bg-gray-600", "border-gray-700");
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
        cell.classList.add("bg-blue-800", "border", "border-blue-600");

        cell.dataset.x = String(x);
        cell.dataset.y = String(y);

        const attackStatus = this.game.computer.board.attackStatus[y]?.[x];
        if (attackStatus === "hit") {
          cell.classList.add("bg-red-600", "border-red-700");
          cell.classList.remove("hover:bg-red-700");
        } else if (attackStatus === "missed") {
          cell.classList.add("bg-gray-600", "border-gray-700");
          cell.classList.remove("hover:bg-red-700");
        }

        this.computerBoardEl.appendChild(cell);
      }
    }
  }

  setupComputerBoardEvents() {
    if (!this.computerBoardEl) return;

    this.computerBoardEl.addEventListener("click", (e: MouseEvent) => {
      this.unlockSounds;

      const target = e.target as HTMLElement;
      const cell = target.closest(".cell") as HTMLElement;

      if (!cell || !this.computerBoardEl?.contains(cell)) return;

      const x = parseInt(cell.dataset.x || "0");
      const y = parseInt(cell.dataset.y || "0");

      // Verificar si ya se atacó esa celda
      if (this.game.computer.board.attackStatus[y]?.[x] !== null) {
        console.log("Cell already attacked");
        return;
      }

      try {
        // Realizar el ataque
        const result = this.game.playerAttack({ x, y });

        console.log(`Ataque en (${x}, ${y}): ${result}`);

        if (result === "hit") {
          this.playSound(this.hitSound);
        } else if (result === "miss") {
          this.playSound(this.missSound);
        }

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
        alert("🎉 Victory! You've destroyed the enemy fleet.");
      }, 100);
    } else if (status === "computer_wins") {
      setTimeout(() => {
        alert("💥 You've been defeated! The computer sank all of your ships.");
      }, 100);
    } else if (status === "draw") {
      setTimeout(() => {
        alert("🤝 It's a tie! Both fleets have been destroyed.");
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
