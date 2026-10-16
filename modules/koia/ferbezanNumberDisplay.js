var data = [
  ["sero", "-", "-", "numk\u02b7am", "-", "-", "-", "-", "-", "momenton"],
  [
    "une",
    "prime",
    "oltimate",
    "semel",
    "siñgule",
    ["mono-", "uni-"],
    "integre",
    "proto-",
    "solo",
    "ane",
  ],
  [
    "duwo",
    "sekonde",
    "penoltimate",
    "bis",
    "duple",
    ["di-", "duwo-", "bi-"],
    "seme",
    "dutero-",
    ["duwo", "duwet", "dijade"],
    "bijene",
  ],
  [
    "tres",
    "terše",
    "antepenoltimate",
    "ter",
    "tripleks",
    "tri-",
    "terter",
    "trito-",
    "trijo",
    "trijene",
  ],
  [
    "k\u02b7ator",
    "k\u02b7arte",
    "prëantepenoltimate",
    "k\u02b7ater",
    "k\u02b7arupule",
    ["tetra-", "tesera-", "k\u02b7adri-"],
    "k\u02b7adrants",
    "tetarto-",
    "k\u02b7artete",
    "Olímpijade",
  ],
  [
    "k\u02b7iñk\u02b7e",
    "k\u02b7inte",
    "proprëantepenoltimate",
    "k\u02b7inter",
    "k\u02b7intupule",
    ["penta-", "k\u02b7iñk\u02b7e-", "k\u02b7inti-"],
    "k\u02b7intants",
    "-",
    "k\u02b7intete",
    "lustron",
  ],
  [
    "sek",
    "seste",
    "-",
    "sekster",
    "sestupule",
    ["sëksa-", "ësa-", "ëksa-"],
    "sekstants",
    "-",
    "sestete",
    "sesene",
  ],
];
var schema = [
  "Cardinal",
  "Ordinal",
  "Reverse Ordinal",
  "Repetition (time)",
  "Multiplication/Repetition",
  "Prefix",
  "Fractional",
  "Greek ordinal prefix",
  "Group of people",
  "Years",
];
function display(num, $element, $) {
  /* var retval = "";
  $element.append("<div id='dynamicFND'></div>");
  retval += "<h3>" + num + "</h3>";*/
  var ind = 0;
  var $container = $("<div></div>");
  $container.append("<h3>" + num + "</h3>");
  $element.append($container);
  for (let i of data[num]) {
    var thing = data[num][ind];
    if (Array.isArray(thing)) {
      thing = thing.join(", ");
    }
    $container.append(`<b>${schema[ind]}</b>: ${thing}<br>`);
    ind++;
  }
}
export { display };
