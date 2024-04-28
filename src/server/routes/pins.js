import { Router } from 'express';

const pinsRouter = Router();

pinsRouter.post('/', async (req, res) => {});
pinsRouter.get('/', async (req, res) => {});

pinsRouter.get('/:pinID/attendees', async (req, res) => {});
pinsRouter.post('/:pinID/attendees', async (req, res) => {});
pinsRouter.get('/:pinID/attendees', async (req, res) => {});
pinsRouter.delete('/:pinID/attendees/:userId', async (req, res) => {});

pinsRouter.put('/:pinID', async (req, res) => {});
pinsRouter.delete('/:pinID', async (req, res) => {});

export default pinsRouter;