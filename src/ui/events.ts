// import { Game } from "../../controllers/GameController.js";
// import { renderBoards } from "./render.js";
// //@ts-ignore
// import hitSoundFile from "/sounds/BangLong.ogg";
// //@ts-ignore
// import missSoundFile from "/sounds/watersplash.ogg";

// const hitSound = new Audio(hitSoundFile);
// const missSound = new Audio(missSoundFile);

// export function registerEvents(game: Game) {
//   const computerBoardDiv = document.getElementById("computer-board");

//   if (!computerBoardDiv) {
//     console.log("Error: #computer-board no existe en el DOM");
//     return;
//   }

//   computerBoardDiv.addEventListener("click", (e) => {
//     const target = e.target as HTMLElement;

//     const cell = target.closest(".enemy") as HTMLElement;
//     if (!cell) return;

//     const x = Number(cell.dataset.x);
//     const y = Number(cell.dataset.y);

//     const status = game.computer.board.attackStatus[y]![x];
//     if (status !== null) return;

//     const result = game.playerAttack({ x, y });

//     if (result === "hit") {
//       hitSound.currentTime = 0; // Reinicia el audio
//       hitSound
//         .play()
//         .catch((err) => console.error("Error playing hit sound:", err));
//       console.log("HIT !!! (sound)");
//     } else {
//       missSound.currentTime = 0; // Reinicia el audio
//       missSound
//         .play()
//         .catch((err) => console.error("Error playing miss sound:", err));
//       console.log("MISS !!! (sound)");
//     }

//     renderBoards(game);

//     if (game.isHumanWinner()) {
//       alert("🏆 ¡Win! All ships are destroyed");
//       return;
//     }
//   });
// }
