import Config from "../../config";
import { AssetType, GhostStateProps } from "../../types";
import Ghost from "./ghost";

export default class GhostState {
  private _ghosts: Ghost[] = [];
  private readonly ghostDefaultDifficulty = {
    "ghost-red": 1,
    "ghost-yellow": 2,
    "ghost-green": 3,
    "ghost-blue": 4,
  } as const;
  static readonly ghostColorMap = {
    1: "red",
    2: "yellow",
    3: "green",
    4: "blue",
  };
  private initialized?: GhostStateProps;
  constructor(ghosts?: GhostStateProps) {
    if (ghosts) {
      this.initialized = ghosts;
      this.customGhosts();
    }
  }

  private customGhosts() {
    for (let ghost in this.initialized) {
      this.initialized[ghost].forEach((coordinate) => {
        this._ghosts.push(
          new Ghost(
            ghost as AssetType,
            coordinate,
            this.ghostDefaultDifficulty[ghost]
          )
        );
      });
    }
  }

  public get ghosts(): Ghost[] {
    return this._ghosts;
  }

  public triggerPanic() {
    this._ghosts.forEach((ghost) => ghost.setPanic(true));
  }

  public respawn(idx: number) {
    const ghost = this._ghosts[idx];
    if (!ghost) return;
    this._ghosts.splice(idx, 1);
    this._ghosts.push(
      new Ghost(ghost.name, ghost.origin, ghost.difficulty).setDifficulty(
        ghost.difficulty
      )
    );
  }

  public initializeDefaults(): void {
    if (this.initialized) {
      this.customGhosts();
      return;
    }
    this._ghosts = [
      new Ghost("ghost-red", { x: 300, y: 0 }).setDifficulty(
        this.ghostDefaultDifficulty["ghost-red"]
      ),
      new Ghost("ghost-yellow", {
        x: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        y: 0,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-yellow"]),
      new Ghost("ghost-green", {
        x: 0,
        y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-green"]),
      new Ghost("ghost-blue", {
        x: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-blue"]),
    ];
  }
}
