const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const model = html.slice(
  html.indexOf("class Land"),
  html.indexOf("function randomColor"),
);
const context = { console };
vm.createContext(context);
vm.runInContext(`${model}\nthis.Land = Land; this.State = State;`, context);

function resetModel() {
  vm.runInContext("states = []; landOwners = [];", context);
  const attacker = new context.State("000000", "Attacker", 0);
  const defender = new context.State("ffffff", "Defender", 1);
  const secondDefender = new context.State("ff0000", "Second defender", 2);
  const capturedLand = new context.Land("Captured", 9);
  defender.land.push(capturedLand);
  defender.area = defender.land.length;
  context.states[0] = attacker;
  context.states[1] = defender;
  context.states[2] = secondDefender;
  context.landOwners[0] = 0;
  context.landOwners[1] = 1;
  context.landOwners[2] = 2;
  context.landOwners[9] = 1;
  return { attacker, defender, secondDefender, capturedLand };
}

const { attacker, defender, secondDefender, capturedLand } = resetModel();
assert.equal(attacker.annex(capturedLand), true);
assert.deepEqual(
  Array.from(attacker.land, (territory) => territory.num),
  [0, 9],
  "the selected land is transferred instead of the defender's origin",
);
assert.equal(attacker.area, 2);
assert.equal(defender.area, 1);
assert.equal(context.states[1], defender, "a defender with land survives");
assert.equal(context.landOwners[9], 0);

assert.equal(secondDefender.annex(capturedLand), true);
assert.equal(
  context.landOwners[9],
  2,
  "captured land can launch a later annexation",
);
assert.equal(attacker.area, 1);

assert.equal(attacker.annex(secondDefender.land[0]), true);
assert.equal(attacker.annex(capturedLand), true);
assert.equal(
  context.states[2],
  undefined,
  "the defender is removed after its last land",
);
assert.equal(attacker.area, 3);

console.log("annexation regression checks passed");
