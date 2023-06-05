import { Coordinate } from "../types";
export class GroundState {
  private _walls: Array<Coordinate & { removed?: boolean }> = [
    {
      x: 350,
      y: 250,
    },
    {
      x: 500,
      y: 200,
    },
    {
      x: 400,
      y: 500,
    },
    {
      x: 100,
      y: 700,
    },
  ];
  private _food: Array<Coordinate & { removed?: boolean }> = [
    {
      x: 250,
      y: 450,
    },
    {
      x: 100,
      y: 500,
    },
  ];
  public get walls(): Array<Coordinate & { removed?: boolean }> {
    return this._walls;
  }
  public get food(): Array<Coordinate & { removed?: boolean }> {
    return this._food;
  }

  public eatFood(idx: number): boolean {
    if (!this._food[idx]) return false;
    this._food[idx].removed = true;
    return true;
  }
}
