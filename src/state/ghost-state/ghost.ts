import { Coordinate } from "../../types";

export default class Ghost {
  private _name: string;
  private _path: Coordinate[] = [];
  private _position: Coordinate;
  public pathIndex: number = 0;
  public speed = Math.floor(Math.random() * 10 + 1);

  constructor(name: string) {
    this._name = name;
  }

  public setPosition(coordinate: Coordinate): void {
    this._position = coordinate;
  }
  public setPath(coordinates: Coordinate[]): void {
    this._path = coordinates;
    if (coordinates.length > 0) {
      this.pathIndex = 0;
    }
  }
  public get position(): Coordinate {
    return this._position;
  }
  public get path(): Coordinate[] {
    return this._path;
  }
  public get name(): string {
    return this._name;
  }
}
