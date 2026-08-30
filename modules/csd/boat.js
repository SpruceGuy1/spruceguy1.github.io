/**
 * Creates a boat element for the specified location and records its grid coordinates.
 * @param {Object} state - State containing the boat's location.
 * @param {Array<Object>} boat - Collection of boats to update.
 */
export function createBoat(state, boat) {
  $("#c" + state.loc).append(
    "<div class='boat origin-" + state.loc + "' id='boat-" + boat.length + "'>",
  );
  boat.push({
    origin: state.loc,
    id: boat.length,
    y: Math.floor(state.loc / 8),
    x: state.loc - Math.floor(state.loc / 8) * 8,
  });
  //$("#"+boat[boat.length-1].id).css(TO BE DETERMINED)
}
