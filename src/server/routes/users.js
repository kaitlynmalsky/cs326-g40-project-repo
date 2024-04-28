import { Router } from 'express';

const userRouter = Router();

userRouter.post('/', async (req, res) => {});

userRouter.get('/:userID/village', async (req, res) => {});
userRouter.delete('/:userID/village/:targetID', async (req, res) => {});

userRouter.get('/:userID', async (req, res) => {});
userRouter.put('/:userID', async (req, res) => {});

export default userRouter;
