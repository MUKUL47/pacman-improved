import Config from "../config";
import { PlayerState, State } from "../state";
import { Direction, Entity, EntityInstance } from "../types";
export default class Player implements Entity {
  ctx: CanvasRenderingContext2D;
  state: State;
  playerState: PlayerState;
  private direction: Direction = "up";
  private readonly directionMap: Record<Direction, number> = {
    down: PlayerState.getSpeed,
    right: PlayerState.getSpeed,
    up: -PlayerState.getSpeed,
    left: -PlayerState.getSpeed,
  };
  constructor({ ctx, state }: EntityInstance) {
    this.ctx = ctx;
    this.state = state;
    this.playerState = state.playerState;
    window.addEventListener("keyup", this.onKeyUp);
  }
  onKeyUp = ({ key }) => {
    if (!["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(key))
      return;
    this.direction = key.split("Arrow")[1].toLowerCase();
  };

  move = () => {
    try {
      const coord =
        this.direction === "down" || this.direction === "up" ? "y" : "x";
      this.teleportIfOutOfBounds(coord);
      this.checkWalls();
      this.checkFood();
      this.findPanicGhosts();
      this.playerState.setCoordinates({
        [coord]:
          this.directionMap[this.direction] +
          this.playerState.getCoordinates[coord],
      });
    } catch (e) {}
  };
  private checkFood() {
    const { x, y } = this.playerState.getCoordinates;
    for (let i = 0; i < this.state.groundState.food.length; i++) {
      const food = this.state.groundState.food[i];
      if (!!food.removed) continue;
      if (
        Math.abs(x - food.x) <= Math.floor(Config.BLOCK_SIZE / 2) &&
        Math.abs(y - food.y) <= Math.floor(Config.BLOCK_SIZE / 2)
      ) {
        this.state.groundState.eatFood(i);
        this.state.ghostState.triggerPanic();
      }
    }
  }

  private findPanicGhosts() {
    this.state.ghostState.ghosts.forEach((ghost) => {
      if (
        Math.abs(ghost.position.x - this.playerState.getCoordinates.x) <
          Config.BLOCK_SIZE / 2 &&
        Math.abs(ghost.position.y - this.playerState.getCoordinates.y) <
          Config.BLOCK_SIZE / 2 &&
        !!ghost.panicMode?.flag
      ) {
        ghost.respawning = true;
      }
    });
  }

  private teleportIfOutOfBounds(coord: string) {
    if (
      (this.direction === "down" || this.direction === "right") &&
      this.playerState.getCoordinates[coord] >= Config.CANVAS_SIZE
    ) {
      this.playerState.setCoordinates({
        [coord]: 0 - Math.floor(Config.BLOCK_SIZE),
      });
    }
    if (
      (this.direction === "left" || this.direction === "up") &&
      this.playerState.getCoordinates[coord] <= -Config.BLOCK_SIZE
    ) {
      this.playerState.setCoordinates({
        [coord]: Config.CANVAS_SIZE + Config.BLOCK_SIZE,
      });
    }
  }

  private checkWalls() {
    const { x, y } = this.playerState.getCoordinates;
    for (let i = 0; i < this.state.groundState.walls.length; i++) {
      const wall = this.state.groundState.walls[i];
      const matchX = Math.abs(x - wall.x) < Config.BLOCK_SIZE;
      const matchY = Math.abs(y - wall.y) < Config.BLOCK_SIZE;
      if (
        (this.direction === "right" &&
          Math.abs(wall.x - (x + Config.BLOCK_SIZE)) <=
            PlayerState.collisionGap &&
          matchY) ||
        (this.direction === "left" &&
          Math.abs(x - (wall.x + Config.BLOCK_SIZE)) <=
            PlayerState.collisionGap &&
          matchY) ||
        (this.direction === "down" &&
          Math.abs(y + Config.BLOCK_SIZE - wall.y) <=
            PlayerState.collisionGap &&
          matchX) ||
        (this.direction === "up" &&
          Math.abs(y - (wall.y + Config.BLOCK_SIZE)) <=
            PlayerState.collisionGap &&
          matchX)
      ) {
        throw "";
      }
    }
  }

  destroy(): void {
    window.removeEventListener("keyup", this.onKeyUp);
  }

  draw() {
    this.ctx.drawImage(
      Config.getAsset(`pacman_${this.direction}`),
      this.playerState.getCoordinates.x,
      this.playerState.getCoordinates.y,
      Config.BLOCK_SIZE,
      Config.BLOCK_SIZE
    );
    this.move();
  }
}
