import express from 'express';
import userRouter from './routes/users.js';
import pinsRouter from './routes/pins.js';
import messagesRouter from './routes/messages.js';
import { randomUUID, scryptSync } from 'crypto';
import { createUser, db, getUserByEmail } from './database.js';
import session, { Session } from 'express-session';
import PouchDBSessionStore from './session.js';
import morgan from 'morgan';
import startPinsService from './pinsService.js';
import cors from 'cors';


const app = express();

app.set('trust proxy', true);
app.use(
  cors({
    origin: true,
    allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('tiny'));
app.use(
  session({
    name: 'vl_session',
    secret: 'village linked is cool',
    resave: false,
    saveUninitialized: false,
    store: new PouchDBSessionStore(db),
    cookie: {
      sameSite: 'none',
      httpOnly: true,
    },
  }),
);

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function isAuthenticated(req, res, next) {
  if (/** @type {AuthenticatedSessionData} */ (req.session).userID) next();
  else {
    return res.status(401).end();
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
app.post('/api/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (/** @type {AuthenticatedSessionData} */ (req.session).userID) {
    return res.status(400).send({ error: 'Already logged in' });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields email or password' });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    console.log('No user found');
    return res.status(404).json({ error: 'Invalid email' });
  }

  const hashedPassword = hashPassword(user.userID, password);

  if (hashedPassword !== user.password) {
    console.log('Incorrect password');
    return res.status(401).json({ error: 'Incorrect password' });
  }

  /** @type {AuthenticatedSessionData} */
  (req.session).userID = user.userID;

  await addConnections(/** @type {AuthenticatedSessionData} */(req.session).userID);

  return res.status(204).end();
});

app.get('/api/logout', isAuthenticated, async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
  });

  return res.status(204).end();
});

// Signup
app.post('/api/signup', async (req, res, next) => {
  const { username, name, avatar, avatarConfig, email, password } = req.body;

  if (/** @type {AuthenticatedSessionData} */ (req.session).userID) {
    return res.status(403).send({ error: 'Already logged in' });
  }

  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  if (!avatar) {
    return res.status(400).json({ error: 'Missing avatar' });
  }

  if (!avatarConfig) {
    return res.status(400).json({ error: 'Missing avatarConfig' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({ error: 'Email already used' });
  }

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

  /** @type {AuthenticatedSessionData} */
  (req.session).userID = user.userID;

  delete user.password;

  return res.status(200).json(user);
});

// User routes
app.use('/api/users', isAuthenticated, userRouter);

// Pin routes
app.use('/api/pins', isAuthenticated, pinsRouter);

// Message routes
app.use('/api/messages', isAuthenticated, messagesRouter);

app.use(express.static('./src/client', {}));

app.route('*').all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start pins service
startPinsService();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
