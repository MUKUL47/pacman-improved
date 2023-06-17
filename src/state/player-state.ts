import Config from "../config";
import { Coordinate } from "../types";

export class PlayerState {
  private static speed = 1.7;
  public static readonly collisionGap = 1;
  public lives: number;
  constructor({ speed, lives }: { speed?: number; lives?: number }) {
    this.lives = lives || 3;
    Config.window["pacman-lives"].innerText = this.lives.toString();
    if (speed > Config.BLOCK_SIZE)
      throw new Error("Speed cannot be greator than block size");
    PlayerState.speed = speed || 1.5;
    let max = PlayerState.speed;
    let min = PlayerState.speed;
    while (Config.BLOCK_SIZE % max !== 0 && Config.BLOCK_SIZE % min !== 0) {
      max = +(max + 0.01).toFixed(2);
      min = +(min - 0.01).toFixed(2);
    }
    PlayerState.speed = Config.BLOCK_SIZE % min === 0 ? min : max;
  }
  private coordinates: Coordinate = {
    x: Math.floor(
      (Config.BLOCK_SIZE / 2) * (Config.CANVAS_SIZE.width / Config.BLOCK_SIZE)
    ),
    y: Math.floor(
      (Config.BLOCK_SIZE / 2) * (Config.CANVAS_SIZE.height / Config.BLOCK_SIZE)
    ),
  };
  public get getCoordinates() {
    return this.coordinates;
  }
  public setCoordinates({ x, y }: Partial<Coordinate>) {
    this.coordinates.x = x ?? this.coordinates.x;
    this.coordinates.y = y ?? this.coordinates.y;
  }
  public static get getSpeed() {
    return this.speed;
  }
  public dead() {
    if (--this.lives <= 0) {
      window.location.reload();
    }
    Config.window["pacman-lives"].innerText = this.lives.toString();
    return true;
  }
}
