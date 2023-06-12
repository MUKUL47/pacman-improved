import Config from "../config";
import { Coordinate } from "../types";

export class PlayerState {
  private static speed = 5;
  public static readonly collisionGap = 3;
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
