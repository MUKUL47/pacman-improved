import Config, { AssetType } from "../../config";
import { Coordinate } from "../../types";

export default class Ghost {
  public id: string = `${Math.random() * Math.random()}`;
  public name: AssetType;
  public path: Coordinate[] = [];
  public position: Coordinate;
  public pathIndex: number = 0;
  public speed = 2; //Config.getRand({ max: 2, min: 2 });
  public difficulty: number = 5;
  public origin: Coordinate;
  public respawning: boolean | 1 = false;
  public panicModeFrequency = 5000;
  public panicMode: { flag: boolean; lastPanicedAt?: number };
  private lastScannedTime = -1;
  private searchFrequency: number = 800;

  constructor(name: AssetType, coordinate: Coordinate, difficulty?: number) {
    this.name = name;
    this.position = coordinate;
    this.origin = coordinate;
    this.difficulty =
      difficulty ?? Math.floor(Config.getRand({ max: 5, min: 1 }));
  }

  public setPosition(coordinate: Coordinate): this {
    this.position = coordinate;
    return this;
  }
  public setPath(coordinates: Coordinate[]): this {
    this.path = coordinates;
    if (coordinates.length > 0) {
      this.pathIndex = 0;
    }
    return this;
  }
  public setDifficulty(n: number): this {
    this.difficulty = n;
    return this;
  }

  public checkPanic(): this {
    if (!this.panicMode?.flag) return this;
    const isOver =
      Date.now() - this.panicMode.lastPanicedAt >= this.panicModeFrequency;
    if (isOver) {
      this.setPanic(false);
    }
    return this;
  }

  public setPanic(flag: boolean): this {
    this.panicMode = { flag, lastPanicedAt: Date.now() };
    return this;
  }
  public get isTimeToSearch(): boolean {
    const now = Date.now();
    if (now - this.lastScannedTime >= this.searchFrequency) {
      this.lastScannedTime = now;
      return true;
    }
    return false;
  }

  public get identity() {
    return Config.getAsset(
      this.respawning
        ? "ghost-dead"
        : !this.panicMode?.flag
        ? this.name
        : "ghost-panic"
    );
  }
}
