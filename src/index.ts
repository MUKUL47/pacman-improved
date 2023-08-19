import Config from "./config";
import { Ghost, Ground, Player } from "./entities";
import { PlayerState, State } from "./state";
import "./style.css";
import { Entity } from "./types";
type GameProps = {
  state?: State;
  onGameover?: () => any;
};
export class Game extends Config {
  private ctx: CanvasRenderingContext2D;
  private entities: Entity[] = [];
  private renderId: number;
  public state: State;
  private paused = false;
  private gameover = false;
  private onGameOver?: () => {};
  constructor(gameProps?: GameProps) {
    super();
    this.ctx = document.querySelector("canvas").getContext("2d");
    this.state = gameProps?.state || new State({});
    this.onGameOver = gameProps?.onGameover;
  }
  public start = async () => {
    await this.preloadAssets();
    this.entities = [
      new Ground({ ctx: this.ctx, state: this.state }),
      new Player({ ctx: this.ctx, state: this.state }),
      new Ghost({ ctx: this.ctx, state: this.state }),
    ];
    this.renderId = window.requestAnimationFrame(() => this.render());
    this.state.registerGameover(() => {
      this.onGameOver?.apply(null);
      this.destroy();
      this.ctx.font = "50px Sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        "Game Over !!!",
        Math.floor(Config.CANVAS_SIZE.width / 2) - 150,
        Config.CANVAS_SIZE.height / 2
      );
    });
  };
  private clearRect() {
    this.ctx.clearRect(
      0,
      0,
      Config.CANVAS_SIZE.width,
      Config.CANVAS_SIZE.height
    );
  }
  private render() {
    if (this.paused || this.gameover) return;
    this.clearRect();
    for (const e of this.entities) {
      e.draw?.();
    }
    this.renderId = window.requestAnimationFrame(() => this.render());
  }
  public destroy() {
    this.gameover = true;
    window.cancelAnimationFrame(this.renderId);
    for (const e of this.entities) {
      e.destroy?.();
    }
  }
  public togglePause() {
    this.paused = !this.paused;
    if (!this.paused) this.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.search?.startsWith("?creation")) return;
  let _window = Config.window;
  let instance = new Game();
  instance.start();
  _window.restart = (isGameover?: boolean) => {
    instance.destroy();
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
  };
  _window.pause = () => {
    instance.togglePause();
    const wasPaused = _window["toggle-pause"].innerHTML === "Pause";
    _window["toggle-pause"].innerHTML = wasPaused ? "Resume" : "Pause";
  };
});
