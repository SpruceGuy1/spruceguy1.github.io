const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const model = html.slice(
  html.indexOf("class Land"),
  html.indexOf("function randomColor"),
);
const arrival = html.slice(
  html.indexOf("function handleBoatArrival"),
  html.indexOf('$("td").click', html.indexOf("function handleBoatArrival")),
);
const rendered = new Map();
const context = {
  console,
  $(selector) {
    return {
      css(property, value) {
        rendered.set(selector + ":" + property, value);
      },
      text(value) {
        rendered.set(selector + ":text", value);
      },
    };
  },
};
vm.createContext(context);
vm.runInContext(
  `var states = [];
var landOwners = [];
${model}
var land = [];
${arrival}
this.Land = Land;
this.State = State;
this.states = states;
this.landOwners = landOwners;
this.land = land;
this.handleBoatArrival = handleBoatArrival;
this.handleBoatArrivalAction = handleBoatArrivalAction;`,
  context,
);

function addState(name, loc, landNumbers, alliances = []) {
  const state = new context.State(loc.toString(16).padStart(6, "0"), name, loc);
  state.land = landNumbers.map((landNum) => {
    const territory = new context.Land(`${name} ${landNum}`, landNum);
    context.land[landNum] = territory;
    context.landOwners[landNum] = loc;
    return territory;
  });
  state.area = state.land.length;
  state.alliances = alliances;
  context.states[loc] = state;
  return state;
}

function resetModel() {
  vm.runInContext("states = []; landOwners = []; land = [];", context);
  rendered.clear();
}

resetModel();
const attacker = addState("Attacker", 12, [7]);
const defender = addState("Defender", 4, [8, 63]);
const boat = { state: attacker, location: 63 };
assert.equal(context.handleBoatArrival(boat, 63), true);
assert.equal(attacker.area, 2);
assert.equal(defender.area, 1);
assert.equal(
  context.states[4],
  defender,
  "a defender with other land survives",
);
assert.equal(context.landOwners[63], 12);
assert.equal(rendered.get("#c63:background"), "#00000c");
assert.match(rendered.get("#tc63:text"), /Annexed by Attacker/);

assert.equal(context.handleBoatArrival(boat, 8), true);
assert.equal(attacker.area, 3);
assert.equal(defender.area, 0);
assert.equal(
  context.states[4],
  undefined,
  "the last-land defender is eliminated",
);
assert.equal(context.landOwners[8], 12);

resetModel();
const alliedAttacker = addState("Allied attacker", 2, [0], [3]);
const ally = addState("Ally", 3, [1]);
assert.equal(
  context.handleBoatArrival({ state: alliedAttacker }, 1),
  false,
  "an allied destination is rejected",
);
assert.equal(context.landOwners[1], 3);
assert.equal(ally.area, 1);

context.states[2] = undefined;
assert.equal(
  context.handleBoatArrival({ state: alliedAttacker }, 1),
  false,
  "an eliminated boat owner cannot annex",
);

context.states[2] = alliedAttacker;
context.landOwners[1] = 30;
assert.doesNotThrow(() =>
  context.handleBoatArrival({ state: alliedAttacker }, 1),
);
assert.equal(
  context.handleBoatArrival({ state: alliedAttacker }, 1),
  false,
  "a missing destination owner is rejected",
);

resetModel();
const transferAttacker = addState("Transfer attacker", 12, [7]);
const transferDefender = addState("Transfer defender", 4, [63, 8]);
transferAttacker.gold = 0.25;
transferDefender.gold = 5;
const transferArea = transferDefender.area;
assert.equal(
  context.handleBoatArrivalAction({ state: transferAttacker }, 63, () => 0.49),
  true,
);
assert.equal(transferAttacker.gold, 0);
assert.equal(transferDefender.gold, 5.25);
assert.equal(transferAttacker.gold + transferDefender.gold, 5.25);
assert.equal(rendered.get("#g12:text"), 0);
assert.equal(rendered.get("#g4:text"), 5.25);
assert.equal(context.landOwners[63], 4, "gold transfer does not annex land");
assert.equal(transferDefender.area, transferArea);

resetModel();
const exactAttacker = addState("Exact attacker", 12, [7]);
const exactDefender = addState("Exact defender", 4, [63, 8]);
exactAttacker.gold = 2;
exactDefender.gold = 3;
assert.equal(
  context.handleBoatArrivalAction({ state: exactAttacker }, 63, () => 0.5),
  true,
);
assert.equal(context.landOwners[63], 12, "a 0.5 roll attempts annexation");
assert.equal(exactAttacker.gold, 2, "annexation does not debit gold");
assert.equal(exactDefender.gold, 3, "annexation does not credit gold");

resetModel();
const highAttacker = addState("High attacker", 12, [7]);
const highDefender = addState("High defender", 4, [63, 8]);
assert.equal(
  context.handleBoatArrivalAction({ state: highAttacker }, 63, () => 0.9),
  true,
);
assert.equal(context.landOwners[63], 12, "a roll above 0.5 annexes");
assert.equal(highAttacker.area, 2, "only one annexation is performed");
assert.equal(highDefender.area, 1);

resetModel();
const inactiveAttacker = addState("Inactive attacker", 12, [7]);
const activeDefender = addState("Active defender", 4, [63]);
inactiveAttacker.gold = 2;
activeDefender.gold = 3;
context.states[12] = undefined;
assert.equal(
  context.handleBoatArrivalAction({ state: inactiveAttacker }, 63, () => 0.1),
  false,
);
assert.equal(inactiveAttacker.gold, 2);
assert.equal(activeDefender.gold, 3);
assert.equal(
  context.handleBoatArrivalAction({ state: inactiveAttacker }, 63, () => 0.9),
  false,
);
assert.equal(context.landOwners[63], 4, "an inactive source cannot annex");

context.states[12] = inactiveAttacker;
context.states[4] = undefined;
assert.equal(
  context.handleBoatArrivalAction({ state: inactiveAttacker }, 63, () => 0.1),
  false,
);
assert.equal(inactiveAttacker.gold, 2);
assert.equal(activeDefender.gold, 3, "an inactive destination receives no gold");
assert.equal(
  context.handleBoatArrivalAction({ state: inactiveAttacker }, 63, () => 0.9),
  false,
);
assert.equal(context.landOwners[63], 4, "an inactive destination is not annexed");

console.log("boat annexation regression checks passed");
