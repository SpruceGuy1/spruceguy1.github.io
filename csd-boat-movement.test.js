const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs
  .readFileSync("modules/csd/boat.js", "utf8")
  .replaceAll("export function", "function");
const parents = new Map();
const displayedText = new Map();
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
      text(value) {
        displayedText.set(selector, value);
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
const owner = { loc: 12, gold: 0.25, land: [{ num: 7 }] };
const recipient = { loc: 4, gold: 5, land: [{ num: 63 }] };
const states = [];
const landOwners = [];
states[4] = recipient;
states[12] = owner;
landOwners[7] = 12;
landOwners[63] = 4;
context.createBoat(owner, boats, 7);
const createdBoat = boats[0];

assert.equal(createdBoat.origin, 7, "the boat starts at its source port");
assert.equal(createdBoat.location, 7);
assert.equal(parents.get("#boat-0"), "#tc7");

const destination = context.moveBoat(
  createdBoat,
  coastalLandNumbers,
  states,
  landOwners,
  (() => {
    const values = [0.9, 0];
    return () => values.shift();
  })(),
);
assert.ok(coastalLandNumbers.includes(destination));
assert.notEqual(destination, 7, "another available port is selected");
assert.equal(parents.get("#boat-0"), "#tc63", "the DOM boat moves cells");
assert.equal(createdBoat.location, 63);
assert.equal(createdBoat.x, 7);
assert.equal(createdBoat.y, 7);
assert.equal(createdBoat.origin, 7, "movement preserves the source port");
assert.equal(owner.gold, 0, "the transfer is bounded by the owner's balance");
assert.equal(
  recipient.gold,
  5.25,
  "the active port owner receives the transfer",
);
assert.equal(owner.gold + recipient.gold, 5.25, "the transfer conserves gold");
assert.equal(displayedText.get("#g12"), 0);
assert.equal(displayedText.get("#g4"), 5.25);

states[12] = undefined;
assert.equal(states[1], undefined, "the fixture contains an eliminated state");
assert.doesNotThrow(() =>
  boats.forEach((currentBoat) =>
    context.moveBoat(currentBoat, coastalLandNumbers, states, landOwners, () =>
      0,
    ),
  ),
);
assert.equal(recipient.gold, 5.25, "an eliminated owner cannot send gold");

console.log("boat movement regression checks passed");
