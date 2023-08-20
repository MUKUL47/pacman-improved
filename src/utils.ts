import { Game } from "./game";
import Config from "./config";
import { GhostState, GroundState, PlayerState, State } from "./state";
import { Coordinate, MapCreationAsset, SaveConfig } from "./types";

export namespace Util {
  export function customGameInstance(
    renderBlocks: Map<string, MapCreationAsset>,
    onGameover: () => void,
    lives?: number
  ): Game {
    let pacman = {};
    const assets: Partial<Record<MapCreationAsset, Set<string>>> = {
      score: new Set<string>(),
      wall: new Set<string>(),
      energy: new Set<string>(),
    };
    const ghostsAssets: Partial<Record<MapCreationAsset, Coordinate[]>> = {
      "ghost-red": [],
      "ghost-blue": [],
      "ghost-green": [],
      "ghost-yellow": [],
    };
    for (let [coord, asset] of renderBlocks.entries()) {
      const [x, y] = coord.split(",").map(Number);
      if (asset === "pacman") {
        pacman = { x, y };
      } else if (["score", "wall", "energy"].includes(asset)) {
        assets[asset].add(`${x},${y}`);
      } else if (
        ["ghost-red", "ghost-blue", "ghost-green", "ghost-yellow"].includes(
          asset
        )
      ) {
        ghostsAssets[asset].push({ x, y });
      }
    }
    Config.initConfig();
    return new Game({
      state: new State({
        ghost: new GhostState({
          "ghost-blue": ghostsAssets["ghost-blue"],
          "ghost-red": ghostsAssets["ghost-red"],
          "ghost-yellow": ghostsAssets["ghost-yellow"],
          "ghost-green": ghostsAssets["ghost-green"],
        }),
        player: new PlayerState({
          coordinates: pacman as Coordinate,
          lives: lives || 0,
        }),
        ground: new GroundState({
          food: assets.energy,
          pacman: pacman as Coordinate,
          score: assets.score,
          walls: assets.wall,
        }),
      }),
      onGameover: () => onGameover(),
    });
  }

  export async function decodeConfig(files: any[]): Promise<SaveConfig> {
    return JSON.parse(await files[0].text()) as SaveConfig;
  }
}
