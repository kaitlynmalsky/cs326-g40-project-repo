import { Router } from 'express';
import { getUser, getUserByEmail, updateUser, createConnection, getConnections, getConnection } from '../database.js';

const userRouter = Router();

/**
 * Filter users by email
 */
userRouter.get('/', async (req, res) => {
  let { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email query argument' });
  }

  email = email.toString();

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).end();
  }

  return res.status(200).json(user);
});

/**
 * Create a bi-directional connection between userID and targetID
 */
userRouter.post('/:userId/connections/', async (req, res) => {
  const userID = req.params.userId;
  const targetData = req.body;

  if (!targetData.targetID) {
    return res.status(400).json({ error: 'Missing targetID in request body' });
  }

  try {
    const results = await Promise.all([
      createConnection({
        userID: userID,
        targetID: targetData.targetID
      }),
      createConnection({
        userID: targetData.targetID,
        targetID: userID
      }),
    ]);

    res.status(201).json(results);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create connections' });
  }
});

/**
 * Get all connections of `userID`
 */
userRouter.get('/:userID/connections', async (req, res) => {
  const userID = req.params.userID;
  const userData = req.body;

  if (userID !== userData.userID) {
    return res.status(400).json({ error: 'Wrong userID provided in get all connections data' });
  }

  try {
    const connections = await getConnections(userID);
    res.status(201).json(connections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get all connections of user' })
  }

});

/**
 * Delete a connection between userID and targetID
 */
userRouter.delete('/:userID/connections/:targetID', async (req, res) => {
  const userID = req.params.userID;
  const targetID = req.params.targetID;
  const data = req.body;

  if (userID !== data.userID || targetID !== data.targetID) {
    return res.status(400).json({ error: 'Wrong userID or targetID provided in request body' });
  }

  try {
    const connection = await getConnection(userID, targetID);
    res.status(201).json(connection);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get connection' });
  }
});

/**
 * Get a user by `userID`
 */
userRouter.get('/:userID', async (req, res) => {
  const userID = req.params.userID;

  const user = await getUser(userID);

  if (!user) {
    return res.status(404).end();
  }

  return res.status(200).json(user);
});

/**
 * Update a user
 */
userRouter.put('/:userID', async (req, res) => {
  const userID = req.params.userID;
  const userData = req.body;

  if (userID !== userData.userID) {
    return res
      .status(400)
      .json({ error: 'Wrong userID provided in update data' });
  }

  const updatedUser = await updateUser(userData);

  return res.status(200).json(updatedUser);
});

export default userRouter;
