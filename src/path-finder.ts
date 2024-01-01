import Config from "./config";
import { State } from "./state";
import { Coordinate } from "./types";

class Node {
  public coordinate: Coordinate;
  parent: Node;
  constructor(c) {
    this.coordinate = c;
  }
}

export class BFS {
  static find = (state: State, source: Coordinate, destination: Coordinate) => {
    const visited = new Set<string>([this.hash(source)]);
    const sourceNode = new Node(source);
    const open = [sourceNode];
    let foundTarget;
    while (open.length) {
      const current = open.shift();
      const neighbors = this.getNeighboringCoordinates(
        current.coordinate.x,
        current.coordinate.y,
        state,
        visited
      );
      neighbors.forEach((neighbor) => {
        neighbor.parent = current;
        visited.add(this.hash(neighbor.coordinate));
        open.push(neighbor);
        if (
          !foundTarget &&
          neighbor.coordinate.x === destination.x &&
          neighbor.coordinate.y === destination.y
        ) {
          foundTarget = neighbor;
        }
      });
    }
    if (foundTarget) {
      let t = foundTarget;
      let path = [];
      while (t) {
        path.push(t.coordinate);
        t = t.parent;
      }
      return path.reverse();
    }
    return [];
  };

  private static getNeighboringCoordinates(
    gX,
    gY,
    state: State,
    visited: Set<string>
  ): Array<Node> {
    return [
      new Node({ x: gX + Config.BLOCK_SIZE, y: gY }), // Right
      new Node({ x: gX, y: gY - Config.BLOCK_SIZE }), // Top
      new Node({ x: gX - Config.BLOCK_SIZE, y: gY }), // Left
      new Node({ x: gX, y: gY + Config.BLOCK_SIZE }), // Bottom
    ].filter((node) => {
      const { x, y } = node.coordinate;
      return (
        x <= Config.CANVAS_SIZE.width - Config.BLOCK_SIZE &&
        y <= Config.CANVAS_SIZE.height - Config.BLOCK_SIZE &&
        x >= 0 &&
        y >= 0 &&
        !state.groundState.wallsMap.has(`${x},${y}`) &&
        !visited.has(this.hash({ x, y }))
      );
    });
  }

  private static hash(c: Coordinate): string {
    return `${c.x},${c.y}`;
  }
}
