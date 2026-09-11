const test = require("node:test");
const assert = require("node:assert/strict");
const questions = require("./questions.json");
const { calculateReward, validateAnswer } = require("./rewards");

test("validates answers against the server-side question set", () => {
  assert.equal(
    validateAnswer(questions, "translation", "t0", "I am").correct,
    true,
  );
  assert.equal(
    validateAnswer(questions, "translation", "t0", "horse").correct,
    false,
  );
  assert.equal(
    validateAnswer(questions, "translation", "missing", "I am").correct,
    false,
  );
  assert.equal(
    validateAnswer(questions, "__proto__", "t0", "I am").correct,
    false,
  );
});

test("awards each question only once and derives XP from completions", () => {
  const question = questions.translation.find(({ id }) => id === "t12");
  const firstReward = calculateReward([], question);
  assert.deepEqual(firstReward, {
    awarded: true,
    completedQuestionIds: ["t12"],
    xp: 1,
    ingotsAwarded: 2,
  });

  const repeatedReward = calculateReward(
    firstReward.completedQuestionIds,
    question,
  );
  assert.equal(repeatedReward.awarded, false);
  assert.equal(repeatedReward.xp, 1);
  assert.equal(repeatedReward.ingotsAwarded, 0);
});
