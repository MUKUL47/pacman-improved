import Config from "../config";
import { PlayerState, State } from "../state";
import { Direction, Entity, EntityInstance } from "../types";
export default class Player implements Entity {
  ctx: CanvasRenderingContext2D;
  state: State;
  playerState: PlayerState;
  private direction: Direction = "right";
  private readonly directionMap: Record<Direction, number> = {
    down: PlayerState.getSpeed,
    right: PlayerState.getSpeed,
    up: -PlayerState.getSpeed,
    left: -PlayerState.getSpeed,
  };
  private nextDirection: Direction = this.direction;
  constructor({ ctx, state }: EntityInstance) {
    this.ctx = ctx;
    this.state = state;
    this.playerState = state.playerState;
    window.addEventListener("keyup", this.onKeyUp);
  }
  onKeyUp = ({ key }) => {
    if (!["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(key))
      return;
    const direction: Direction = key.split("Arrow")[1].toLowerCase();
    if (this.checkWalls(direction)) {
      this.direction = direction;
      this.nextDirection = direction;
    } else if (
      (direction === "down" &&
        (this.direction === "right" || this.direction === "left")) ||
      (direction === "up" &&
        (this.direction === "right" || this.direction === "left")) ||
      (direction === "left" &&
        (this.direction === "up" || this.direction === "down")) ||
      (direction === "right" &&
        (this.direction === "up" || this.direction === "down"))
    ) {
      this.nextDirection = direction;
    }
  };

  move = () => {
    try {
      let coord =
        this.direction === "down" || this.direction === "up" ? "y" : "x";
      this.teleportIfOutOfBounds(coord);
      if (
        this.direction !== this.nextDirection &&
        this.checkWalls(this.nextDirection)
      ) {
        this.direction = this.nextDirection;
        coord =
          this.direction === "down" || this.direction === "up" ? "y" : "x";
      } else if (!this.checkWalls()) return;
      this.checkFoodAndScore();
      this.findPanicGhosts();
      this.playerState.setCoordinates({
        [coord]:
          this.directionMap[this.direction] +
          this.playerState.getCoordinates[coord],
      });
    } catch (e) {}
  };
  private checkFoodAndScore() {
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
    for (let i = 0; i < this.state.groundState.score.length; i++) {
      const score = this.state.groundState.score[i];
      if (!!score.removed) continue;
      if (
        Math.abs(x - score.x) <= Math.floor(Config.BLOCK_SIZE / 2) &&
        Math.abs(y - score.y) <= Math.floor(Config.BLOCK_SIZE / 2)
      ) {
        this.state.groundState.addScore(i);
        const score = +Config.window["pacman-score"].innerText + 1;
        Config.window["pacman-score"].innerText = score.toString();
        if (score === this.state.groundState.score.length) {
          alert("You won!!!");
          window.location.reload();
        }
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
        ghost.speed = 2.5;
      }
    });
  }

  private teleportIfOutOfBounds(coord: string) {
    if (
      (this.direction === "down" || this.direction === "right") &&
      this.playerState.getCoordinates[coord] >= Config.CANVAS_SIZE.width
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
        [coord]: Config.CANVAS_SIZE.height + Config.BLOCK_SIZE,
      });
    }
  }

  private checkWalls(preMove?: Direction) {
    const { x, y } = this.playerState.getCoordinates;
    const direction = preMove || this.direction;
    for (let i = 0; i < this.state.groundState.walls.length; i++) {
      const wall = this.state.groundState.walls[i];
      const matchX = Math.abs(x - wall.x) < Config.BLOCK_SIZE;
      const matchY = Math.abs(y - wall.y) < Config.BLOCK_SIZE;
      if (
        (direction === "right" &&
          Math.abs(wall.x - (x + Config.BLOCK_SIZE)) <=
            PlayerState.collisionGap &&
          matchY) ||
        (direction === "left" &&
          Math.abs(x - (wall.x + Config.BLOCK_SIZE)) <=
            PlayerState.collisionGap &&
          matchY) ||
        (direction === "down" &&
          Math.abs(y + Config.BLOCK_SIZE - wall.y) <=
            PlayerState.collisionGap &&
          matchX) ||
        (direction === "up" &&
          Math.abs(y - (wall.y + Config.BLOCK_SIZE)) <=
            PlayerState.collisionGap &&
          matchX)
      ) {
        return false;
      }
    }
    return true;
  }

  destroy(): void {
    window.removeEventListener("keyup", this.onKeyUp);
  }

  draw() {
    this.ctx.drawImage(
      Config.getAsset(`pacman-${this.direction}`),
      this.playerState.getCoordinates.x,
      this.playerState.getCoordinates.y,
      Config.BLOCK_SIZE,
      Config.BLOCK_SIZE
    );
    this.move();
  }
}
