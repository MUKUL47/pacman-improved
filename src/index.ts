import Config from "./config";
import { Ghost, Ground, Player } from "./entities";
import { PlayerState, State } from "./state";
import "./style.css";
import { Entity } from "./types";
class Game extends Config {
  private ctx: CanvasRenderingContext2D;
  private entities: Entity[] = [];
  private renderId: number;
  public state: State;
  private paused = false;
  constructor(state?: State) {
    super();
    this.ctx = document.querySelector("canvas").getContext("2d");
    this.state = state || new State({});
  }
  public start = async () => {
    await this.preloadAssets();
    this.entities = [
      new Ground({ ctx: this.ctx, state: this.state }),
      new Player({ ctx: this.ctx, state: this.state }),
      new Ghost({ ctx: this.ctx, state: this.state }),
    ];
    this.renderId = window.requestAnimationFrame(() => this.render());
  };
  private render() {
    if (this.paused) return;
    this.ctx.clearRect(
      0,
      0,
      Config.CANVAS_SIZE.width,
      Config.CANVAS_SIZE.height
    );
    for (const e of this.entities) {
      e.draw?.();
    }
    this.renderId = window.requestAnimationFrame(() => this.render());
  }
  public destroy() {
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
let _window: any = window;
let instance = new Game();
instance.start();
_window.restart = (isGameover?: boolean) => {
  instance.destroy();
  instance = new Game(
    isGameover
      ? new State({
          player: new PlayerState({
            lives: instance.state.playerState.lives - 1,
          }),
        })
      : null
  );
  instance.start();
};
_window.pause = () => {
  instance.togglePause();
  const wasPaused = _window["toggle-pause"].innerHTML === "Pause";
  _window["toggle-pause"].innerHTML = wasPaused ? "Resume" : "Pause";
};
