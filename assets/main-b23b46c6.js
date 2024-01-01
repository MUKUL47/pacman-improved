var R = Object.defineProperty;
var $ = (h, t, s) =>
  t in h
    ? R(h, t, { enumerable: !0, configurable: !0, writable: !0, value: s })
    : (h[t] = s);
var o = (h, t, s) => ($(h, typeof t != "symbol" ? t + "" : t, s), s);
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i);
  new MutationObserver((i) => {
    for (const a of i)
      if (a.type === "childList")
        for (const r of a.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && n(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(i) {
    const a = {};
    return (
      i.integrity && (a.integrity = i.integrity),
      i.referrerPolicy && (a.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (a.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function n(i) {
    if (i.ep) return;
    i.ep = !0;
    const a = s(i);
    fetch(i.href, a);
  }
})();
const T = "modulepreload",
  k = function (h) {
    return "/" + h;
  },
  v = {},
  V = function (t, s, n) {
    if (!s || s.length === 0) return t();
    const i = document.getElementsByTagName("link");
    return Promise.all(
      s.map((a) => {
        if (((a = k(a)), a in v)) return;
        v[a] = !0;
        const r = a.endsWith(".css"),
          c = r ? '[rel="stylesheet"]' : "";
        if (!!n)
          for (let l = i.length - 1; l >= 0; l--) {
            const f = i[l];
            if (f.href === a && (!r || f.rel === "stylesheet")) return;
          }
        else if (document.querySelector(`link[href="${a}"]${c}`)) return;
        const u = document.createElement("link");
        if (
          ((u.rel = r ? "stylesheet" : T),
          r || ((u.as = "script"), (u.crossOrigin = "")),
          (u.href = a),
          document.head.appendChild(u),
          r)
        )
          return new Promise((l, f) => {
            u.addEventListener("load", l),
              u.addEventListener("error", () =>
                f(new Error(`Unable to preload CSS for ${a}`))
              );
          });
      })
    ).then(() => t());
  },
  x = class {
    constructor() {
      o(this, "fileAssets", [
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
      ]);
      x.initConfig();
    }
    static initConfig() {
      const t = document.querySelector("canvas");
      x._CANVAS_SIZE = { width: t.width, height: t.height };
    }
    static get BLOCK_SIZE() {
      return this._BLOCK_SIZE;
    }
    static setBlockSize(t) {
      this._BLOCK_SIZE = t;
    }
    static getAsset(t) {
      return this.assets.get(t);
    }
    preloadAssets() {
      return new Promise((resolve) => {
        let loadedCount = 0;
        const loadImage = (asset, src) => {
          const assetName = asset.split("assets/")[1].split(".")[0];
          const image = new Image();
          image.src = src;
          image.onload = () => {
            x.assets.set(assetName, image);
            if (++loadedCount === this.fileAssets.length) {
              resolve();
            }
          };
        };
        this.fileAssets.forEach((asset) => {
          const imagePath = `${asset}`;
          loadImage(asset, imagePath);
        });
      });
    }

    static getRand(t) {
      const { max: s, min: n } = t || {};
      return Math.floor(Math.random() * (s || 5 - (n || 1)) + (n || 1));
    }
    static get CANVAS_SIZE() {
      return this._CANVAS_SIZE;
    }
    static getStartPos(t) {
      return Math.floor(t / this.BLOCK_SIZE) * this.BLOCK_SIZE;
    }
  };
let e = x;
o(e, "window", window),
  o(e, "_CANVAS_SIZE"),
  o(e, "_BLOCK_SIZE", 25),
  o(e, "assets", new Map());
class I {
  constructor(t) {
    o(this, "coordinate");
    o(this, "parent");
    this.coordinate = t;
  }
}
const O = class {
  static getNeighboringCoordinates(t, s, n, i) {
    return [
      new I({ x: t + e.BLOCK_SIZE, y: s }),
      new I({ x: t, y: s - e.BLOCK_SIZE }),
      new I({ x: t - e.BLOCK_SIZE, y: s }),
      new I({ x: t, y: s + e.BLOCK_SIZE }),
    ].filter((a) => {
      const { x: r, y: c } = a.coordinate;
      return (
        r <= e.CANVAS_SIZE.width - e.BLOCK_SIZE &&
        c <= e.CANVAS_SIZE.height - e.BLOCK_SIZE &&
        r >= 0 &&
        c >= 0 &&
        !n.groundState.wallsMap.has(`${r},${c}`) &&
        !i.has(this.hash({ x: r, y: c }))
      );
    });
  }
  static hash(t) {
    return `${t.x},${t.y}`;
  }
};
let E = O;
o(E, "find", (t, s, n) => {
  const i = new Set([O.hash(s)]),
    r = [new I(s)];
  let c;
  for (; r.length; ) {
    const d = r.shift();
    O.getNeighboringCoordinates(d.coordinate.x, d.coordinate.y, t, i).forEach(
      (l) => {
        (l.parent = d),
          i.add(O.hash(l.coordinate)),
          r.push(l),
          !c && l.coordinate.x === n.x && l.coordinate.y === n.y && (c = l);
      }
    );
  }
  if (c) {
    let d = c,
      u = [];
    for (; d; ) u.push(d.coordinate), (d = d.parent);
    return u.reverse();
  }
  return [];
});
let _ = class {
  constructor(t, s, n) {
    o(this, "id", `${Math.random() * Math.random()}`);
    o(this, "name");
    o(this, "path", []);
    o(this, "position");
    o(this, "pathIndex", 0);
    o(this, "speed", 1);
    o(this, "difficulty", 5);
    o(this, "origin");
    o(this, "respawning", !1);
    o(this, "panicModeFrequency", 5e3);
    o(this, "panicMode");
    o(this, "lastScannedTime", -1);
    o(this, "searchFrequency", 1e3);
    (this.name = t),
      (this.position = s),
      (this.origin = s),
      (this.difficulty = n ?? Math.floor(e.getRand({ max: 5, min: 1 })));
  }
  setPosition(t) {
    return (this.position = t), this;
  }
  setPath(t) {
    return (this.path = t), t.length > 0 && (this.pathIndex = 0), this;
  }
  setDifficulty(t) {
    return (
      (this.difficulty = t),
      (this.searchFrequency = this.searchFrequency * t * 2),
      this
    );
  }
  checkPanic() {
    var s;
    return (s = this.panicMode) != null && s.flag
      ? (Date.now() - this.panicMode.lastPanicedAt >= this.panicModeFrequency &&
          this.setPanic(!1),
        this)
      : this;
  }
  setPanic(t) {
    return (this.panicMode = { flag: t, lastPanicedAt: Date.now() }), this;
  }
  get isTimeToSearch() {
    const t = Date.now();
    return t - this.lastScannedTime >= this.searchFrequency ||
      this.pathIndex === this.path.length ||
      this.respawning
      ? ((this.lastScannedTime = t), !0)
      : !1;
  }
  get identity() {
    var t;
    return e.getAsset(
      this.respawning
        ? "ghost-dead"
        : (t = this.panicMode) != null && t.flag
        ? "ghost-panic"
        : this.name
    );
  }
};
class L {
  constructor(t) {
    o(this, "_ghosts", []);
    o(this, "ghostDefaultDifficulty", {
      "ghost-red": 1,
      "ghost-yellow": 2,
      "ghost-green": 3,
      "ghost-blue": 4,
    });
    o(this, "initialized");
    t && ((this.initialized = t), this.customGhosts());
  }
  customGhosts() {
    for (let t in this.initialized)
      this.initialized[t].forEach((s) => {
        this._ghosts.push(new _(t, s, this.ghostDefaultDifficulty[t]));
      });
  }
  get ghosts() {
    return this._ghosts;
  }
  triggerPanic() {
    this._ghosts.forEach((t) => t.setPanic(!0));
  }
  respawn(t) {
    const s = this._ghosts[t];
    s &&
      (this._ghosts.splice(t, 1),
      this._ghosts.push(
        new _(s.name, s.origin, s.difficulty).setDifficulty(s.difficulty)
      ));
  }
  initializeDefaults() {
    if (this.initialized) {
      (this._ghosts = []), this.customGhosts();
      return;
    }
    this._ghosts = [
      new _("ghost-red", { x: 300, y: 0 }).setDifficulty(
        this.ghostDefaultDifficulty["ghost-red"]
      ),
      new _("ghost-yellow", {
        x: e.CANVAS_SIZE.width - e.BLOCK_SIZE,
        y: 0,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-yellow"]),
      new _("ghost-green", {
        x: 0,
        y: e.CANVAS_SIZE.height - e.BLOCK_SIZE,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-green"]),
      new _("ghost-blue", {
        x: e.CANVAS_SIZE.width - e.BLOCK_SIZE,
        y: e.CANVAS_SIZE.height - e.BLOCK_SIZE,
      }).setDifficulty(this.ghostDefaultDifficulty["ghost-blue"]),
    ];
  }
}
o(L, "ghostColorMap", { 1: "red", 2: "yellow", 3: "green", 4: "blue" });
class N {
  constructor(t) {
    o(this, "_walls", []);
    o(this, "_food", []);
    o(this, "_score", []);
    o(this, "walkable", []);
    o(this, "wallsMap", new Set());
    o(this, "foodMap", new Set());
    o(this, "scoreMap", new Set());
    o(this, "assetRandomCoord", {
      wall: () => e.getRand({ max: 8 }) === 8,
      food: () => e.getRand({ max: 50 }) === 50,
      score: () => e.getRand({ max: 2 }) === 2,
    });
    o(this, "props");
    this.props = t;
  }
  initializeDefaults() {
    var i, a, r, c, d, u, l, f, w, Z;
    const t = Math.floor(e.CANVAS_SIZE.width / e.BLOCK_SIZE),
      s = Math.floor(t / 2),
      n = !!this.props;
    for (let y = 0; y < t; y++)
      for (let p = 0; p < t; p++) {
        if (
          n
            ? ((a = (i = this.props) == null ? void 0 : i.pacman) == null
                ? void 0
                : a.x) === y &&
              ((c = (r = this.props) == null ? void 0 : r.pacman) == null
                ? void 0
                : c.y) === p
            : y === s && p === y
        )
          continue;
        const { x: S, y: m } = { x: y * e.BLOCK_SIZE, y: p * e.BLOCK_SIZE },
          M = `${S},${m}`;
        (
          n
            ? (u = (d = this.props) == null ? void 0 : d.walls) != null &&
              u.has(M)
            : this.assetRandomCoord.wall()
        )
          ? (this._walls.push({ x: S, y: m }), this.wallsMap.add(`${S},${m}`))
          : (
              n
                ? (f = (l = this.props) == null ? void 0 : l.food) != null &&
                  f.has(M)
                : this.assetRandomCoord.food()
            )
          ? (this._food.push({ x: S, y: m }), this.foodMap.add(`${S},${m}`))
          : (n
              ? (Z = (w = this.props) == null ? void 0 : w.score) != null &&
                Z.has(M)
              : this.assetRandomCoord.food()) &&
            (this._score.push({ x: S, y: m }), this.scoreMap.add(`${S},${m}`));
      }
  }
  get walls() {
    return this._walls;
  }
  get food() {
    return this._food;
  }
  get score() {
    return this._score;
  }
  eatFood(t) {
    return this._food[t]
      ? (this.foodMap.delete(`${this._food[t].x},${this._food[t].y}`),
        (this._food[t].removed = !0),
        !0)
      : !1;
  }
  addScore(t) {
    return this._score[t]
      ? (this.scoreMap.delete(`${this._score[t].x},${this._score[t].y}`),
        (this._score[t].removed = !0),
        !0)
      : !1;
  }
}
const C = class {
  constructor({ speed: t, lives: s, coordinates: n }) {
    o(this, "lives");
    o(this, "coordinates", {
      x: Math.floor((e.BLOCK_SIZE / 2) * (e.CANVAS_SIZE.width / e.BLOCK_SIZE)),
      y: Math.floor((e.BLOCK_SIZE / 2) * (e.CANVAS_SIZE.height / e.BLOCK_SIZE)),
    });
    if (
      ((this.coordinates = n ?? this.coordinates),
      (this.lives = s || 3),
      e.window["pacman-lives"] &&
        (e.window["pacman-lives"].innerText = this.lives.toString()),
      t > e.BLOCK_SIZE)
    )
      throw new Error("Speed cannot be greator than block size");
    C.speed = t || 1.5;
    let i = C.speed,
      a = C.speed;
    for (; e.BLOCK_SIZE % i !== 0 && e.BLOCK_SIZE % a !== 0; )
      (i = +(i + 0.01).toFixed(2)), (a = +(a - 0.01).toFixed(2));
    C.speed = e.BLOCK_SIZE % a === 0 ? a : i;
  }
  get getCoordinates() {
    return this.coordinates;
  }
  setCoordinates({ x: t, y: s }) {
    (this.coordinates.x = t ?? this.coordinates.x),
      (this.coordinates.y = s ?? this.coordinates.y);
  }
  static get getSpeed() {
    return this.speed;
  }
  dead() {
    return --this.lives <= 0
      ? "gameover"
      : (e.window["pacman-lives"] &&
          (e.window["pacman-lives"].innerText = this.lives.toString()),
        "dead");
  }
};
let g = C;
o(g, "speed", 1.7), o(g, "collisionGap", 1);
class A {
  constructor({ player: t, ground: s, ghost: n }) {
    o(this, "_playerState");
    o(this, "_groundState");
    o(this, "_ghostState");
    o(this, "gameoverInvokers", []);
    (this._playerState = t || new g({ speed: 2 })),
      (this._groundState = s || new N()),
      (this._ghostState = n || new L());
  }
  get playerState() {
    return this._playerState;
  }
  get groundState() {
    return this._groundState;
  }
  get ghostState() {
    return this._ghostState;
  }
  registerGameover(t) {
    this.gameoverInvokers.push(t);
  }
  gameover() {
    this.gameoverInvokers.map((t) => {
      var s;
      return (s = t.apply) == null ? void 0 : s.call(t, null);
    });
  }
}
class z {
  constructor({ ctx: t, state: s }) {
    o(this, "ctx");
    o(this, "state");
    o(this, "directionMap", { down: 1, right: 1, up: -1, left: -1 });
    (this.ctx = t),
      (this.state = s),
      this.state.ghostState.initializeDefaults();
  }
  findPacman() {
    this.state.ghostState.ghosts.forEach((t) => {
      var f;
      if (
        t.position.x % e.BLOCK_SIZE != 0 ||
        t.position.y % e.BLOCK_SIZE != 0 ||
        !t.isTimeToSearch
      )
        return;
      if (t.respawning) {
        if (t.respawning === 1) return;
        t.respawning = 1;
      }
      const s = t.respawning
          ? t.origin
          : (f = t.panicMode) != null && f.flag
          ? this.getRandSaveSpot()
          : this.state.playerState.getCoordinates,
        [n, i] = [
          Math.floor(s.x / e.BLOCK_SIZE) * e.BLOCK_SIZE,
          Math.floor(s.y / e.BLOCK_SIZE) * e.BLOCK_SIZE,
        ],
        [a, r] = [
          Math.floor(t.position.x / e.BLOCK_SIZE) * e.BLOCK_SIZE,
          Math.floor(t.position.y / e.BLOCK_SIZE) * e.BLOCK_SIZE,
        ],
        c = { x: a, y: r },
        d = e.getRand({ min: 1, max: t.difficulty * 1.2 }) === 1,
        u = d || t.respawning ? { x: n, y: i } : this.getRandSaveSpot();
      let l = E.find(this.state, c, u);
      d &&
        l.length === 0 &&
        (l = E.find(this.state, c, this.getRandSaveSpot())),
        t.setPath(l);
    });
  }
  getRandSaveSpot() {
    for (;;) {
      const t = e.getStartPos(
          e.getRand({ min: 0, max: e.CANVAS_SIZE.width - e.BLOCK_SIZE })
        ),
        s = e.getStartPos(
          e.getRand({ min: 0, max: e.CANVAS_SIZE.height - e.BLOCK_SIZE })
        );
      if (!this.state.groundState.wallsMap.has(`${t},${s}`))
        return { x: t, y: s };
    }
  }
  navigateToPlayer() {
    var s;
    const t = this.state.playerState.getCoordinates;
    for (let n = 0; n < this.state.ghostState.ghosts.length; n++) {
      const i = this.state.ghostState.ghosts[n],
        a = i.position,
        r = i.path[i.pathIndex];
      if (!r) return;
      if (
        Math.abs(a.x - t.x) <= Math.floor(e.BLOCK_SIZE / 2) &&
        Math.abs(a.y - t.y) <= Math.floor(e.BLOCK_SIZE / 2) &&
        !((s = i.panicMode) != null && s.flag) &&
        !i.respawning
      )
        if (this.state.playerState.dead() == "dead")
          this.state.ghostState.initializeDefaults();
        else {
          this.state.gameover();
          return;
        }
      const c = Math.floor(a.x / e.BLOCK_SIZE) * e.BLOCK_SIZE,
        d = Math.floor(a.y / e.BLOCK_SIZE) * e.BLOCK_SIZE,
        u = a.x < r.x,
        l = a.x > r.x,
        f = a.y < r.y,
        w = a.y > r.y,
        Z = u || l,
        y = w || f;
      if (Z) {
        const p =
            this.directionMap[c < r.x ? "right" : "left"] * i.speed +
            i.position.x,
          S = Math.abs(p - r.x) < i.speed && Math.abs(p - r.x) > 0;
        i.setPosition({ x: S ? r.x : p, y: i.position.y });
      } else if (y) {
        const p =
            this.directionMap[d < r.y ? "down" : "up"] * i.speed + i.position.y,
          S = Math.abs(p - r.y) < i.speed && Math.abs(p - r.y) > 0;
        i.setPosition({ x: i.position.x, y: S ? r.y : p });
      } else
        (i.pathIndex += 1),
          i.respawning === 1 &&
            !i.path[i.pathIndex] &&
            this.state.ghostState.respawn(n);
    }
  }
  destroy() {}
  draw() {
    localStorage.getItem("ghost-path") &&
      this.state.ghostState.ghosts.forEach((t) => {
        t.path.slice(t.pathIndex).forEach((s) => {
          this.ctx.beginPath(),
            this.ctx.arc(
              s.x + e.BLOCK_SIZE / 2,
              s.y + e.BLOCK_SIZE / 2,
              2,
              0,
              2 * Math.PI
            ),
            (this.ctx.fillStyle = L.ghostColorMap[t.difficulty]),
            this.ctx.fill();
        });
      }),
      this.state.ghostState.ghosts.forEach((t) => {
        this.ctx.drawImage(
          t.identity,
          t.position.x,
          t.position.y,
          e.BLOCK_SIZE,
          e.BLOCK_SIZE
        ),
          t.checkPanic();
      }),
      this.findPacman(),
      this.navigateToPlayer();
  }
}
class q {
  constructor({ ctx: t, state: s }) {
    o(this, "ctx");
    o(this, "state");
    o(this, "groundState");
    o(this, "renderBlocks", null);
    (this.ctx = t),
      (this.state = s),
      (this.groundState = this.state.groundState),
      this.groundState.initializeDefaults(),
      (this.renderBlocks = {
        wall: this.groundState.walls,
        cherry: this.groundState.food,
        dot: this.groundState.score,
      });
  }
  destroy() {}
  draw() {
    for (const t in this.renderBlocks || {})
      this.renderBlocks[t].forEach(({ x: n, y: i, removed: a }) => {
        a ||
          this.ctx.drawImage(e.getAsset(t), n, i, e.BLOCK_SIZE, e.BLOCK_SIZE);
      });
  }
}
class F {
  constructor({ ctx: t, state: s }) {
    o(this, "ctx");
    o(this, "state");
    o(this, "playerState");
    o(this, "direction", "right");
    o(this, "directionMap", {
      down: g.getSpeed,
      right: g.getSpeed,
      up: -g.getSpeed,
      left: -g.getSpeed,
    });
    o(this, "nextDirection", this.direction);
    o(this, "onKeyUp", ({ key: t }) => {
      if (!["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(t))
        return;
      const s = t.split("Arrow")[1].toLowerCase();
      this.checkWalls(s)
        ? ((this.direction = s), (this.nextDirection = s))
        : ((s === "down" &&
            (this.direction === "right" || this.direction === "left")) ||
            (s === "up" &&
              (this.direction === "right" || this.direction === "left")) ||
            (s === "left" &&
              (this.direction === "up" || this.direction === "down")) ||
            (s === "right" &&
              (this.direction === "up" || this.direction === "down"))) &&
          (this.nextDirection = s);
    });
    o(this, "move", () => {
      try {
        let t =
          this.direction === "down" || this.direction === "up" ? "y" : "x";
        if (
          (this.teleportIfOutOfBounds(t),
          this.direction !== this.nextDirection &&
            this.checkWalls(this.nextDirection))
        )
          (this.direction = this.nextDirection),
            (t =
              this.direction === "down" || this.direction === "up" ? "y" : "x");
        else if (!this.checkWalls()) return;
        this.checkFoodAndScore(),
          this.findPanicGhosts(),
          this.playerState.setCoordinates({
            [t]:
              this.directionMap[this.direction] +
              this.playerState.getCoordinates[t],
          });
      } catch {}
    });
    (this.ctx = t),
      (this.state = s),
      (this.playerState = s.playerState),
      window.addEventListener("keyup", this.onKeyUp);
  }
  checkFoodAndScore() {
    const { x: t, y: s } = this.playerState.getCoordinates;
    for (let n = 0; n < this.state.groundState.food.length; n++) {
      const i = this.state.groundState.food[n];
      i.removed ||
        (Math.abs(t - i.x) <= Math.floor(e.BLOCK_SIZE / 2) &&
          Math.abs(s - i.y) <= Math.floor(e.BLOCK_SIZE / 2) &&
          (this.state.groundState.eatFood(n),
          this.state.ghostState.triggerPanic()));
    }
    for (let n = 0; n < this.state.groundState.score.length; n++) {
      const i = this.state.groundState.score[n];
      if (
        !i.removed &&
        Math.abs(t - i.x) <= Math.floor(e.BLOCK_SIZE / 2) &&
        Math.abs(s - i.y) <= Math.floor(e.BLOCK_SIZE / 2)
      ) {
        this.state.groundState.addScore(n);
        const a = +e.window["pacman-score"].innerText + 1;
        (e.window["pacman-score"].innerText = a.toString()),
          a === this.state.groundState.score.length &&
            (alert("You won!!!"), window.location.reload());
      }
    }
  }
  findPanicGhosts() {
    this.state.ghostState.ghosts.forEach((t) => {
      var s;
      Math.abs(t.position.x - this.playerState.getCoordinates.x) <
        e.BLOCK_SIZE / 2 &&
        Math.abs(t.position.y - this.playerState.getCoordinates.y) <
          e.BLOCK_SIZE / 2 &&
        (s = t.panicMode) != null &&
        s.flag &&
        ((t.respawning = !0), (t.speed = 2.5));
    });
  }
  teleportIfOutOfBounds(t) {
    (this.direction === "down" || this.direction === "right") &&
      this.playerState.getCoordinates[t] >= e.CANVAS_SIZE.width &&
      this.playerState.setCoordinates({ [t]: 0 - Math.floor(e.BLOCK_SIZE) }),
      (this.direction === "left" || this.direction === "up") &&
        this.playerState.getCoordinates[t] <= -e.BLOCK_SIZE &&
        this.playerState.setCoordinates({
          [t]: e.CANVAS_SIZE.height + e.BLOCK_SIZE,
        });
  }
  checkWalls(t) {
    const { x: s, y: n } = this.playerState.getCoordinates,
      i = t || this.direction;
    for (let a = 0; a < this.state.groundState.walls.length; a++) {
      const r = this.state.groundState.walls[a],
        c = Math.abs(s - r.x) < e.BLOCK_SIZE,
        d = Math.abs(n - r.y) < e.BLOCK_SIZE;
      if (
        (i === "right" &&
          Math.abs(r.x - (s + e.BLOCK_SIZE)) <= g.collisionGap &&
          d) ||
        (i === "left" &&
          Math.abs(s - (r.x + e.BLOCK_SIZE)) <= g.collisionGap &&
          d) ||
        (i === "down" &&
          Math.abs(n + e.BLOCK_SIZE - r.y) <= g.collisionGap &&
          c) ||
        (i === "up" &&
          Math.abs(n - (r.y + e.BLOCK_SIZE)) <= g.collisionGap &&
          c)
      )
        return !1;
    }
    return !0;
  }
  destroy() {
    window.removeEventListener("keyup", this.onKeyUp);
  }
  draw() {
    this.ctx.drawImage(
      e.getAsset(`pacman-${this.direction}`),
      this.playerState.getCoordinates.x,
      this.playerState.getCoordinates.y,
      e.BLOCK_SIZE,
      e.BLOCK_SIZE
    ),
      this.move();
  }
}
class K extends e {
  constructor(s) {
    super();
    o(this, "ctx");
    o(this, "entities", []);
    o(this, "renderId");
    o(this, "state");
    o(this, "paused", !1);
    o(this, "gameover", !1);
    o(this, "onGameOver");
    o(this, "start", async () => {
      await this.preloadAssets(),
        (this.entities = [
          new q({ ctx: this.ctx, state: this.state }),
          new F({ ctx: this.ctx, state: this.state }),
          new z({ ctx: this.ctx, state: this.state }),
        ]),
        (this.renderId = window.requestAnimationFrame(() => this.render())),
        this.state.registerGameover(() => {
          var s;
          (s = this.onGameOver) == null || s.apply(null),
            this.destroy(),
            (this.ctx.font = "50px Sans-serif"),
            (this.ctx.fillStyle = "white"),
            this.ctx.fillText(
              "Game Over !!!",
              Math.floor(e.CANVAS_SIZE.width / 2) - 150,
              e.CANVAS_SIZE.height / 2
            );
        });
    });
    (this.ctx = document.querySelector("canvas").getContext("2d")),
      (this.state = (s == null ? void 0 : s.state) || new A({})),
      (this.onGameOver = s == null ? void 0 : s.onGameover);
  }
  clearRect() {
    this.ctx.clearRect(0, 0, e.CANVAS_SIZE.width, e.CANVAS_SIZE.height);
  }
  render() {
    var s;
    if (!(this.paused || this.gameover)) {
      this.clearRect();
      for (const n of this.entities) (s = n.draw) == null || s.call(n);
      this.renderId = window.requestAnimationFrame(() => this.render());
    }
  }
  destroy() {
    var s;
    (this.gameover = !0), window.cancelAnimationFrame(this.renderId);
    for (const n of this.entities) (s = n.destroy) == null || s.call(n);
  }
  togglePause() {
    (this.paused = !this.paused), this.paused || this.render();
  }
}
var b = ((h) => ((h.GAME_INSTANCE = "GAME_INSTANCE"), h))(b || {}),
  B;
((h) => {
  function t(n, i, a) {
    let r = {};
    const c = { score: new Set(), wall: new Set(), energy: new Set() },
      d = {
        "ghost-red": [],
        "ghost-blue": [],
        "ghost-green": [],
        "ghost-yellow": [],
      };
    for (let [u, l] of n.entries()) {
      const [f, w] = u.split(",").map(Number);
      l === "pacman"
        ? (r = { x: f, y: w })
        : ["score", "wall", "energy"].includes(l)
        ? c[l].add(`${f},${w}`)
        : ["ghost-red", "ghost-blue", "ghost-green", "ghost-yellow"].includes(
            l
          ) && d[l].push({ x: f, y: w });
    }
    return (
      e.initConfig(),
      new K({
        state: new A({
          ghost: new L({
            "ghost-blue": d["ghost-blue"],
            "ghost-red": d["ghost-red"],
            "ghost-yellow": d["ghost-yellow"],
            "ghost-green": d["ghost-green"],
          }),
          player: new g({ coordinates: r, lives: a || 0 }),
          ground: new N({
            food: c.energy,
            pacman: r,
            score: c.score,
            walls: c.wall,
          }),
        }),
        onGameover: () => i(),
      })
    );
  }
  h.customGameInstance = t;
  async function s(n) {
    return JSON.parse(await n[0].text());
  }
  h.decodeConfig = s;
})(B || (B = {}));
document.addEventListener("DOMContentLoaded", () => {
  const h = window.location.search;
  if (!(h != null && h.startsWith("?creation"))) {
    if (h != null && h.startsWith("?custom-game")) {
      W();
      return;
    }
    P();
  }
});
function W() {
  try {
    const h = window.location.search.replace("?custom-game&", "");
    h.startsWith("config=") && e.setBlockSize(+h.split("=")[1]);
    const t = new Map(JSON.parse(sessionStorage.getItem(b.GAME_INSTANCE))),
      s = B.customGameInstance(
        t,
        () => {
          window.location.reload();
        },
        3
      );
    D(s), G(s), s.start();
  } catch {
    alert("Failed to load custom game"), P();
  }
}
function D(h) {
  e.window.pause = () => {
    h.togglePause();
    const t = e.window["toggle-pause"].innerHTML === "Pause";
    e.window["toggle-pause"].innerHTML = t ? "Resume" : "Pause";
  };
}
function G(h) {
  e.window.restart = (t) => {
    h.destroy(),
      setTimeout(() => {
        (h = new K({
          state: t
            ? new A({ player: new g({ lives: h.state.playerState.lives - 1 }) })
            : null,
        })),
          h.start();
      }, 500);
  };
}
function P() {
  let h = new K();
  h.start(), G(h), D(h);
}
export { e as C, b as S, B as U };
