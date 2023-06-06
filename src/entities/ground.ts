import Config from "../config";
import { GroundState, State } from "../state";
import { Coordinate, Entity, EntityInstance } from "../types";

export class Ground implements Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  groundState: GroundState;
  private renderBlocks: Record<
    string,
    Array<Coordinate & { removed?: boolean }>
  > | null = null;
  constructor({ ctx, state }: EntityInstance) {
    this.ctx = ctx;
    this.state = state;
    this.groundState = this.state.groundState;
    this.groundState.initializeDefaults();
    this.renderBlocks = {
      wall1: this.groundState.walls,
      pacman_food: this.groundState.food,
    };
  }
  destroy(): void {}
  draw(): void {
    for (const asset in this.renderBlocks || {}) {
      const coords = this.renderBlocks[asset];
      coords.forEach(({ x, y, removed }) => {
        if (!!removed) return;
        this.ctx.drawImage(
          Config.getAsset(asset),
          x,
          y,
          Config.BLOCK_SIZE,
          Config.BLOCK_SIZE
        );
      });
    }
  }
}
