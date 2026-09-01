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
  `${source}
this.createBoat = createBoat;
this.loadBoatGold = loadBoatGold;
this.deliverBoatGold = deliverBoatGold;
this.moveBoat = moveBoat;`,
  context,
);

const boats = [];
const coastalLandNumbers = [0, 7, 63];
context.createBoat({ loc: 12 }, boats, 7);
const createdBoat = boats[0];

assert.equal(createdBoat.origin, 7, "the boat starts at its source port");
assert.equal(createdBoat.location, 7);
assert.equal(createdBoat.ownerLoc, 12);
assert.equal(createdBoat.gold, 0);
assert.equal(parents.get("#boat-0"), "#c7");

const owner = { loc: 12, name: "Owner", gold: 3 };
const recipient = { loc: 4, name: "Recipient", gold: 5 };
const states = [];
states[4] = recipient;
states[12] = owner;
const landOwners = [];
landOwners[63] = 4;
const initialTotal = owner.gold + recipient.gold + createdBoat.gold;

assert.equal(context.loadBoatGold(createdBoat, states), owner);
assert.equal(owner.gold, 2, "loading debits the active owner");
assert.equal(createdBoat.gold, 1, "the loaded gold becomes boat cargo");
assert.equal(owner.gold + recipient.gold + createdBoat.gold, initialTotal);

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
assert.equal(
  context.deliverBoatGold(createdBoat, states, landOwners),
  recipient,
);
assert.equal(recipient.gold, 6, "the destination-port owner receives cargo");
assert.equal(createdBoat.gold, 0, "delivered cargo leaves the boat");
assert.equal(owner.gold + recipient.gold + createdBoat.gold, initialTotal);

states[12] = undefined;
assert.equal(context.loadBoatGold(createdBoat, states), undefined);
assert.equal(createdBoat.gold, 0, "an eliminated owner cannot load cargo");

createdBoat.gold = 1;
landOwners[createdBoat.location] = 4;
assert.equal(
  context.deliverBoatGold(createdBoat, states, landOwners),
  recipient,
  "a loaded boat can deliver after its owner is eliminated",
);
assert.equal(createdBoat.gold, 0);

createdBoat.gold = 1;
landOwners[createdBoat.location] = 9;
assert.doesNotThrow(() =>
  context.deliverBoatGold(createdBoat, states, landOwners),
);
assert.equal(createdBoat.gold, 1, "cargo is retained without an active owner");

assert.equal(states[1], undefined, "the fixture contains an eliminated state");
assert.doesNotThrow(() =>
  boats.forEach((currentBoat) =>
    context.moveBoat(currentBoat, coastalLandNumbers, () => 0),
  ),
);

console.log("boat movement regression checks passed");
