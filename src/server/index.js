import express from 'express';
import userRouter from './routes/users.js';
import pinsRouter from './routes/pins.js';
import { randomUUID, scryptSync } from 'crypto';
import { createUser, db, getUserByEmail } from './database.js';
import session, { Session } from 'express-session';
import PouchDBSessionStore from './session.js';

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'village linked is cool',
    resave: false,
    saveUninitialized: true,
    store: new PouchDBSessionStore(db),
  }),
);

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function isAuthenticated(req, res) {
  // @ts-ignore
  if (req.session.userID) next();
  else {
    return res.status(403).end();
  }
}

/**
 * @param {string} userID
 * @param {string} password
 */
function hashPassword(userID, password) {
  return scryptSync(password, userID, 64).toString('hex');
}

/**
 * @typedef {Session & Partial<import('express-session').SessionData> & {userID: string}} AuthenticatedSessionData
 */

// Login
app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email' });
  }

  const hashedPassword = hashPassword(user.userID, password);

  if (hashedPassword !== user.password) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  req.session.regenerate((err) => {
    if (err) next(err);

    /** @type {AuthenticatedSessionData} */ (req.session).userID = user.userID;

    req.session.save();
  });
});

app.get('/logout', async (req, res, next) => {
  /** @type {AuthenticatedSessionData} */ (req.session).userID = null;

  req.session.save((err) => {
    if (err) next(err);

    req.session.regenerate((err) => {
      if (err) next(err);
    });
  });
});

// Signup
app.post('/signup', async (req, res, next) => {
  const { username, name, avatar, avatarConfig, email, password } = req.body;

  const userID = randomUUID();
  const hashedPassword = hashPassword(userID, password);

  const user = await createUser({
    userID,
    username,
    name,
    email,
    password: hashedPassword,
    avatar,
    avatarConfig,
  });

  req.session.regenerate((err) => {
    if (err) next(err);

    /** @type {AuthenticatedSessionData} */ (req.session).userID = user.userID;

    req.session.save();
  });

  return res.status(200).json(user);
});

// User routes
app.use('/users', isAuthenticated, userRouter);

// Pin routes
app.use('/pins', isAuthenticated, pinsRouter);

app.route('*').all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

const PORT = 3260;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
