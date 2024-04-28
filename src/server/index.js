import express from 'express';
import userRouter from './routes/users.js';
import pinsRouter from './routes/pins.js';

const app = express();
app.use(express.json());

// User routes
app.use('/users', userRouter);

// Pin routes
app.use('/pins', pinsRouter);

app.route('*').all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

const PORT = 3260;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
