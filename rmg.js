export function RMG() {
  var terrainTypes = ["g", "m", "w", "f"];
  var map = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i <= 15; i++) {
    for (let j = 0; j <= 15; j++) {
      map[i].push(
        terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
      );
    }
  }
  return map;
}
