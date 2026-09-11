const { copyFileSync } = require("node:fs");
const { join } = require("node:path");

const functionsDirectory = join(__dirname, "..");
copyFileSync(
  join(functionsDirectory, "..", "ferbingo", "questions.json"),
  join(functionsDirectory, "questions.json"),
);
