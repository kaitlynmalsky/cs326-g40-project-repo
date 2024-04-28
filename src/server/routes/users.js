import { Router } from 'express';
import { getUser, getUserByEmail, updateUser } from '../database.js';

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

userRouter.post('/:userId/connections', async (req, res) => {});
userRouter.get('/:userID/connections', async (req, res) => {});
userRouter.delete('/:userID/connections/:targetID', async (req, res) => {});

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
