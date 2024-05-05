import { Router } from 'express';
import {
  addPinAttendee,
  createPin,
  deletePin,
  getAllPins,
  getPin,
  getPinAttendee,
  getPinAttendees,
  getActivePins,
  removePinAttendee,
  updatePin,
} from '../database.js';

const pinsRouter = Router();

/**
 * Create a new pin
 */
pinsRouter.post('/', async (req, res) => {
  console.log(req.body);
  const { startTime, endTime, details, coords } = req.body;

  if (!startTime || !endTime || !details || !coords) {
    return res.status(400).json({
      error: 'Missing at least one of startTime, endTime, details, coords',
    });
  }

  const now = new Date().toISOString();
  if (startTime < now || endTime < now) {
    return res
      .status(400)
      .json({
        error: 'Cannot create a new pin in the past. Time travel not possible.',
      });
  }

  const hostID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;

  const pin = await createPin({
    hostID,
    startTime,
    endTime,
    details,
    coords,
    attendeeCount: 1,
  });

  return res.status(200).json(pin);
});

/**
 * Get filtered pins
 */
pinsRouter.get('/', async (req, res) => {
  let type = req.query.type;

  if (type) {
    type = type.toString();
  }

  if (type === 'active') {
    const activePins = await getActivePins();

    return res.status(200).json(activePins);
  } else {
    const allPins = await getAllPins();

    return res.status(200).json(allPins);
  }
});

/**
 * Get pin attendees
 */
pinsRouter.get('/:pinID/attendees', async (req, res) => {
  const pinID = req.params.pinID;

  const pinAttendees = await getPinAttendees(pinID);

  return res.status(200).json(pinAttendees);
});

/**
 * Join a pin as an attendee
 */
pinsRouter.post('/:pinID/attendees', async (req, res) => {
  const pinID = req.params.pinID;
  const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;

  const [pin, existingPinAttendee] = await Promise.all([
    getPin(pinID),
    getPinAttendee(pinID, userID),
  ]);

  if (!pin) {
    return res.status(404).json({ error: 'Pin not found' });
  }

  if (existingPinAttendee) {
    return res.status(200).json(existingPinAttendee);
  }

  const attendee = await addPinAttendee(pinID, userID);

  pin.attendeeCount++;

  await updatePin(pin);

  return res.status(200).json(attendee);
});

/**
 * Leave a pin as an attendee
 */
pinsRouter.delete('/:pinID/attendees/:attendeeID', async (req, res) => {
  const pinID = req.params.pinID;
  const attendeeID = req.params.attendeeID;
  const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;

  if (attendeeID !== userID) {
    return res.status(400).json({ error: 'Cannot leave pin for another user' });
  }

  const [pin, pinAttendee] = await Promise.all([
    getPin(pinID),
    getPinAttendee(pinID, userID),
  ]);

  if (!pin) {
    return res.status(404).json({ error: 'Pin not found' });
  }

  if (!pinAttendee) {
    return res
      .status(404)
      .json({ error: 'Cannot leave a pin you are not an attendee of' });
  }

  await removePinAttendee(pinAttendee);
  pin.attendeeCount--;
  await updatePin(pin);

  return res.status(204).end();
});

/**
 * Gets a pin
 */
pinsRouter.get('/:pinID', async (req, res) => {
  const pinID = req.params.pinID;

  const pin = await getPin(pinID);

  if (!pin) {
    return res.status(404).json({ error: 'Pin not found' });
  }

  return res.status(200).json(pin);
});

/**
 * Update a pin
 */
pinsRouter.put('/:pinID', async (req, res) => {
  const pinID = req.params.pinID;
  const { startTime, endTime, details, coords } = req.body;

  const existingPin = await getPin(pinID);

  if (!existingPin) {
    return res.status(404).json({ error: 'Pin not found' });
  }

  const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;

  if (userID !== existingPin.hostID) {
    return res
      .status(403)
      .json({ error: 'Cannot modify pin you did not create' });
  }

  const updatedPin = await updatePin({
    ...existingPin,
    startTime,
    endTime,
    details,
    coords,
  });

  return res.status(200).json(updatedPin);
});

/**
 * Delete a pin
 */
pinsRouter.delete('/:pinID', async (req, res) => {
  const pinID = req.params.pinID;
  const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;

  const pin = await getPin(pinID);

  if (!pin) {
    return res.status(404).json({ error: 'No pin found with that pinID' });
  }

  if (userID !== pin.hostID) {
    return res
      .status(403)
      .json({ error: 'Cannot delete pin you did not create' });
  }

  const attendees = await getPinAttendees(pinID);

  await Promise.all(attendees.map((a) => removePinAttendee(a)));

  await deletePin(pin);

  return res.status(204).end();
});

export default pinsRouter;
