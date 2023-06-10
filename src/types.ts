import { State } from "./state";

export interface Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  draw(): void;
  destroy(): void;
}
type S = typeof State;
export type EntityInstance = { ctx: CanvasRenderingContext2D; state: State };
export type Coordinate = { x: number; y: number };
export type Direction = "left" | "right" | "down" | "up";
export type Asset =
  | "wall"
  | "pacman"
  | "ghost_1"
  | "ghost_2"
  | "ghost_3"
  | "ghost_4"
  | "score"
  | "energy";
