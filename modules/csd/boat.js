/**
 * Creates a boat element for the specified location and records its grid coordinates.
 * @param {Object} state - State that owns the boat.
 * @param {Array<Object>} boat - Collection of boats to update.
 * @param {number} portLandNum - Initial port cell owned by the state.
 */
export function createBoat(state, boat, portLandNum) {
  $("#c" + portLandNum).append(
    "<div class='boat origin-" + state.loc + "' id='boat-" + boat.length + "'>",
  );
  boat.push({
    origin: portLandNum,
    id: boat.length,
    location: portLandNum,
    ownerLoc: state.loc,
    gold: 0,
    y: Math.floor(portLandNum / 8),
    x: portLandNum % 8,
  });
}

/**
 * Loads one gold from the boat's active owner.
 * @returns {Object|undefined} The state that supplied the gold.
 */
export function loadBoatGold(currentBoat, states) {
  var owner = states[currentBoat.ownerLoc];
  if (
    !owner ||
    owner.loc !== currentBoat.ownerLoc ||
    currentBoat.gold !== 0 ||
    owner.gold < 1
  ) {
    return undefined;
  }

  owner.gold -= 1;
  currentBoat.gold = 1;
  return owner;
}

/**
 * Delivers the boat's cargo to the active owner of its current port.
 * @returns {Object|undefined} The state that received the cargo.
 */
export function deliverBoatGold(currentBoat, states, landOwners) {
  var destinationOwnerLoc = landOwners[currentBoat.location];
  var destinationOwner = states[destinationOwnerLoc];
  if (
    !destinationOwner ||
    destinationOwner.loc !== destinationOwnerLoc ||
    currentBoat.gold <= 0
  ) {
    return undefined;
  }

  destinationOwner.gold += currentBoat.gold;
  currentBoat.gold = 0;
  return destinationOwner;
}

/**
 * Moves a boat to a randomly selected coastal port.
 * @param {Object} currentBoat - Boat model to move.
 * @param {Array<number>} coastalLandNumbers - Available port cells.
 * @param {Function} random - Random number generator used to select a port.
 * @returns {number|undefined} The selected destination cell.
 */
export function moveBoat(
  currentBoat,
  coastalLandNumbers,
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
  $("#boat-" + currentBoat.id).appendTo("#c" + destination);
  currentBoat.location = destination;
  currentBoat.y = Math.floor(destination / 8);
  currentBoat.x = destination % 8;
  return destination;
}
