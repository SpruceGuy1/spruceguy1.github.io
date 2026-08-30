const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const model = html.slice(
  html.indexOf("class Land"),
  html.indexOf("function randomColor"),
);
const restoration = html.slice(
  html.indexOf("function isValidLand"),
  html.indexOf("function createGameStatePayload"),
);
const elements = new Map();

function $(selector) {
  if (!elements.has(selector)) {
    elements.set(selector, { text: "", styles: {} });
  }
  const element = elements.get(selector);
  return {
    text(value) {
      if (value === undefined) {
        return element.text;
      }
      element.text = String(value);
      return this;
    },
    css(property, value) {
      element.styles[property] = value;
      return this;
    },
  };
}

const context = { console, $ };
vm.createContext(context);
vm.runInContext(
  `${model}
const GAME_STATE_VERSION = 1;
var names = [];
var year = 1;
var c30g = 0;
${restoration}
this.applyGameState = applyGameState;
this.getClickedOwner = (landNum) => states[landOwners[landNum]];`,
  context,
);

const payload = {
  version: 1,
  states: [],
  land: [],
  year: 42,
  gold: 7,
  alliances: Array.from({ length: 64 }, () => []),
};

for (let landNum = 0; landNum < 64; landNum++) {
  const initialName = `Initial ${landNum}`;
  const restoredName = `Restored ${landNum}`;
  const color = landNum.toString(16).padStart(6, "0");
  $("#c" + landNum).text(initialName);
  payload.land.push({ name: restoredName, num: landNum });
  payload.states.push({
    color,
    name: restoredName,
    loc: landNum,
    area: 1,
    land: [{ name: restoredName, num: landNum }],
  });
}

assert.equal(context.applyGameState(payload), true);

const landNum = 12;
assert.equal($("#c" + landNum).text(), payload.land[landNum].name);
assert.equal(
  context.getClickedOwner(landNum).name,
  payload.states[landNum].name,
  "the click lookup uses the owner of the same restored land cell",
);
assert.equal(
  elements.get("#c" + landNum).styles.background,
  "#" + payload.states[landNum].color,
);

console.log("restored name display regression checks passed");
