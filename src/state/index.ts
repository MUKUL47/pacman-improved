import GhostState from "./ghost-state";
import { GroundState } from "./ground-state";
import { PlayerState } from "./player-state";

export class State {
  private _playerState: PlayerState;
  private _groundState: GroundState;
  private _ghostState: GhostState;
  private gameoverInvokers: Array<() => any> = [];
  constructor({
    player,
    ground,
    ghost,
  }: {
    player?: PlayerState;
    ground?: GroundState;
    ghost?: GhostState;
  }) {
    this._playerState = player || new PlayerState({ speed: 2 });
    this._groundState = ground || new GroundState();
    this._ghostState = ghost || new GhostState();
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
  public registerGameover(cb: () => any) {
    this.gameoverInvokers.push(cb);
  }
  public gameover() {
    this.gameoverInvokers.map((fn) => fn.apply?.(null));
  }
}
export { PlayerState, GroundState, GhostState };
