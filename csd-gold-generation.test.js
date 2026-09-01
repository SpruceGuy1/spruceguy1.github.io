const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("csd.html", "utf8");
const generation = html.slice(
  html.indexOf("function generateGold"),
  html.indexOf("function generateCountry30Gold"),
);
const displayedText = new Map();
const context = {
  landOwners: [],
  levels: Array(64).fill(1),
  states: [],
  State: class State {},
  $(selector) {
    return {
      text(value) {
        displayedText.set(selector, value);
      },
    };
  },
};
vm.createContext(context);
vm.runInContext(`${generation}\nthis.generateGold = generateGold;`, context);

const owner = new context.State();
owner.loc = 3;
owner.gold = 2;
owner.alliances = [];
context.states[3] = owner;
context.landOwners[22] = 3;

assert.doesNotThrow(() => context.generateGold(22));
assert.equal(owner.gold, 3, "gold is credited to the land cell's owner");
assert.equal(displayedText.get("#g3"), 3);
assert.equal(context.generateGold(23), false, "unowned land is ignored safely");

console.log("gold generation regression checks passed");
