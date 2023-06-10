import Ghost from "./ghost";
import { Coordinate } from "../../types";
import Config from "../../config";

export default class GhostState {
  private _ghosts: Ghost[] = [];
  public static readonly speed = 7;
  constructor() {}

  public get ghosts(): Ghost[] {
    return this._ghosts;
  }

  public triggerPanic() {
    this._ghosts.forEach((ghost) => {
      ghost.setPanic(true);
    });
  }

  public respawn(ghost: Ghost) {
    const idx = this._ghosts.findIndex((g) => g.id === ghost.id);
    if (idx === -1) return;
    this._ghosts.splice(idx, 1);
    this._ghosts.push(
      new Ghost(ghost.name)
        .setDifficulty(ghost.difficulty)
        .setPosition(ghost.position, true)
    );
  }

  public initializeDefaults(): void {
    this._ghosts = [
      new Ghost("redEnemyy")
        .setPosition({ x: 300, y: 0 }, true)
        .setDifficulty(1.5),
      new Ghost("blueEnemy")
        .setPosition(
          {
            x: 500 - Config.BLOCK_SIZE,
            y: 0,
          },
          true
        )
        .setDifficulty(1.75),
    ];
  }
}
