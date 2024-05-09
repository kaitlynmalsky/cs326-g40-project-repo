import Router from 'express';
import { getAllGroupChats, getGroupById, addGroupChatMessage } from '../database.js';

const messagesRouter = Router();

/**
 * Get a group chat by `gcID`
 */
// messagesRouter.get('/:gcID', async(req, res) => {
//     const gcID = req.params.gcID;
//     const gc = await getGroupById(gcID);
//     if (!gc) {
//         return res.status(404).end({ error: `Group chat with ID=${gcID} not found` });
//     }
//     return res.status(200).json(gc);
// });


// Get group chats
// returns a list of pins you are a part of
messagesRouter.get('/groups', async(req, res) => {
    // will return a list of pins/groups that the current user is a part of
    return res.status(501).end({ error: "Not implemented" });
    const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
        req.session
    ).userID;
})

// Send message to group chat
messagesRouter.post('/groups/:groupID/messages', async(req, res) => {
    if (!req.params.groupID) {
        return res.status(400).json({ error: `Missing groupID query argument` });
    }
    if (!req.body) {
        return res.status(400).json({ error: "Request body missing" });
    }
    const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
        req.session
    ).userID;
    const groupID = req.params.groupID;
    const { timeString, content } = req.body;
    let timestamp = new Date(timeString);
    await addGroupChatMessage(groupID, userID, content, timestamp);

})

// Get messages from group chat
messagesRouter.get('/groups/:groupID/messages', async(req, res) => {
    if (!req.params.groupID) {
        return res.status(400).json({ error: `Missing groupID query argument` });
    }
    return res.status(501).end({ error: "Not implemented" });
    const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
        req.session
    ).userID;
})


export default messagesRouter;