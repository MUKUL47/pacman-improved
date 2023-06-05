import Ghost from "./ghost";
import { Coordinate } from "../../types";

export default class GhostState {
  private _ghosts: Ghost[] = [];
  public static readonly speed = 7;
  constructor() {}

  public addGhost(name: string, position: Coordinate): Ghost {
    // const hasGhost = this._ghosts.find((ghost) => ghost.name);
    // if (!!hasGhost) return hasGhost;
    const ghost = new Ghost(name);
    ghost.setPosition(position);
    this._ghosts.push(ghost);
    return ghost;
  }

  public get ghosts(): Ghost[] {
    return this._ghosts;
  }
}
