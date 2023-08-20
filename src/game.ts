import Config from "./config";
import { Ghost, Ground, Player } from "./entities";
import { State } from "./state";
import "./style.css";
import { Entity, GameProps } from "./types";

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
