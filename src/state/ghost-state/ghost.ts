import Config from "../../config";
import { Coordinate } from "../../types";

export default class Ghost {
  public id: string = `${Math.random() * Math.random()}`;
  public name: string;
  public path: Coordinate[] = [];
  public position: Coordinate;
  public pathIndex: number = 0;
  public speed = Config.getRand({ max: 5, min: 2 });
  public difficulty: number = 5;
  public origin: Coordinate;
  public respawning: boolean | 1 = false;
  public panicModeFrequency = 5000;
  public panicMode: { flag: boolean; lastPanicedAt?: number };

  constructor(name: string) {
    this.name = name;
  }

  public setPosition(coordinate: Coordinate, start?: boolean): this {
    this.position = coordinate;
    if (start) {
      this.origin = coordinate;
    }
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
}
