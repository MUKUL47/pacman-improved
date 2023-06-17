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
