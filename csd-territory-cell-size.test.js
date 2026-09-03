const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("csd.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");

assert.match(html, /<table class="country-sim-table">/);
assert.match(
  html,
  /<td class='territory-cell' id='c["']?\s*\+.*?<div class='territory-content' id='tc/s,
  "generated territory cells contain bounded content containers",
);
assert.match(css, /\.country-sim-table\s*{[^}]*table-layout:\s*fixed;/s);
assert.match(
  css,
  /\.fixtd \.country-sim-table \.territory-cell\s*{[^}]*width:\s*128px;[^}]*height:\s*128px;/s,
  "the selector matches generated territory cells and fixes both dimensions",
);
assert.match(
  css,
  /\.territory-content\s*{[^}]*height:\s*128px;[^}]*overflow:\s*hidden;/s,
);

for (const dynamicDestination of [
  '$("#tc" + t).append(" Allied with "',
  '$("#tc" + t).append(" Enemy of "',
  '$("#tc" + landNum).append("<div class=\'port\'>port</div>")',
]) {
  assert.ok(
    html.includes(dynamicDestination),
    `dynamic content uses the bounded container: ${dynamicDestination}`,
  );
}

console.log("territory cell size regression checks passed");
