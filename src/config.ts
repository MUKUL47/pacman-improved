import { AssetType } from "./types";

export default class Config {
  public static window: Window & {
    "pacman-score": HTMLSpanElement;
    "pacman-lives": HTMLSpanElement;
    restart: (isGameover?: boolean) => void;
    pause: () => void;
  } = window as any;
  private static _CANVAS_SIZE: { width: number; height: number };
  private static _BLOCK_SIZE = 25;
  private static assets: Map<string, HTMLImageElement> = new Map();
  private readonly fileAssets: `./assets/${AssetType}.${string}`[] = [
    "./assets/pacman-up.png",
    "./assets/pacman-left.png",
    "./assets/pacman-down.png",
    "./assets/pacman-right.png",

    "./assets/dot.png",
    "./assets/cherry.png",
    "./assets/extra-life.png",

    "./assets/wall.png",

    "./assets/ghost-panic.png",
    "./assets/ghost-dead.jpg",

    "./assets/ghost-red.png",
    "./assets/ghost-yellow.png",
    "./assets/ghost-blue.png",
    "./assets/ghost-green.png",
    "./assets/walkable.png",
  ];
  public static initConfig() {
    const canvas = document.querySelector("canvas");
    Config._CANVAS_SIZE = {
      width: canvas.width,
      height: canvas.height,
    };
  }
  constructor() {
    Config.initConfig();
  }

  public static get BLOCK_SIZE() {
    return this._BLOCK_SIZE;
  }

  public static setBlockSize(size: number): void {
    this._BLOCK_SIZE = size;
  }

  public static getAsset(name: AssetType): HTMLImageElement {
    return this.assets.get(name);
  }

  protected preloadAssets(): Promise<void> {
    return new Promise((r) => {
      let c = 0;
      this.fileAssets.forEach((src) => {
        import(src).then((file) => {
          const name = src.split("assets/")[1].split(".")[0];
          const img = new Image();
          img.src = file.default;
          img.onload = () => {
            Config.assets.set(name, img);
            if (++c === this.fileAssets.length) {
              r();
            }
          };
        });
      });
    });
  }

  public static getRand(range?: Partial<{ max: number; min: number }>) {
    const { max, min } = range || {};
    return Math.floor(Math.random() * (max || 5 - (min || 1)) + (min || 1));
  }

  public static get CANVAS_SIZE() {
    return this._CANVAS_SIZE;
  }

  public static getStartPos(c: number): number {
    return Math.floor(c / this.BLOCK_SIZE) * this.BLOCK_SIZE;
  }
}
