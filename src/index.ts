import Config from "./config";
import { Ground, Player, Ghost } from "./entities";
import MapCreation from "./map-creation";
import { State } from "./state";
import { Entity } from "./types";
import "./style.css";
class Game extends Config {
  private ctx: CanvasRenderingContext2D;
  private entities: Entity[] = [];
  private renderId: number;
  private state: State;
  constructor() {
    super();
    this.ctx = document.querySelector("canvas").getContext("2d");
    this.state = new State();
  }
  public start = async () => {
    await this.preloadAssets();
    this.entities = [
      new Ground({ ctx: this.ctx, state: this.state }),
      // new Player({ ctx: this.ctx, state: this.state }),
      // new Ghost({ ctx: this.ctx, state: this.state }),
    ];
    this.renderId = window.requestAnimationFrame(() => this.render());
  };
  private render() {
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
}
new Game().start();
