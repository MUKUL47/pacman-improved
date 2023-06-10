type Pacman = "PACMAN_LEFT" | "PACMAN_RIGHT" | "PACMAN_UP" | "PACMAN_DOWN";
type Assets = Pacman;
export default class Config {
  private static _CANVAS_SIZE;
  public static readonly BLOCK_SIZE = 50;
  private static assets: Map<string, HTMLImageElement> = new Map();
  private readonly fileAssets = [
    "../oldpacman/PACMAN/assets/pacman_up.jpg",
    "../oldpacman/PACMAN/assets/pacman_left.jpg",
    "../oldpacman/PACMAN/assets/pacman_down.jpg",
    "../oldpacman/PACMAN/assets/pacman_right.jpg",
    "../oldpacman/PACMAN/assets/wall1.png",
    "../oldpacman/PACMAN/assets/walkable.png",
    "../oldpacman/PACMAN/assets/pacman_food.png",
    "../oldpacman/PACMAN/assets/pacman_energy.webp",
    "../oldpacman/PACMAN/assets/redEnemyy.jpg",
    "../oldpacman/PACMAN/assets/blueEnemy.jpg",
    "../oldpacman/PACMAN/assets/yellowEnemy.jpg",
    "../oldpacman/PACMAN/assets/pinkEnemy.jpg",
    "../oldpacman/PACMAN/assets/ghostDead.jpg",
    "../oldpacman/PACMAN/assets/dead_pacman.png",
  ];
  constructor() {
    Config._CANVAS_SIZE = document.querySelector("canvas").width;
  }

  public static getAsset(name: string): HTMLImageElement {
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
