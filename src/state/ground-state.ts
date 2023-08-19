import Config from "../config";
import { Coords, GroundStateProps } from "../types";

export class GroundState {
  private _walls: Coords = [];
  private _food: Coords = [];
  private _score: Coords = [];
  public walkable: Coords = [];
  public wallsMap: Set<string> = new Set();
  public foodMap: Set<string> = new Set();
  public scoreMap: Set<string> = new Set();
  private readonly assetRandomCoord = {
    wall: () => Config.getRand({ max: 8 }) === 8,
    food: () => Config.getRand({ max: 50 }) === 50,
    score: () => Config.getRand({ max: 2 }) === 2,
  };
  private props: GroundStateProps;
  constructor(props?: GroundStateProps) {
    this.props = props;
  }
  public initializeDefaults() {
    const bounds = Math.floor(Config.CANVAS_SIZE.width / Config.BLOCK_SIZE);
    const center = Math.floor(bounds / 2);
    const isCreation = !!this.props;
    for (let i = 0; i < bounds; i++) {
      for (let j = 0; j < bounds; j++) {
        if (
          isCreation
            ? this.props?.pacman?.x === i && this.props?.pacman?.y === j
            : i === center && j === i
        )
          continue;
        const { x, y } = {
          x: i * Config.BLOCK_SIZE,
          y: j * Config.BLOCK_SIZE,
        };
        const coordStr = `${x},${y}`;
        if (
          isCreation
            ? this.props?.walls?.has(coordStr)
            : this.assetRandomCoord.wall()
        ) {
          this._walls.push({ x, y });
          this.wallsMap.add(`${x},${y}`);
        } else if (
          isCreation
            ? this.props?.food?.has(coordStr)
            : this.assetRandomCoord.food()
        ) {
          this._food.push({ x, y });
          this.foodMap.add(`${x},${y}`);
        } else if (
          isCreation
            ? this.props?.score?.has(coordStr)
            : this.assetRandomCoord.food()
        ) {
          this._score.push({ x, y });
          this.scoreMap.add(`${x},${y}`);
        }
      }
    }
  }
  public get walls(): Coords {
    return this._walls;
  }
  public get food(): Coords {
    return this._food;
  }
  public get score(): Coords {
    return this._score;
  }

  public eatFood(idx: number): boolean {
    if (!this._food[idx]) return false;
    this.foodMap.delete(`${this._food[idx].x},${this._food[idx].y}`);
    this._food[idx].removed = true;
    return true;
  }

  public addScore(idx: number): boolean {
    if (!this._score[idx]) return false;
    this.scoreMap.delete(`${this._score[idx].x},${this._score[idx].y}`);
    this._score[idx].removed = true;
    return true;
  }
}
