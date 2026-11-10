function getNeighbors(index,pgs){
  const neighbors = [];
  const row = Math.floor(index / pgs);
  const col = index % pgs;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (
        r >= 0 &&
        r < pgs &&
        c >= 0 &&
        c < pgs &&
        !(r === row && c === col)
        && Math.abs(r-row) + Math.abs(c-col) <= 1
      ) {
        neighbors.push(r * pgs + c);
      }
    }
  }

  return neighbors;
}
console.log(getNeighbors(4, 4));