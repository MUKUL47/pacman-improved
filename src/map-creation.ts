import Config, { AssetType } from "./config";
import { Asset } from "./types";

export default class MapCreation extends Config {
  private ctx: HTMLCanvasElement;
  private activeAsset: Asset = "wall";
  private readonly assetMap: Record<Asset, AssetType> = {
    energy: "cherry",
    ghost_1: "ghost-red-left",
    ghost_2: "ghost-yellow-left",
    ghost_3: "ghost3",
    ghost_4: "ghost4",
    pacman: "pacman-right",
    score: "dot",
    wall: "wall",
  };
  private xOffset: number = 0;
  private yOffset: number = 0;
  private renderBlocks = new Map<string, Asset>();
  private isCanvasMouseClick: boolean = false;
  private isDragMode: boolean = false;
  private isPacmanSet: boolean = false;
  constructor() {
    super();
    this.ctx = document.querySelector("canvas");
    this.xOffset = this.ctx.offsetLeft;
    this.yOffset = this.ctx.offsetTop;
    this.preloadAssets().then(this.initListener);
  }

  private initListener = () => {
    document.addEventListener("click", this.onDocumentClick);
    this.ctx.addEventListener("mouseup", () => this.toggleCanvasMouse(false));
    this.ctx.addEventListener("mousedown", () => this.toggleCanvasMouse(true));
    this.ctx.addEventListener("mousemove", (e) =>
      this.onCanvasMove(e.clientX, e.clientY)
    );
    this.render();
  };

  private onDocumentClick = (e) => {
    const btn = e.target as HTMLButtonElement;
    if (btn.hasAttribute("drag-toggle")) {
      const flag = btn.innerHTML.split(":")[1].trim();
      this.isDragMode = flag.toLowerCase() === "on" ? false : true;
      btn.innerHTML = `Drag Mode: ${this.isDragMode ? "on" : "off"}`;
    } else if (btn.hasAttribute("asset")) {
      this.onAssetClick(btn);
    } else if ((e.target as HTMLCanvasElement).tagName === "CANVAS") {
      this.onCanvasClick(e.clientX, e.clientY);
      this.render();
    }
  };
  private onCanvasMove = (x: number, y: number) => {
    if (!this.isDragMode || !this.isCanvasMouseClick) return;
    this.onCanvasClick(x, y);
    this.render();
  };

  private toggleCanvasMouse = (flag: boolean) => {
    this.isCanvasMouseClick = flag;
  };

  private toggleBtnClass(e: HTMLButtonElement) {
    [...document.querySelectorAll("button.active")].forEach((b) => {
      b.className = "";
    });
    e.className = "active";
  }

  private onAssetClick(asset: HTMLButtonElement) {
    const assetType = asset.getAttribute("asset") as Asset;
    this.activeAsset = assetType;
    this.toggleBtnClass(asset);
  }

  private onCanvasClick(x: number, y: number) {
    if (
      !this.activeAsset ||
      (this.isPacmanSet && this.activeAsset === "pacman")
    )
      return;
    if (this.activeAsset === "pacman") {
      this.isPacmanSet = true;
    }
    const dx = Config.getStartPos(Math.floor(x - this.xOffset));
    const dy = Config.getStartPos(Math.floor(y - this.yOffset));
    console.log(dx, dy);
    const c = `${dx},${dy}`;
    const coordinateAsset = this.renderBlocks.get(c);
    if (
      coordinateAsset &&
      coordinateAsset === this.activeAsset &&
      !this.isDragMode
    ) {
      return this.renderBlocks.delete(c);
    }
    this.renderBlocks.set(c, this.activeAsset);
  }

  private render() {
    const context = this.ctx.getContext("2d");
    context.clearRect(
      0,
      0,
      Config.CANVAS_SIZE.width,
      Config.CANVAS_SIZE.height
    );
    const x = Math.floor(Config.CANVAS_SIZE.width / Config.BLOCK_SIZE);
    const y = Math.floor(Config.CANVAS_SIZE.height / Config.BLOCK_SIZE);
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const dx = i * Config.BLOCK_SIZE;
        const dy = j * Config.BLOCK_SIZE;
        const asset = this.renderBlocks.get(`${dx},${dy}`);
        context.drawImage(
          Config.getAsset(!!asset ? this.assetMap[asset] : "walkable"),
          dx,
          dy,
          Config.BLOCK_SIZE,
          Config.BLOCK_SIZE
        );
      }
    }
  }

  destroy() {
    document.removeEventListener("click", this.onDocumentClick);
    this.ctx.removeEventListener("mouseup", () =>
      this.toggleCanvasMouse(false)
    );
    this.ctx.removeEventListener("mousedown", () =>
      this.toggleCanvasMouse(true)
    );
    this.ctx.removeEventListener("mousemove", (e) =>
      this.onCanvasMove(e.clientX, e.clientY)
    );
  }
}
new MapCreation();
