import Config from "../config";
import { Coordinate } from "../types";
export class GroundState {
  private _walls: Array<Coordinate & { removed?: boolean }> = [];
  private _food: Array<Coordinate & { removed?: boolean }> = [];
  public wallsMap: Set<string> = new Set();
  public foodMap: Set<string> = new Set();

  public initializeDefaults() {
    const bounds = Math.floor(Config.CANVAS_SIZE / Config.BLOCK_SIZE);
    for (let i = 0; i < bounds; i++) {
      for (let j = 0; j < bounds; j++) {
        if (i === i && i === 0) continue;
        const { x, y } = {
          x: i * Config.BLOCK_SIZE,
          y: j * Config.BLOCK_SIZE,
        };
        if (Config.getRand({ max: 8 }) === 8) {
          this._walls.push({ x, y });
          this.wallsMap.add(`${x},${y}`);
        } else if (Config.getRand({ max: 50 }) === 50) {
          this._food.push({ x, y });
          this.foodMap.add(`${x},${y}`);
        }
      }
    }
  }
  public get walls(): Array<Coordinate & { removed?: boolean }> {
    return this._walls;
  }
  public get food(): Array<Coordinate & { removed?: boolean }> {
    return this._food;
  }

  public eatFood(idx: number): boolean {
    if (!this._food[idx]) return false;
    this._food[idx].removed = true;
    return true;
  }
}
