import { Router } from 'express';
import {
  getUser,
  getUserByEmail,
  updateUser,
  createConnection,
  getConnections,
  getConnection,
  deleteConnection,
  getConnectionSuggestions,
  getConnectionSuggestion,
  deleteConnectionSuggestion,
  getUsers,
} from '../database.js';

const userRouter = Router();

/**
 * Get users by email or id
 */
userRouter.get('/', async (req, res) => {
  let { email, userID } = req.query;

  if (!email && !userID) {
    return res
      .status(400)
      .json({ error: 'Missing email or userID query argument' });
  }

  if (email) {
    // Get user by email
    email = email.toString();

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).end();
    }

    return res.status(200).json(user);
  } else {
    // Get user(s) by id
    if (typeof userID === 'string') {
      // Get one user
      const user = await getUser(userID);

      if (!user) {
        return res.status(404).end();
      }

      delete user.password;

      return res.status(200).json([user]);
    } else {
      const users = await getUsers(/** @type {string[]} */ (userID));

      users.forEach((user) => delete user.password);

      return res.status(200).json(users);
    }
  }
});

/**
 * Create a bi-directional connection between userID and targetID
 */
userRouter.post('/:userID/connections/', async (req, res) => {
  const userID = req.params.userID;
  const targetData = req.body;

  if (!targetData.targetID) {
    return res.status(400).json({ error: 'Missing targetID in request body' });
  }

  try {
    const results = await Promise.all([
      createConnection({
        userID: userID,
        targetID: targetData.targetID,
      }),
      createConnection({
        userID: targetData.targetID,
        targetID: userID,
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

  try {
    const connections = await getConnections(userID);
    res.status(200).json(connections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get all connections of user' });
  }
});

/**
 * Delete a connection between userID and targetID
 */
userRouter.delete('/:userID/connections/:targetID', async (req, res) => {
  const userID = req.params.userID;
  const targetID = req.params.targetID;

  try {
    const connection = await getConnection(userID, targetID);
    const oppositeConnection = await getConnection(targetID, userID);

    await Promise.all([
      deleteConnection(connection),
      deleteConnection(oppositeConnection),
    ]);

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to get connection' });
  }
});

/**
 * Get current user`
 */
userRouter.get('/me', async (req, res) => {
  const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;

  const user = await getUser(userID);

  if (!user) {
    return res.status(404).end();
  }

  delete user.password;

  return res.status(200).json(user);
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

  delete user.password;

  return res.status(200).json(user);
});

/**
 * Update the calling user
 */
userRouter.put('/me', async (req, res) => {
  const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
    req.session
  ).userID;
  const userData = req.body;

  console.log('in update route');
  console.log(userData.bio);

  if (userID !== userData.userID) {
    return res.status(403).end();
  }

  const existingUser = await getUser(userID);

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  userData.password = existingUser.password;

  const updatedUser = await updateUser(userData);

  delete updatedUser.password;

  return res.status(200).json(updatedUser);
});

/**
 * Delete Connection Suggestions
 */
userRouter.delete('/:userID/suggestions/:targetID', async (req, res) => {
  const userID = req.params.userID;
  const targetID = req.params.targetID;

  try {
    const suggestConnection = await getConnectionSuggestion(userID, targetID);
    const oppositeConnectionSuggestion = await getConnectionSuggestion(
      targetID,
      userID,
    );

    if (suggestConnection) {
      await deleteConnectionSuggestion(suggestConnection);
    }

    if (oppositeConnectionSuggestion) {
      await deleteConnectionSuggestion(oppositeConnectionSuggestion);
    }

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete connection suggestion' });
  }
});

/**
 * Get Connection Suggestions
 */
userRouter.get('/:userID/suggestions', async (req, res) => {
  const userID = req.params.userID;

  const suggestPromise = await getConnectionSuggestions(userID);

  if (!suggestPromise) {
    return res.status(404).end();
  }

  return res.status(200).json(suggestPromise);
});

export default userRouter;
