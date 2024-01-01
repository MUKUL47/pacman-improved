var m = Object.defineProperty;
var u = (r, c, e) =>
  c in r
    ? m(r, c, { enumerable: !0, configurable: !0, writable: !0, value: e })
    : (r[c] = e);
var o = (r, c, e) => (u(r, typeof c != "symbol" ? c + "" : c, e), e);
import { C as i, U as f, S as C } from "./main-b23b46c6.js";
class d extends i {
  constructor() {
    super();
    o(this, "ctx");
    o(this, "activeAsset", "wall");
    o(this, "assetMap", {
      energy: "cherry",
      "ghost-red": "ghost-red",
      "ghost-blue": "ghost-blue",
      "ghost-green": "ghost-green",
      "ghost-yellow": "ghost-yellow",
      pacman: "pacman-right",
      score: "dot",
      wall: "wall",
      erase: null,
    });
    o(this, "xOffset", 0);
    o(this, "yOffset", 0);
    o(this, "renderBlocks", new Map());
    o(this, "isCanvasMouseClick", !1);
    o(this, "isDragMode", !0);
    o(this, "isPacmanSet", !1);
    o(this, "isTestmode", !1);
    o(this, "gameInstance");
    o(this, "blockSizeDom", window.block_size);
    o(this, "blockSize", i.BLOCK_SIZE);
    o(this, "initListener", () => {
      document.addEventListener("click", this.onDocumentClick),
        this.ctx.addEventListener("mouseup", this.toggleCanvasMouse(!1)),
        this.ctx.addEventListener("mousedown", this.toggleCanvasMouse(!0)),
        this.ctx.addEventListener("mousemove", this.onCanvasMove),
        this.render();
    });
    o(this, "onDocumentClick", (e) => {
      const t = e.target;
      if (t.hasAttribute("drag-toggle")) {
        const s = t.innerHTML.split(":")[1].trim();
        (this.isDragMode = s.toLowerCase() !== "on"),
          (t.innerHTML = `Drag Mode: ${this.isDragMode ? "on" : "off"}`);
      } else if (t.hasAttribute("asset")) this.onAssetClick(t);
      else if (e.target.tagName === "CANVAS")
        this.onCanvasClick(e.clientX, e.clientY), this.render();
      else if (t.hasAttribute("reset") && confirm("Are your sure"))
        window.location.reload();
      else if (t.hasAttribute("test")) {
        if (!this.isTestmode) {
          (document.getElementById("test-mode").innerHTML = "Creation Mode"),
            this.destroy(),
            this.playTestMode();
          return;
        }
        this.tiggerCreateMode();
      } else
        t.role === "save_config"
          ? this.saveConfig()
          : t.role === "load_and_play"
          ? this.uploadAndPlay()
          : t.role === "load_config" && this.listenToConfigUpload();
    });
    o(this, "onCanvasMove", (e) => {
      const { clientX: t, clientY: s } = e;
      !this.isDragMode ||
        !this.isCanvasMouseClick ||
        (this.onCanvasClick(t, s), this.render());
    });
    o(this, "toggleCanvasMouse", (e) => () => {
      this.isCanvasMouseClick = e;
    });
    this.initializeRender();
  }
  initializeRender() {
    (this.ctx = document.querySelector("canvas")),
      (this.xOffset = this.ctx.offsetLeft),
      (this.yOffset = this.ctx.offsetTop),
      this.preloadAssets().then(this.initListener),
      (this.blockSize = d.updateConfig()),
      i.setBlockSize(this.blockSize),
      (window.block_size.value = this.blockSize),
      ["change", "keyup"].forEach((e) =>
        this.blockSizeDom.addEventListener(e, (t) => {
          const s = +t.target.value;
          isNaN(s) ||
            s < 10 ||
            s > 30 ||
            (localStorage.setItem("config_size", `${s}`),
            window.location.reload());
        })
      );
  }
  static updateConfig() {
    const e = localStorage.getItem("config_size");
    return e ? +e : i.BLOCK_SIZE;
  }
  tiggerCreateMode() {
    var e;
    (this.isTestmode = !1),
      (e = this.gameInstance) == null || e.destroy(),
      this.initializeRender(),
      (document.getElementById("test-mode").innerHTML = "Test Mode");
  }
  playTestMode() {
    if (!this.isPacmanSet) return alert("Pacman missing!!!");
    (this.isTestmode = !0),
      (this.gameInstance = f.customGameInstance(this.renderBlocks, () => {
        this.tiggerCreateMode();
      })),
      this.gameInstance.start();
  }
  toggleBtnClass(e) {
    [...document.querySelectorAll("button.active")].forEach((t) => {
      t.className = "";
    }),
      (e.className = "active");
  }
  onAssetClick(e) {
    const t = e.getAttribute("asset");
    (this.activeAsset = t), this.toggleBtnClass(e);
  }
  onCanvasClick(e, t) {
    if (
      this.isTestmode ||
      !this.activeAsset ||
      (this.isPacmanSet && this.activeAsset === "pacman")
    )
      return;
    this.activeAsset === "pacman" && (this.isPacmanSet = !0);
    const s = i.getStartPos(Math.floor(e - this.xOffset)),
      n = i.getStartPos(Math.floor(t - this.yOffset)),
      a = `${s},${n}`;
    if (this.activeAsset === "erase") return this.renderBlocks.delete(a);
    const l = this.renderBlocks.get(a);
    if (
      (this.renderBlocks.get(a) === "pacman" &&
        this.isPacmanSet &&
        (this.isPacmanSet = !1),
      l && l === this.activeAsset && !this.isDragMode)
    )
      return this.renderBlocks.delete(a);
    this.renderBlocks.set(a, this.activeAsset);
  }
  render() {
    const e = this.ctx.getContext("2d");
    e.clearRect(0, 0, i.CANVAS_SIZE.width, i.CANVAS_SIZE.height);
    const t = Math.floor(i.CANVAS_SIZE.width / i.BLOCK_SIZE),
      s = Math.floor(i.CANVAS_SIZE.height / i.BLOCK_SIZE);
    for (let n = 0; n < t; n++)
      for (let a = 0; a < s; a++) {
        const l = n * i.BLOCK_SIZE,
          h = a * i.BLOCK_SIZE,
          g = this.renderBlocks.get(`${l},${h}`);
        e.drawImage(
          i.getAsset(g ? this.assetMap[g] : "walkable"),
          l,
          h,
          i.BLOCK_SIZE,
          i.BLOCK_SIZE
        );
      }
  }
  saveConfig() {
    try {
      let e = JSON.stringify({
        isPacman: this.isPacmanSet,
        assets: [...this.renderBlocks],
        config: this.blockSize,
      });
      const t = "data:text;charset=utf-8," + encodeURIComponent(e),
        s = document.createElement("a");
      (s.href = t), (s.download = `pacman-config-${Date.now()}`), s.click();
    } catch {
      alert("Failed to save config");
    }
  }
  uploadAndPlay() {
    const e = document.createElement("input");
    (e.type = "file"),
      e == null ||
        e.addEventListener("change", async (t) => {
          try {
            const s = t.target;
            if (s.files) {
              const n = await f.decodeConfig(s.files);
              sessionStorage.setItem(C.GAME_INSTANCE, JSON.stringify(n.assets)),
                (window.location.href = `index.html?custom-game&config=${
                  n.config ?? i.BLOCK_SIZE
                }`);
            }
          } catch {
            (e.value = ""), alert("Failed to read the config");
          }
        }),
      e.click();
  }
  listenToConfigUpload() {
    const e = document.createElement("input");
    (e.type = "file"),
      e == null ||
        e.addEventListener("change", async (t) => {
          try {
            const s = t.target;
            if (s.files) {
              const n = JSON.parse(await s.files[0].text()),
                a = n.config ? +n.config : i.BLOCK_SIZE;
              i.setBlockSize(n.config ? +n.config : i.BLOCK_SIZE),
                localStorage.setItem("config_size", `${a}`),
                (window.block_size.value = a),
                (this.renderBlocks = new Map(n.assets)),
                (this.isPacmanSet = n.isPacman),
                this.render(),
                (e.value = "");
            }
          } catch {
            (e.value = ""), alert("Failed to read the config");
          }
        }),
      e.click();
  }
  destroy() {
    this.ctx.removeEventListener("mouseup", this.toggleCanvasMouse(!1)),
      this.ctx.removeEventListener("mousedown", this.toggleCanvasMouse(!0)),
      this.ctx.removeEventListener("mousemove", this.onCanvasMove);
  }
}
new d();
