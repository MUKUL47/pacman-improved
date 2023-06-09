import { Coordinate } from "../../types";

export default class Ghost {
  private _name: string;
  private _path: Coordinate[] = [];
  private _position: Coordinate;
  public pathIndex: number = 0;
  public speed = 5; // Math.floor(Math.random() * (5 - 2) + 2);
  private _difficulty: number = 5;

  constructor(name: string) {
    this._name = name;
  }

  public setPosition(coordinate: Coordinate): this {
    this._position = coordinate;
    return this;
  }
  public setPath(coordinates: Coordinate[]): this {
    this._path = coordinates;
    if (coordinates.length > 0) {
      this.pathIndex = 0;
    }
    return this;
  }
  public setDifficulty(n: number): this {
    this._difficulty = n;
    return this;
  }

  //
  public get position(): Coordinate {
    return this._position;
  }
  public get path(): Coordinate[] {
    return this._path;
  }
  public get name(): string {
    return this._name;
  }

  public get difficulty(): number {
    return this._difficulty;
  }
}
