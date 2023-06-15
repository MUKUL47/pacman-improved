import Config from "../../config";
import Ghost from "./ghost";

export default class GhostState {
  private _ghosts: Ghost[] = [];
  constructor() {}

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
    this._ghosts = [
      new Ghost("ghost-red-left", { x: 300, y: 0 }).setDifficulty(1),
      new Ghost("ghost-yellow-left", {
        x: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        y: 0,
      }).setDifficulty(2),
      new Ghost("ghost3", {
        x: 0,
        y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
      }).setDifficulty(3),
      new Ghost("ghost3", {
        x: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
      }).setDifficulty(4),
    ];
  }
}
