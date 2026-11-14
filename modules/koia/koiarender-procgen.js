import { Scene, render, animate } from "../../koia/renderer.js";
// see 'krpg.txt' for compression stuff
class Scheme {
  constructor(json) {
    this.json = json;
  }
}
function asciiToHexLoop(str) {
  let hexResult = "";
  for (let i = 0; i < str.length; i++) {
    const hex = str.charCodeAt(i).toString(16);
    // Pad single-digit hex results with a leading zero
    hexResult += (hex.length < 2 ? "0" + hex : hex).toUpperCase();
  }
  return hexResult;
}
function compressedToScheme(compressed) {
  return new Scheme();
}
function compressScheme(scheme) {
  if (!scheme || !(scheme instanceof Scheme)) {
    console.error(
      "To compress a Scheme for rendering Scenes, it must be a Scheme object that is not empty.",
    );
    return 0x0005;
  }
  var retval = "";
  var name = scheme.json.name;
  var parts = scheme.json.parts;
  var base = scheme.json.base;
  var index = 0x00;
  retval += "00ff00fd" + asciiToHexLoop(name) + "fb"; //define name
  index++;
  for (var i of parts) {
    retval +=
      "00ff" +
      index.toString(16).padStart(2, "0") +
      "fd" +
      i.id.toString(16).padStart(2, "0") +
      "fb"; //define id
    index++;
    var type = i.render.type;
    var num = "00"; //default to point
    if (type == "line") {
      num = "01";
    }
    if (type == "area") {
      num = "02";
    }
    retval += "00ff" + index.toString(16).padStart(2, "0") + "fd" + num + "fb"; // define type
    index++;
    var size = i.render.size;
    var sizestr =
      size[0].toString(16).padStart(2, "0") +
      "fe" +
      size[1].toString(16).padStart(2, "0"); // [1,1] > "01fe01"
    retval +=
      "00ff" + index.toString(16).padStart(2, "0") + "fd" + sizestr + "fb"; // define size
    index++;
    var color = i.render.color;
    var colorstr = color.slice(1); // remove the '#' from the color string
    retval +=
      "00ff" + index.toString(16).padStart(2, "0") + "fd" + colorstr + "fb"; // define color

    index++;
    var expandTo = i.render.expandTo; // a decimal number
    var expandToHex = expandTo.toString(16).padStart(2, "0"); // convert to hex and pad with leading zero if necessary
    retval += "fcfd000000" + expandToHex + "fb"; // define expansion
    var expansionOffset = i.render.expansionOffset; // an array of two numbers that can be negative
    function toHex(num) {
      if (num >= 0) {
        return num.toString(16).padStart(2, "0");
      } else {
        return "fa" + Math.abs(num).toString(16).padStart(2, "0"); // prefix with 'fa' for negative numbers
      }
    }
    var expansionOffsetStr =
      toHex(expansionOffset[0]) + "fe" + toHex(expansionOffset[1]); // convert each number to hex and join with 'fe'
    retval +=
      "00ff" +
      index.toString(16).padStart(2, "0") +
      "fd" +
      expansionOffsetStr +
      "fb"; // define expansionOffset
    index++;
  }
  var baseHex = base.toString(16).padStart(2, "0"); // convert to hex and pad with leading zero if necessary
  retval +=
    "00ff" + index.toString(16).padStart(2, "0") + "fd" + baseHex + "fb"; // define base
  /*for(var i in scheme.json.parts){

    }*/
  return retval;
}
function compressedToScene(compressed, scheme) {
  if (!scheme || !(scheme instanceof Scheme)) {
    console.error(
      "To create a renderable Scene from compressed data, a Scheme must be included to explain how the Scene renders and expands.",
    );
    return 0x0006;
  }
  return new Scene();
}
function compressScene(scene) {
  if (!scene || !(scene instanceof Scene)) {
    console.error(
      "To compress a Scene for storage, it must be a Scene object that is not empty.",
    );
    return 0x0006;
  }
  return 0x0001; //Placeholder
}
function progressScene(scene) {
  if (!scene || !scene.sch) {
    console.error(
      "The scene is corrupted, since scenes have '0001' as their scheme by default.",
    );
    return 0x0006;
  }
  var prop, ref, change, cs;
  scene.animate(prop, ref, change, cs);
}
export {
  Scheme,
  compressedToScheme,
  compressScheme,
  compressedToScene,
  compressScene,
  progressScene,
};
