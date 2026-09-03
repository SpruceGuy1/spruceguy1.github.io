/**
 * Creates a boat element for the specified location and records its grid coordinates.
 * @param {Object} state - State that owns the boat.
 * @param {Array<Object>} boat - Collection of boats to update.
 * @param {number} portLandNum - Initial port cell owned by the state.
 */
export function createBoat(state, boat, portLandNum) {
  $("#tc" + portLandNum).append(
    "<div class='boat origin-" + state.loc + "' id='boat-" + boat.length + "'>",
  );
  boat.push({
    origin: portLandNum,
    id: boat.length,
    location: portLandNum,
    y: Math.floor(portLandNum / 8),
    x: portLandNum % 8,
    state: state,
  });
}

/**
 * Moves a boat to a randomly selected coastal port.
 * @param {Object} currentBoat - Boat model to move.
 * @param {Array<number>} coastalLandNumbers - Available port cells.
 * @param {Array<Object>} states - Active states indexed by their original location.
 * @param {Array<number>} landOwners - State locations indexed by land cell.
 * @param {Function} random - Random number generator used to select a port.
 * @returns {number|undefined} The selected destination cell.
 */
export function moveBoat(
  currentBoat,
  coastalLandNumbers,
  states,
  landOwners,
  random = Math.random,
) {
  var destinations = coastalLandNumbers;
  if (coastalLandNumbers.length > 1) {
    destinations = coastalLandNumbers.filter(
      (landNum) => landNum !== currentBoat.location,
    );
  }
  if (destinations.length === 0) {
    return undefined;
  }

  var destination = destinations[Math.floor(random() * destinations.length)];
  $("#boat-" + currentBoat.id).appendTo("#tc" + destination);
  currentBoat.location = destination;
  currentBoat.y = Math.floor(destination / 8);
  currentBoat.x = destination % 8;
  return destination;
}
