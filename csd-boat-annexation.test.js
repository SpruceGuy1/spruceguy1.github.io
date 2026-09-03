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
this.handleBoatArrival = handleBoatArrival;`,
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

console.log("boat annexation regression checks passed");
