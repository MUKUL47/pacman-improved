export type AssetType =
  | "pacman-up"
  | "pacman-left"
  | "pacman-down"
  | "pacman-right"
  | "dot"
  | "cherry"
  | "extra-left"
  | "wall"
  | "ghost-panic"
  | "ghost-dead"
  | "ghost-red"
  | "ghost-yellow"
  | "ghost-blue"
  | "ghost-green"
  | "extra-life"
  | "walkable";
export default class Config {
  public static window: Window & {
    "pacman-score": HTMLSpanElement;
    "pacman-lives": HTMLSpanElement;
    restart: (isGameover?: boolean) => void;
  } = window as any;
  private static _CANVAS_SIZE: { width: number; height: number };
  public static readonly BLOCK_SIZE = 50;
  private static assets: Map<string, HTMLImageElement> = new Map();
  private readonly fileAssets: `../assets/${AssetType}.${string}`[] = [
    "../assets/pacman-up.png",
    "../assets/pacman-left.png",
    "../assets/pacman-down.png",
    "../assets/pacman-right.png",

    "../assets/dot.png",
    "../assets/cherry.png",
    "../assets/extra-life.png",

    "../assets/wall.png",

    "../assets/ghost-panic.png",
    "../assets/ghost-dead.jpg",

    "../assets/ghost-red.png",
    "../assets/ghost-yellow.png",
    "../assets/ghost-blue.png",
    "../assets/ghost-green.png",
    "../assets/walkable.png",
  ];
  constructor() {
    const canvas = document.querySelector("canvas");
    Config._CANVAS_SIZE = {
      width: canvas.width,
      height: canvas.height,
    };
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
