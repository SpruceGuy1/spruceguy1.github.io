const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const model = html.slice(
  html.indexOf("class Land"),
  html.indexOf("function randomColor"),
);
const generation = html.slice(
  html.indexOf("function generateCountry30Gold"),
  html.indexOf("function getNeighboringCellIndices"),
);
const displayedGold = [];
const context = {
  console,
  $(selector) {
    assert.equal(selector, "#g");
    return {
      text(value) {
        displayedGold.push(value);
      },
    };
  },
};
vm.createContext(context);
vm.runInContext(
  `var states = [];
var landOwners = [];
${model}
var levels = Array(64).fill(1);
${generation}
this.Land = Land;
this.State = State;
this.states = states;
this.landOwners = landOwners;
this.generateCountry30Gold = generateCountry30Gold;`,
  context,
);

const sender = new context.State("000000", "Sender", 0);
const ally = new context.State("ffffff", "Ally", 1);
const nonAlly = new context.State("ff0000", "Non-ally", 2);
const country30 = new context.State("00ff00", "Country 30", 30);
context.states[0] = sender;
context.states[1] = ally;
context.states[2] = nonAlly;
context.states[30] = country30;

assert.equal(sender.gold, 0, "new states start with no gold");
context.generateCountry30Gold();
assert.equal(country30.gold, 1, "Country 30 receives generated gold");
assert.equal(sender.gold, 0, "generation does not credit another state");
assert.equal(displayedGold.at(-1), 1);

sender.ally(ally);
sender.gold = 10;
assert.equal(sender.transferGold(ally, 4), true);
assert.equal(sender.gold, 6);
assert.equal(ally.gold, 4);

assert.equal(sender.transferGold(nonAlly, 1), false);
assert.equal(sender.gold, 6, "a non-allied transfer does not debit gold");
assert.equal(nonAlly.gold, 0, "a non-allied transfer does not credit gold");

assert.equal(sender.transferGold(ally, 7), false);
assert.equal(sender.gold, 6, "an excessive transfer does not debit gold");
assert.equal(ally.gold, 4, "an excessive transfer does not credit gold");

context.states[1] = undefined;
assert.equal(sender.transferGold(ally, 1), false);
assert.equal(sender.gold, 6, "an eliminated ally cannot receive gold");
assert.equal(ally.gold, 4);

const defender = new context.State("0000ff", "Defender", 3);
const capturedLand = new context.Land("Captured", 9);
defender.land.push(capturedLand);
defender.area = defender.land.length;
defender.gold = 8;
context.states[3] = defender;
context.landOwners[3] = 3;
context.landOwners[9] = 3;
assert.equal(sender.annex(capturedLand), true);
assert.equal(defender.gold, 8, "annexation preserves a surviving state's gold");

console.log("gold transfer regression checks passed");
