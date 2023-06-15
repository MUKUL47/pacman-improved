import Config from "../config";
import { Coordinate } from "../types";

export class PlayerState {
  private static speed = 1.7;
  public static readonly collisionGap = 1;
  constructor(speed?: number) {
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
    y: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
    x: 0,
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
}
