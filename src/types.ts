import { State } from "./state";

export interface Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  draw(): void;
  destroy(): void;
}
export type EntityInstance = { ctx: CanvasRenderingContext2D; state: State };
export type Coordinate = { x: number; y: number };
export type Direction = "left" | "right" | "down" | "up";
export type AssetType =
  | "pacman-up"
  | "pacman-left"
  | "pacman-down"
  | "pacman-right"
  | "dot"
  | "cherry"
  | "extra-left"
  | "wall"
  | "ghost-panic"
  | "ghost-dead"
  | "ghost-red"
  | "ghost-yellow"
  | "ghost-blue"
  | "ghost-green"
  | "extra-life"
  | "walkable";

export type MapCreationAsset =
  | "wall"
  | "score"
  | "energy"
  | "pacman"
  | `ghost-${"red" | "blue" | "green" | "yellow"}`
  | "erase";
export type SaveConfig = {
  isPacman: boolean;
  assets: Array<[string, MapCreationAsset]>;
};
export type GhostStateProps = Record<
  "ghost-red" | "ghost-blue" | "ghost-green" | "ghost-yellow",
  Coordinate[]
>;
export type Coords = Array<Coordinate & { removed?: boolean }>;
export type GroundStateProps = {
  walls?: Set<string>;
  food?: Set<string>;
  score?: Set<string>;
  pacman?: Coordinate;
};

export const enum STORAGE {
  GAME_INSTANCE = "GAME_INSTANCE",
}
export type GameProps = {
  state?: State;
  onGameover?: () => any;
};
