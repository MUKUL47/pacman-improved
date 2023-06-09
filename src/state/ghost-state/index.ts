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

  public initializeDefaults(): void {
    this._ghosts = [
      new Ghost("pinkEnemy").setPosition({ x: 0, y: 0 }).setDifficulty(1.5),
      new Ghost("pinkEnemy")
        .setPosition({
          x: Config.CANVAS_SIZE - Config.BLOCK_SIZE,
          y: 0,
        })
        .setDifficulty(1.75),
      new Ghost("pinkEnemy")
        .setPosition({
          x: 0,
          y: Config.CANVAS_SIZE - Config.BLOCK_SIZE,
        })
        .setDifficulty(2),
      new Ghost("pinkEnemy")
        .setPosition({
          x: Config.CANVAS_SIZE - Config.BLOCK_SIZE,
          y: Config.CANVAS_SIZE - Config.BLOCK_SIZE,
        })
        .setDifficulty(2.5),
    ];
  }
}
