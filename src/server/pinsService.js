import {
  createConnectionSuggestion,
  getAllPins,
  getConnections,
  getPastPins,
  getPinAttendees,
  updatePin,
} from './database.js';

const PIN_SCAN_INTERVAL = 1000 * 60 * 10; // 10 minutes

/**
 * Handle expired pin attendee
 * @param {import('./database.js').PinAttendee} attendee
 * @param {import('./database.js').PinAttendee[]} pinAttendees
 */
async function handlePinAttendee(attendee, pinAttendees) {
  const existingConnections = await getConnections(attendee.userID);

  await Promise.all(
    pinAttendees
      .filter((a) => !existingConnections.find((c) => c.userID === a.userID))
      .map((a) =>
        createConnectionSuggestion({
          userID: attendee.userID,
          targetID: a.userID,
        }),
      ),
  );
}

/**
 * Handle expired pin
 * @param {import('./database.js').Pin} pin
 */
async function handleExpiredPin(pin) {
  console.log(`Handling pin (pinID = ${pin.pinID})`);
  const pinAttendees = await getPinAttendees(pin.pinID);

  /**
   * @type {Promise<any>[]}
   */
  const promises = [updatePin(pin)];

  pinAttendees.forEach((pA) =>
    promises.push(handlePinAttendee(pA, pinAttendees)),
  );

  await Promise.all(promises);
}

async function scanForExpiredPins() {
  console.log('Scanning for expired pins..');
  const pastPins = await getPastPins(Date.now() - 1000 * 60 * 60 * 12);

  const recentlyExpiredPins = [];

  for (const pin of pastPins) {
    if (!pin.active) {
      break;
    }

    pin.active = false;
    recentlyExpiredPins.push(pin);
  }

  console.log(`Found ${recentlyExpiredPins.length} expired pins`);

  await Promise.all(recentlyExpiredPins.map((pin) => handleExpiredPin(pin)));
}

export default function startPinsService() {
  setInterval(() => scanForExpiredPins(), PIN_SCAN_INTERVAL);
}
