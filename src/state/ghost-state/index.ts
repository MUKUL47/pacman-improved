import Config from "../../config";
import Ghost from "./ghost";

export default class GhostState {
  private _ghosts: Ghost[] = [];
  public static readonly speed = 7;
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
      new Ghost("redEnemyy", { x: 300, y: 0 }).setDifficulty(1),
      new Ghost("blueEnemy", {
        x: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        y: 0,
      }).setDifficulty(2),
      new Ghost("yellowEnemy", {
        x: 0,
        y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
      }).setDifficulty(3),
      new Ghost("pinkEnemy", {
        x: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
      }).setDifficulty(4),
    ];
  }
}
