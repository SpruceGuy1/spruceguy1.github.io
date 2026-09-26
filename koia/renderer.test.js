const assert = require("node:assert");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(__dirname + "/renderer.js", "utf8");
const moduleSource = source.replace(
  /export\s*\{[\s\S]*?\};\s*export\s+default\s+render;?\s*$/,
  "",
);

const context = {
  console,
  window: { devicePixelRatio: 1 },
  document: {
    createElement(tag) {
      if (tag !== "canvas") throw new Error(`Unexpected tag: ${tag}`);
      return {
        width: 0,
        height: 0,
        style: {},
        attributes: {},
        clientWidth: 600,
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
        replaceChildren(node) {
          this.child = node;
        },
        getContext() {
          return context.canvasContext;
        },
      };
    },
  },
  Image: class {
    constructor() {
      this.naturalWidth = 10;
      this.naturalHeight = 12;
    }
    set src(value) {
      this._src = value;
      this.onload();
    }
  },
  canvasContext: {
    scale() {},
    fillRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    drawImage(...args) {
      this._drawImageArgs = args;
    },
    fill() {},
    stroke() {},
    closePath() {},
    set fillStyle(value) {
      this._fillStyle = value;
    },
    get fillStyle() {
      return this._fillStyle;
    },
    set strokeStyle(value) {
      this._strokeStyle = value;
    },
    get strokeStyle() {
      return this._strokeStyle;
    },
    set lineWidth(value) {
      this._lineWidth = value;
    },
    get lineWidth() {
      return this._lineWidth;
    },
  },
};
context.canvasContext._fillStyle = "#ffffff";

vm.createContext(context);
vm.runInContext(moduleSource, context);

const render = context.render;
const animate = context.animate;
const el = {
  clientWidth: 600,
  replaceChildren(node) {
    this.child = node;
  },
};
const scene = {
  "kr-type": "2d-color",
  "kr-data": {
    points: [
      {
        ref: 0,
        x: 0,
        y: 0,
        image: { src: "/Riggy.png", width: 16, height: 18 },
      },
      { ref: 1, x: 0, y: 1 },
      { ref: 2, x: 1, y: 1 },
      { ref: 3, x: 1, y: 0 },
    ],
    lines: [{ color: "#000000", points: [0, 1, 2, 3, 0] }],
    areas: [{ color: "#00ff00", points: [1, 2, 3] }],
  },
};

assert.doesNotThrow(() => render(el, scene));
assert.equal(context.canvasContext._fillStyle, "#00ff00");
assert.equal(context.canvasContext._drawImageArgs[0]._src, "/Riggy.png");
assert.equal(context.canvasContext._drawImageArgs[1], 16);
assert.equal(context.canvasContext._drawImageArgs[2], 567);
assert.equal(context.canvasContext._drawImageArgs[3], 16);
assert.equal(context.canvasContext._drawImageArgs[4], 18);

const movedScene = animate("x", 0, 3, "add", scene);
assert.equal(movedScene, scene);
assert.equal(scene["kr-data"].points[0].x, 3);
assert.equal(
  animate("color", 1, "#ff0000", "tp", scene)["kr-data"].points[1].color,
  "#ff0000",
);
assert.equal(animate("x", 99, 3, "add", scene), scene);
