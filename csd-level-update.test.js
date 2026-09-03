const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const model = html.slice(
  html.indexOf("class Land"),
  html.indexOf("function randomColor"),
);
const loopStart = html.indexOf(
  "for (let j of states)",
  html.indexOf("leaderboard = [];"),
);
const loopEnd = html.indexOf("leaderboard.sort", loopStart);

assert.notEqual(loopStart, -1, "the level-update loop is present");
assert.notEqual(loopEnd, -1, "the level-update loop has a detectable end");

const levelUpdateLoop = html.slice(loopStart, loopEnd);
const context = { console };
vm.createContext(context);
vm.runInContext(
  `${model}
states = [];
var levels = Array(64).fill(1);
var leaderboard = [];
var activeState = new State("000000", "Active", 2);
activeState.gold = 350;
activeState.area = 2;
states[1] = undefined;
states[2] = activeState;
this.activeState = activeState;`,
  context,
);

assert.doesNotThrow(() =>
  vm.runInContext(
    `${levelUpdateLoop}\nthis.callbackContinued = true;`,
    context,
  ),
);
assert.equal(
  context.levels[2],
  3,
  "the active state's level updates from gold",
);
assert.deepEqual(Array.from(context.leaderboard), [context.activeState]);
assert.equal(
  context.callbackContinued,
  true,
  "the simulation callback continues",
);

console.log("level update regression checks passed");
