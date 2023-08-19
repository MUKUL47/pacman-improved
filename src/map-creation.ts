import { Game } from ".";
import Config from "./config";
import { GhostState, GroundState, PlayerState, State } from "./state";
import { AssetType, Coordinate, MapCreationAsset, SaveConfig } from "./types";

export default class MapCreation extends Config {
  private ctx: HTMLCanvasElement;
  private activeAsset: MapCreationAsset = "wall";
  private readonly assetMap: Record<MapCreationAsset, AssetType | null> = {
    energy: "cherry",
    "ghost-red": "ghost-red",
    "ghost-blue": "ghost-blue",
    "ghost-green": "ghost-green",
    "ghost-yellow": "ghost-yellow",
    pacman: "pacman-right",
    score: "dot",
    wall: "wall",
    erase: null,
  };
  private xOffset: number = 0;
  private yOffset: number = 0;
  private renderBlocks = new Map<string, MapCreationAsset>();
  private isCanvasMouseClick: boolean = false;
  private isDragMode: boolean = false;
  private isPacmanSet: boolean = false;
  private isTestmode: boolean = false;
  private gameInstance: Game;
  constructor() {
    super();
    this.initializeRender();
    this.listenToConfigUpload();
  }

  private initializeRender() {
    this.ctx = document.querySelector("canvas");
    this.xOffset = this.ctx.offsetLeft;
    this.yOffset = this.ctx.offsetTop;
    this.preloadAssets().then(this.initListener);
  }

  private initListener = () => {
    document.addEventListener("click", this.onDocumentClick);
    this.ctx.addEventListener("mouseup", this.toggleCanvasMouse(false));
    this.ctx.addEventListener("mousedown", this.toggleCanvasMouse(true));
    this.ctx.addEventListener("mousemove", this.onCanvasMove);
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
    } else if (btn.hasAttribute("reset") && confirm("Are your sure")) {
      window.location.reload();
    } else if (btn.hasAttribute("test")) {
      if (!this.isTestmode) {
        document.getElementById("test-mode").innerHTML = "Creation Mode";
        this.destroy();
        this.playTestMode();
        return;
      }
      this.tiggerCreateMode();
    } else if (btn.role === "save_config") {
      this.saveConfig();
    }
  };

  private tiggerCreateMode() {
    this.isTestmode = false;
    this.gameInstance?.destroy();
    this.initializeRender();
    document.getElementById("test-mode").innerHTML = "Test Mode";
  }
  private playTestMode() {
    if (!this.isPacmanSet) return alert("Pacman missing!!!");
    this.isTestmode = true;
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
    for (let [coord, asset] of this.renderBlocks.entries()) {
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
    this.gameInstance = new Game({
      state: new State({
        ghost: new GhostState({
          "ghost-blue": ghostsAssets["ghost-blue"],
          "ghost-red": ghostsAssets["ghost-red"],
          "ghost-yellow": ghostsAssets["ghost-yellow"],
          "ghost-green": ghostsAssets["ghost-green"],
        }),
        player: new PlayerState({
          coordinates: pacman as Coordinate,
          lives: 0,
        }),
        ground: new GroundState({
          food: assets.energy,
          pacman: pacman as Coordinate,
          score: assets.score,
          walls: assets.wall,
        }),
      }),
      onGameover: () => {
        this.tiggerCreateMode();
      },
    });
    this.gameInstance.start();
  }
  private onCanvasMove = (e) => {
    const { clientX, clientY } = e;
    if (!this.isDragMode || !this.isCanvasMouseClick) return;
    this.onCanvasClick(clientX, clientY);
    this.render();
  };

  private toggleCanvasMouse = (flag: boolean) => {
    return () => {
      this.isCanvasMouseClick = flag;
    };
  };

  private toggleBtnClass(e: HTMLButtonElement) {
    [...document.querySelectorAll("button.active")].forEach((b) => {
      b.className = "";
    });
    e.className = "active";
  }

  private onAssetClick(asset: HTMLButtonElement) {
    const assetType = asset.getAttribute("asset") as MapCreationAsset;
    this.activeAsset = assetType;
    this.toggleBtnClass(asset);
  }

  private onCanvasClick(x: number, y: number) {
    if (this.isTestmode) return;
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
    const c = `${dx},${dy}`;
    if (this.activeAsset === "erase") {
      return this.renderBlocks.delete(c);
    }
    const coordinateAsset = this.renderBlocks.get(c);
    if (this.renderBlocks.get(c) === "pacman" && this.isPacmanSet) {
      this.isPacmanSet = false;
    }
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

  private saveConfig() {
    try {
      let encoded = JSON.stringify({
        isPacman: this.isPacmanSet,
        assets: [...this.renderBlocks],
      } as SaveConfig);
      const encodedURI =
        "data:text;charset=utf-8," + encodeURIComponent(encoded);
      const link = document.createElement("a");
      link.href = encodedURI;
      link.download = `pacman-config-${Date.now()}`;
      link.click();
    } catch (e) {
      alert("Failed to save config");
    }
  }

  private listenToConfigUpload() {
    const inpElement = document.querySelector(
      'input[role="load_config"]'
    ) as HTMLInputElement;
    inpElement?.addEventListener("change", async (e: Event) => {
      try {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const encodedResponse = JSON.parse(
            await target.files[0].text()
          ) as SaveConfig;
          this.renderBlocks = new Map(encodedResponse.assets);
          this.isPacmanSet = encodedResponse.isPacman;
          this.render();
          inpElement.value = "";
        }
      } catch (ee) {
        inpElement.value = "";
        alert("Failed to read the config");
      }
    });
  }

  destroy() {
    // document.removeEventListener("click", this.onDocumentClick);
    this.ctx.removeEventListener("mouseup", this.toggleCanvasMouse(false));
    this.ctx.removeEventListener("mousedown", this.toggleCanvasMouse(true));
    this.ctx.removeEventListener("mousemove", this.onCanvasMove);
  }
}
new MapCreation();
