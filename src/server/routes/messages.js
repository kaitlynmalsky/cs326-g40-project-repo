import Router from 'express';
import { getAllGroupChats, getGroupById } from '../database.js';

const messagesRouter = Router();

/**
 * Get a group chat by `gcID`
 */
messagesRouter.get('/:gcID', async(req, res) => {
    const gcID = req.params.gcID;
    const gc = await getGroupById(Number(gcID));
    if (!gc) {
        return res.status(404).end();
    }
    return res.status(200).json(gc);
});

export default messagesRouter;