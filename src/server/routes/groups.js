import Router from 'express';
import { getAllGroupChats, getGroupById, addGroupChatMessage, getUserPins, getMessagesByGroupChatID } from '../database.js';

const groupsRouter = Router();


groupsRouter.get('/', async(req, res) => {
    // will return a list of pins/groups that the current user is a part of
    console.log("trying to get groups");
    const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
        req.session
    ).userID;
    try {
        let pins = await getUserPins(userID);
        return res.status(200).json(pins);
    } catch (err) {
        return res.status(500).json({ error: `Failed to get user pins` })
    }
})

// Send message to group chat
groupsRouter.post('/:groupID/messages', async(req, res) => {
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
    const { content, timeString } = req.body;
    let timestamp = new Date(timeString);
    try {
        await addGroupChatMessage(groupID, userID, content, timestamp);
        return res.status(200).end();
    } catch (err) {
        return res.status(500).json({ error: `Failed to send message` });
    }


})

// Get messages from group chat
groupsRouter.get('/:groupID/messages', async(req, res) => {
    if (!req.params.groupID) {
        return res.status(400).json({ error: `Missing groupID query argument` });
    }
    const userID = /** @type {import('../index.js').AuthenticatedSessionData} */ (
        req.session
    ).userID;
    const groupID = req.params.groupID;
    try {
        let messages = await getMessagesByGroupChatID(groupID);
        return res.status(200).json({ messages: messages });
    } catch (err) {
        return res.status(500).json({ error: `Failed to get messages` });
    }
})


export default groupsRouter;