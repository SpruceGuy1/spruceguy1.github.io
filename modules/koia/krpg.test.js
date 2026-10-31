import { Scheme, compressScheme } from "./koiarender-procgen.js";
var testScheme = new Scheme({
  name: "Expander",
  parts: [
    {
      id: 0, //(hex to decimal)
      render: {
        type: "area",
        size: [1, 1],
        color: "#000000",
        expandTo: 18302628889895108608, //(hex to decimal, a 3x3 block of 0x00s)
        expansionOffset: [-1, -1], //(center the 3x3 block on the original 1x1 block)
      },
    },
  ],
  base: 0, //(hex to decimal, 0x00)
});
var compressedScheme = compressScheme(testScheme);
if (
  compressedScheme ==
  "00ff00fd457870616E646572fb00ff01fd00fb00ff02fd02fb00ff03fd01fe01fb00ff04fd000000fbfcfd000000fe000000fe000000fb00ff05fdfa01fefa01fb00ff06fd00fb"
) {
  console.log("Scheme compression test passed.");
} else {
  console.error(
    "Scheme compression test failed. Expected: 00ff00fd457870616E646572fb00ff01fd00fb00ff02fd02fb00ff03fd01fe01fb00ff04fd000000fbfcfd000000fe000000fe000000fb00ff05fdfa01fefa01fb00ff06fd00fb, got: " +
      compressedScheme,
  );
}
