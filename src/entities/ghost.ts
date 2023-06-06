import Config from "../config";
import { State } from "../state";
import { Coordinate, Direction, Entity, EntityInstance } from "../types";

export default class Ghost implements Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  private lastScannedTime = -1;
  private readonly playerSearchFrequency = 250;
  private readonly directionMap: Record<Direction, number> = {
    down: 1,
    right: 1,
    up: -1,
    left: -1,
  };
  constructor({ ctx, state }: EntityInstance) {
    this.ctx = ctx;
    this.state = state;
    this.state.ghostState.addGhost("pinkEnemy", {
      x: 250,
      y: 250,
    });
    setTimeout(() => {
      this.findPacman();
    }, 500);
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
      const player = this.state.playerState.getCoordinates;
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
        neighbors.length < 4 && console.log(neighbors);
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
      console.log(coordinatesPath);
      console.log(this.state.groundState.walls);
    });
  }
  private navigateToPlayer() {
    this.state.ghostState.ghosts.forEach((ghost) => {
      const source = ghost.position;
      const destination = ghost.path[ghost.pathIndex];
      if (!destination) return;

      const x = Math.floor(source.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE;
      const y = Math.floor(source.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE;
      if (
        x === this.state.playerState.getCoordinates.x &&
        y === this.state.playerState.getCoordinates.y
      ) {
        return this.findPacman();
      }
      const isXMoving = x > destination.x || x < destination.x;
      const isYMoving = y > destination.y || y < destination.y;
      if (isXMoving || isYMoving) {
        ghost.setPosition({
          x: isXMoving
            ? this.directionMap[x < destination.x ? "right" : "left"] *
                ghost.speed +
              ghost.position.x
            : ghost.position.x,
          y: isYMoving
            ? this.directionMap[y < destination.y ? "down" : "up"] *
                ghost.speed +
              ghost.position.y
            : ghost.position.y,
        });
      } else {
        ghost.pathIndex += 1;
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
      return !(
        x > Config.CANVAS_SIZE ||
        y > Config.CANVAS_SIZE ||
        x < 0 ||
        y < 0
      );
    });
    return c;
  }
  destroy(): void {}
  draw(): void {
    this.state.ghostState.ghosts.forEach((ghost) => {
      this.ctx.drawImage(
        Config.getAsset(ghost.name),
        ghost.position.x,
        ghost.position.y,
        Config.BLOCK_SIZE,
        Config.BLOCK_SIZE
      );
    });
    this.navigateToPlayer();
  }
}
