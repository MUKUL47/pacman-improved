import Config from "../config";
import { GhostState, State } from "../state";
import { Coordinate, Direction, Entity, EntityInstance } from "../types";

export default class Ghost implements Entity {
  ctx: CanvasRenderingContext2D;
  state?: State;
  private lastScannedTime = -1;
  private readonly playerSearchFrequency = 1000;
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
      x: 700,
      y: 700,
    });
    this.state.ghostState.addGhost("pinkEnemy", {
      x: 0,
      y: 700,
    });
    this.state.ghostState.addGhost("pinkEnemy", {
      x: 300,
      y: 700,
    });
    this.state.ghostState.addGhost("pinkEnemy", {
      x: 0,
      y: 0,
    });
    this.state.ghostState.addGhost("pinkEnemy", {
      x: 220,
      y: 130,
    });
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
      const visitedNodes = new Set<string>(`${gX},${gY}`);
      while (coordinatesPath.length > 0) {
        const { x, y } = coordinatesPath[coordinatesPath.length - 1];
        const neighbors = this.getNeighboringCoordinates(x, y).filter(
          ({ x, y }) => !visitedNodes.has(`${x},${y}`)
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
        if (nearestNode.x === pX && nearestNode.y === pY) {
          //path found
          break;
        }
        coordinatesPath.push(nearestNode);
        visitedNodes.add(`${nearestNode.x},${nearestNode.y}`);
      }
      ghost.setPath(coordinatesPath);
    });
  }
  private navigateToPlayer() {
    this.state.ghostState.ghosts.forEach((ghost) => {
      const source = ghost.position;
      const destination = ghost.path[ghost.pathIndex];
      if (!destination) return;

      const x = Math.floor(source.x / Config.BLOCK_SIZE) * Config.BLOCK_SIZE;
      const y = Math.floor(source.y / Config.BLOCK_SIZE) * Config.BLOCK_SIZE;
      if (x > destination.x) {
        ghost.setPosition({
          x: this.directionMap.left * ghost.speed + ghost.position.x,
          y: ghost.position.y,
        });
      } else if (x < destination.x) {
        ghost.setPosition({
          x: this.directionMap.right * ghost.speed + ghost.position.x,
          y: ghost.position.y,
        });
      } else if (y > destination.y) {
        ghost.setPosition({
          y: this.directionMap.up * ghost.speed + ghost.position.y,
          x: ghost.position.x,
        });
      } else if (y < destination.y) {
        ghost.setPosition({
          y: this.directionMap.down * ghost.speed + ghost.position.y,
          x: ghost.position.x,
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
    return c.filter(({ x, y }) => {
      return !(
        x > Config.CANVAS_SIZE ||
        y > Config.CANVAS_SIZE ||
        x < 0 ||
        y < 0 ||
        this.state.groundState.walls.find((wall) => {
          return wall.x === x && wall.y === y;
        })
      );
    });
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
    this.findPacman();
    this.navigateToPlayer();
  }
}
