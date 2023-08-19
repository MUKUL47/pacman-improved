import Config from "../../config";
import { AssetType, GhostStateProps } from "../../types";
import Ghost from "./ghost";

export default class GhostState {
  private _ghosts: Ghost[] = [];
  private readonly TL = Config.CANVAS_SIZE.width - Config.BLOCK_SIZE;
  private readonly BL = Config.CANVAS_SIZE.height - Config.BLOCK_SIZE;
  private readonly ghostDefaultDifficulty = {
    "ghost-red": 1,
    "ghost-yellow": 2,
    "ghost-green": 3,
    "ghost-blue": 4,
  };
  private initialized = false;
  constructor(ghosts?: GhostStateProps) {
    if (ghosts) {
      for (let ghost in ghosts) {
        ghosts[ghost].forEach((coordinate) => {
          this._ghosts.push(
            new Ghost(
              ghost as AssetType,
              coordinate,
              this.ghostDefaultDifficulty[ghost]
            )
          );
        });
      }
      this.initialized = true;
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
    if (this.initialized) return;
    this._ghosts = [
      new Ghost("ghost-red", { x: 300, y: 0 }).setDifficulty(
        this.ghostDefaultDifficulty["ghost-red"]
      ),
      new Ghost("ghost-yellow", {
        x: this.TL,
        y: 0,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-yellow"]),
      new Ghost("ghost-green", {
        x: 0,
        y: this.BL,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-green"]),
      new Ghost("ghost-blue", {
        x: this.TL,
        y: this.BL,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-blue"]),
    ];
  }
}
