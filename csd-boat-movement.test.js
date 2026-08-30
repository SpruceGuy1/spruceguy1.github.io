const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs
  .readFileSync("modules/csd/boat.js", "utf8")
  .replaceAll("export function", "function");
const parents = new Map();
const context = {
  Math,
  $(selector) {
    return {
      append(content) {
        const id = content.match(/id='([^']+)'/)[1];
        parents.set("#" + id, selector);
      },
      appendTo(destination) {
        parents.set(selector, destination);
      },
    };
  },
};
vm.createContext(context);
vm.runInContext(
  `${source}\nthis.createBoat = createBoat; this.moveBoat = moveBoat;`,
  context,
);

const boats = [];
const coastalLandNumbers = [0, 7, 63];
context.createBoat({ loc: 12 }, boats, 7);
const createdBoat = boats[0];

assert.equal(createdBoat.origin, 7, "the boat starts at its source port");
assert.equal(createdBoat.location, 7);
assert.equal(parents.get("#boat-0"), "#c7");

const destination = context.moveBoat(
  createdBoat,
  coastalLandNumbers,
  () => 0.9,
);
assert.ok(coastalLandNumbers.includes(destination));
assert.notEqual(destination, 7, "another available port is selected");
assert.equal(parents.get("#boat-0"), "#c63", "the DOM boat moves cells");
assert.equal(createdBoat.location, 63);
assert.equal(createdBoat.x, 7);
assert.equal(createdBoat.y, 7);
assert.equal(createdBoat.origin, 7, "movement preserves the source port");

const states = [{ loc: 0 }, undefined, { loc: 2 }];
assert.equal(states[1], undefined, "the fixture contains an eliminated state");
assert.doesNotThrow(() =>
  boats.forEach((currentBoat) =>
    context.moveBoat(currentBoat, coastalLandNumbers, () => 0),
  ),
);

console.log("boat movement regression checks passed");
