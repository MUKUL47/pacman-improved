import Config from "./config";
import { Ground, Player, Ghost } from "./entities";
import { State } from "./state";
import { Entity } from "./types";
class Game extends Config {
  private ctx: CanvasRenderingContext2D;
  private entities: Entity[] = [];
  private renderId: number;
  private state: State;
  constructor() {
    super();
    this.ctx = document.querySelector("canvas").getContext("2d");
    this.state = new State();
    this.preloadAssets().then(this._init);
  }
  private _init = () => {
    this.entities = [
      new Ground({ ctx: this.ctx, state: this.state }),
      new Player({ ctx: this.ctx, state: this.state }),
      new Ghost({ ctx: this.ctx, state: this.state }),
    ];
    this.renderId = window.requestAnimationFrame(() => this.render());
  };
  private render() {
    this.ctx.clearRect(0, 0, Config.CANVAS_SIZE, Config.CANVAS_SIZE);
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
}
new Game();
