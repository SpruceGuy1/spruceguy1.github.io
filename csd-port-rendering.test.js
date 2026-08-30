const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const loopStart = html.indexOf("for (let landNum of coastalLandNumbers)");
const loopEnd = html.indexOf("console.info(leaderboard);", loopStart);

assert.notEqual(loopStart, -1, "the port loop uses coastalLandNumbers");
assert.notEqual(loopEnd, -1, "the port loop has a detectable end");

const portLoop = html.slice(loopStart, loopEnd);
const appendedCells = [];
const context = {
  coastalLandNumbers: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 47, 48, 55,
    56, 57, 58, 59, 60, 61, 62, 63,
  ],
  states: [{ loc: 0 }, undefined, { loc: 2 }],
  $(selector) {
    return {
      append(content) {
        assert.equal(content, "<div class='port'>port</div>");
        appendedCells.push(Number(selector.slice(2)));
      },
    };
  },
};

vm.createContext(context);
assert.doesNotThrow(() => vm.runInContext(portLoop, context));
assert.deepEqual(
  appendedCells.filter((landNum) => landNum >= 56),
  [56, 57, 58, 59, 60, 61, 62, 63],
  "every bottom-row coastal cell receives a port",
);

console.log("port rendering regression checks passed");
