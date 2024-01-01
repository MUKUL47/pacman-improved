import Config from "./config";
import { Game } from "./game";
import { PlayerState, State } from "./state";
import "./style.css";
import { MapCreationAsset, STORAGE } from "./types";
import { Util } from "./utils";

document.addEventListener("DOMContentLoaded", () => {
  const search = window.location.search;
  if (search?.startsWith("?creation")) return;
  if (search?.startsWith("?custom-game")) {
    loadCustomGame();
    return;
  }
  loadStandardGame();
});

function loadCustomGame() {
  try {
    const path = window.location.search.replace("?custom-game&", "");
    if (path.startsWith("config=")) {
      Config.setBlockSize(+path.split("=")[1]);
    }
    const renderblocks = new Map(
      JSON.parse(sessionStorage.getItem(STORAGE.GAME_INSTANCE))
    ) as Map<string, MapCreationAsset>;
    const instance = Util.customGameInstance(
      renderblocks,
      () => {
        window.location.reload();
      },
      3
    );
    pauseControl(instance);
    restartControl(instance);
    instance.start();
  } catch (e) {
    alert("Failed to load custom game");
    loadStandardGame();
  }
}
function pauseControl(instance: Game) {
  Config.window.pause = () => {
    instance.togglePause();
    const wasPaused = Config.window["toggle-pause"].innerHTML === "Pause";
    Config.window["toggle-pause"].innerHTML = wasPaused ? "Resume" : "Pause";
  };
}
function restartControl(instance: Game) {
  Config.window.restart = (isGameover?: boolean) => {
    instance.destroy();
    setTimeout(() => {
      instance = new Game({
        state: isGameover
          ? new State({
              player: new PlayerState({
                lives: instance.state.playerState.lives - 1,
              }),
            })
          : null,
      });
      instance.start();
    }, 500);
  };
}
function loadStandardGame() {
  let instance = new Game();
  instance.start();
  restartControl(instance);
  pauseControl(instance);
}
