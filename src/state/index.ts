import GhostState from "./ghost-state";
import { GroundState } from "./ground-state";
import { PlayerState } from "./player-state";

export class State {
  private _playerState: PlayerState;
  private _groundState: GroundState;
  private _ghostState: GhostState;
  constructor() {
    this._playerState = new PlayerState();
    this._groundState = new GroundState();
    this._ghostState = new GhostState();
  }
  public get playerState(): PlayerState {
    return this._playerState;
  }
  public get groundState(): GroundState {
    return this._groundState;
  }
  public get ghostState(): GhostState {
    return this._ghostState;
  }
}
export { PlayerState, GroundState, GhostState };
