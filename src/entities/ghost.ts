import Config from "../config";
import { State } from "../state";
import { Coordinate, Direction, Entity, EntityInstance } from "../types";

export default class Ghost implements Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  private lastScannedTime = -1;
  private readonly playerSearchFrequency = 800;
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
  private get isTimeToSearch(): boolean {
    const now = Date.now();
    if (now - this.lastScannedTime >= this.playerSearchFrequency) {
      this.lastScannedTime = now;
      return true;
    }
    return false;
  }
  findPacman() {
    if (!this.isTimeToSearch) return;
    this.state.ghostState.ghosts.forEach((ghost) => {
      if (
        ghost.position.x % Config.BLOCK_SIZE != 0 ||
        ghost.position.y % Config.BLOCK_SIZE != 0
      )
        return;
      if (ghost.respawning) {
        if (ghost.respawning === 1) return;
        ghost.respawning = 1;
      }

      const player = ghost.respawning
        ? ghost.origin
        : ghost.panicMode?.flag
        ? this.getRandSaveSpot()
        : this.state.playerState.getCoordinates;
      const [pX, pY] = [
        Math.floor(player.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
        Math.floor(player.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
      ];
      const [gX, gY] = [
        Math.floor(ghost.position.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
        Math.floor(ghost.position.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE,
      ];
      let coordinatesPath: Coordinate[] = [
        {
          x: gX,
          y: gY,
        },
      ];
      const visitedNodes = new Set<string>([`${gX},${gY}`]);
      while (coordinatesPath.length > 0) {
        const { x, y } = coordinatesPath[coordinatesPath.length - 1];
        const neighbors = this.getNeighboringCoordinates(x, y).filter(
          ({ x, y }) =>
            !visitedNodes.has(`${x},${y}`) &&
            !this.state.groundState.walls.some((wall) => {
              return wall.x === x && wall.y === y;
            })
        );
        if (neighbors.length === 0) {
          //backtrack
          coordinatesPath.pop();
          continue;
        }
        const [_, __, nearestNode] = neighbors.reduce<
          [number, number, { x: number; y: number } | null]
        >(
          ([x1, y1, oldNode], c) => {
            const dX = Math.abs(c.x - pX);
            const dY = Math.abs(c.y - pY);
            const isNearest = dX <= x1 && dY <= y1;
            const node = isNearest ? { x: c.x, y: c.y } : oldNode;
            return [
              isNearest ? dX : x1,
              isNearest ? dY : y1,
              isNearest ? node : oldNode,
            ];
          },
          [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, null]
        );
        if (!nearestNode) break; //path doesnt exist
        coordinatesPath.push(nearestNode);
        if (nearestNode.x === pX && nearestNode.y === pY) {
          //path found
          break;
        }
        visitedNodes.add(`${nearestNode.x},${nearestNode.y}`);
      }
      ghost.setPath(coordinatesPath);
    });
  }
  private getRandSaveSpot(): Coordinate {
    while (true) {
      const x = Config.getStartPos(
        Config.getRand({
          min: 0,
          max: Config.CANVAS_SIZE - Config.BLOCK_SIZE,
        })
      );
      const y = Config.getStartPos(
        Config.getRand({
          min: 0,
          max: Config.CANVAS_SIZE - Config.BLOCK_SIZE,
        })
      );
      if (!this.state.groundState.wallsMap.has(`${x},${y}`)) return { x, y };
    }
  }
  private navigateToPlayer() {
    this.state.ghostState.ghosts.forEach((ghost) => {
      const source = ghost.position;
      const destination = ghost.path[ghost.pathIndex];
      if (!destination) return;

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
          this.state.ghostState.respawn(ghost);
        }
      }
    });
  }
  getNeighboringCoordinates(gX, gY) {
    let c = [
      { x: gX - Config.BLOCK_SIZE, y: gY }, // Left
      { x: gX + Config.BLOCK_SIZE, y: gY }, // Right
      { x: gX, y: gY - Config.BLOCK_SIZE }, // Top
      { x: gX, y: gY + Config.BLOCK_SIZE }, // Bottom
    ];
    c = c.filter(({ x, y }) => {
      return (
        x <= Config.CANVAS_SIZE - Config.BLOCK_SIZE &&
        y <= Config.CANVAS_SIZE - Config.BLOCK_SIZE &&
        x >= 0 &&
        y >= 0
      );
    });
    return c;
  }
  destroy(): void {}
  draw(): void {
    this.state.ghostState.ghosts.forEach((ghost) => {
      this.ctx.drawImage(
        Config.getAsset(
          ghost.respawning
            ? "dead_pacman"
            : !ghost.panicMode?.flag
            ? ghost.name
            : "ghostDead"
        ),
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
