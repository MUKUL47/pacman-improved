import Config from "../config";
import { BFS } from "../path-finder";
import { GhostState, State } from "../state";
import { Coordinate, Direction, Entity, EntityInstance } from "../types";

export default class Ghost implements Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  private readonly directionMap: Record<Direction, number> = {
    down: 1,
    right: 1,
    up: -1,
    left: -1,
  };
  constructor({ ctx, state }: EntityInstance) {
    this.ctx = ctx;
    this.state = state;
    this.state.ghostState.initializeDefaults();
  }
  findPacman() {
    this.state.ghostState.ghosts.forEach((ghost) => {
      if (
        ghost.position.x % Config.BLOCK_SIZE != 0 ||
        ghost.position.y % Config.BLOCK_SIZE != 0 ||
        !ghost.isTimeToSearch
      )
        return;
      if (ghost.respawning) {
        if (ghost.respawning === 1) return;
        ghost.respawning = 1;
      }

      const destination = ghost.respawning
        ? ghost.origin
        : ghost.panicMode?.flag
        ? this.getRandSaveSpot()
        : this.state.playerState.getCoordinates;
      const [pX, pY] = [
        Math.floor(destination.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
        Math.floor(destination.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
      ];
      const [gX, gY] = [
        Math.floor(ghost.position.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
        Math.floor(ghost.position.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
      ];
      const origin = { x: gX, y: gY };
      const isHit =
        Config.getRand({ min: 1, max: ghost.difficulty * 1.2 }) === 1;
      const destinationTarget =
        isHit || ghost.respawning ? { x: pX, y: pY } : this.getRandSaveSpot();
      let path = BFS.find(this.state, origin, destinationTarget);
      if (isHit && path.length === 0) {
        path = BFS.find(this.state, origin, this.getRandSaveSpot());
      }
      ghost.setPath(path);
    });
  }
  private getRandSaveSpot(): Coordinate {
    while (true) {
      const x = Config.getStartPos(
        Config.getRand({
          min: 0,
          max: Config.CANVAS_SIZE.width - Config.BLOCK_SIZE,
        })
      );
      const y = Config.getStartPos(
        Config.getRand({
          min: 0,
          max: Config.CANVAS_SIZE.height - Config.BLOCK_SIZE,
        })
      );
      if (!this.state.groundState.wallsMap.has(`${x},${y}`)) return { x, y };
    }
  }
  private navigateToPlayer() {
    const player = this.state.playerState.getCoordinates;
    for (let idx = 0; idx < this.state.ghostState.ghosts.length; idx++) {
      const ghost = this.state.ghostState.ghosts[idx];
      const source = ghost.position;
      const destination = ghost.path[ghost.pathIndex];
      if (!destination) return;
      if (
        Math.abs(source.x - player.x) <= Math.floor(Config.BLOCK_SIZE / 2) &&
        Math.abs(source.y - player.y) <= Math.floor(Config.BLOCK_SIZE / 2)
      ) {
        if (!ghost.panicMode?.flag && !ghost.respawning) {
          const pState = this.state.playerState.dead() == "dead";
          if (pState) {
            this.state.ghostState.initializeDefaults();
          } else {
            this.state.gameover();
            return;
          }
        }
      }
      const x = Math.floor(source.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE;
      const y = Math.floor(source.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE;
      const right = source.x < destination.x;
      const left = source.x > destination.x;
      const down = source.y < destination.y;
      const up = source.y > destination.y;
      const isXMoving = right || left;
      const isYMoving = up || down;
      if (isXMoving) {
        const dx =
          this.directionMap[x < destination.x ? "right" : "left"] *
            ghost.speed +
          ghost.position.x;
        const finalX =
          Math.abs(dx - destination.x) < ghost.speed &&
          Math.abs(dx - destination.x) > 0;
        ghost.setPosition({
          x: finalX ? destination.x : dx,
          y: ghost.position.y,
        });
      } else if (isYMoving) {
        const dy =
          this.directionMap[y < destination.y ? "down" : "up"] * ghost.speed +
          ghost.position.y;
        const finalY =
          Math.abs(dy - destination.y) < ghost.speed &&
          Math.abs(dy - destination.y) > 0;
        ghost.setPosition({
          x: ghost.position.x,
          y: finalY ? destination.y : dy,
        });
      } else {
        ghost.pathIndex += 1;
        if (ghost.respawning === 1 && !ghost.path[ghost.pathIndex]) {
          this.state.ghostState.respawn(idx);
        }
      }
    }
  }
  destroy(): void {}
  draw(): void {
    if (!!localStorage.getItem("ghost-path")) {
      this.state.ghostState.ghosts.forEach((ghost) => {
        ghost.path.slice(ghost.pathIndex).forEach((g) => {
          this.ctx.beginPath();
          this.ctx.arc(
            g.x + Config.BLOCK_SIZE / 2,
            g.y + Config.BLOCK_SIZE / 2,
            2,
            0,
            2 * Math.PI
          );
          this.ctx.fillStyle = GhostState.ghostColorMap[ghost.difficulty];
          this.ctx.fill();
        });
      });
    }
    this.state.ghostState.ghosts.forEach((ghost) => {
      this.ctx.drawImage(
        ghost.identity,
        ghost.position.x,
        ghost.position.y,
        Config.BLOCK_SIZE,
        Config.BLOCK_SIZE
      );
      ghost.checkPanic();
    });
    this.findPacman();
    this.navigateToPlayer();
  }
}
