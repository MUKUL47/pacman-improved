type Pacman = "PACMAN_LEFT" | "PACMAN_RIGHT" | "PACMAN_UP" | "PACMAN_DOWN";
type Assets = Pacman;
export default class Config {
  public static readonly CANVAS_SIZE = 800;
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
    "../oldpacman/PACMAN/assets/pinkEnemy.jpg",
  ];
  constructor() {}

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
}
