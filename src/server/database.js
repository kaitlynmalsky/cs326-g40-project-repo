import PouchDB from 'pouchdb';
import { randomUUID } from 'crypto';

export const db = new PouchDB('villagelink');

/**
 * Avatar configuration
 * @typedef {object} AvatarConfig
 * @property {number} bg
 * @property {number} body
 * @property {number} ears
 * @property {number} hat
 */

/**
 * Input data to create a VillageLink User
 * @typedef {Object} CreateUserInput
 * @property {string} userID The ID of the user
 * @property {string} name The user's name
 * @property {string} username The user's username
 * @property {string} email The user's email
 * @property {string} avatar The user's avatar
 * @property {AvatarConfig} avatarConfig The configuration for the user's avatar
 * @property {string} password The user's password
 */

/**
 * Represents a VillageLink user object
 * @typedef {Object} User
 * @property {string} userID The ID of the user
 * @property {string} name The user's name
 * @property {string} username The user's username
 * @property {string} email The user's email
 * @property {string} password The user's password
 * @property {string} avatar The user's avatar
 * @property {string} bio The user's bio
 * @property {AvatarConfig} avatarConfig The configuration for the user's avatar
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Input data to create a VillageLink Pin
 * @typedef {Object} CreatePinInput
 * @property {string} hostID The pin host user ID
 * @property {string} startTime The start time of the pin's event (in ISO-8601 format)
 * @property {string} endTime The end time of the pin's event (in  ISO-8601 format)
 * @property {string} details The pin details
 * @property {[number, number]} coords The [lat,long] coordinates representing the pin's location
 * @property {number} attendeeCount The number of pin attendees
 */

/**
 * Represents a VillageLink pin object
 * @typedef {Object} Pin
 * @property {string} pinID The ID of the pin
 * @property {string} hostID The pin host user ID
 * @property {string} startTime The start time of the pin's event (in ISO-8601 format)
 * @property {string} endTime The end time of the pin's event (in  ISO-8601 format)
 * @property {string} details The pin details
 * @property {[number, number]} coords The [lat,long] coordinates representing the pin's location
 * @property {number} attendeeCount The number of pin attendees
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * @typedef {Object} PinAttendee
 * @property {string} pinID
 * @property {string} userID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Input data to create a VillageLink VillageConnection
 * @typedef {object} CreateVillageConnectionInput
 * @property {string} userID
 * @property {string} targetID
 */

/**
 * Represents a directional connection between two VillageLink users
 * @typedef {object} VillageConnection
 * @property {string} userID
 * @property {string} targetID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Reprsents a person with a name and a link to their avatar image.
 * @typedef {Object} Person
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents a group chat object.
 * @typedef {Object} GroupChat
 * @property {number} GroupChatID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents which people are in which group chats.
 * @typedef {Object} GroupChatMember
 * @property {number} PersonID
 * @property {number} GroupChatID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents a message.
 * @typedef {Object} GroupChatMessage
 * @property {string} messageID
 * @property {number} GroupChatID
 * @property {number} PersonID
 * @property {string} messageContent
 * @property {Date} time
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

// ********************************************
// Pins
// ********************************************

/**
 * Formats `pinID` into a database key
 * @param {string} pinID The ID of the pin
 * @returns {string}
 */
function formatPinKey(pinID) {
    return `pin_${pinID}`;
}

/**
 * Creates a new pin
 * @param {CreatePinInput} pinData Input data to create the pin
 * @returns {Promise<Pin>} The created pin
 */
export async function createPin(pinData) {
    const pinStart = new Date(pinData.startTime);

    const pinID = `${pinStart.getTime()}_${randomUUID()}`;

    const pinDoc = {
        _id: formatPinKey(pinID),
        pinID,
        ...pinData,
    };

    const { id, rev, ok } = await db.put(pinDoc);

    if (!ok) {
        console.error(`Failed to create ${pinID} (id=${id} , rev=${rev})`);
    }

    await addPinAttendee(pinID, pinData.hostID);

    return {
        ...pinDoc,
        _id: id,
        _rev: rev,
    };
}

/**
 * Gets pin information
 * @param {string} pinID The ID of the pin to retrieve
 * @returns {Promise<Pin | null>}
 * @throws {Error}
 */
export async function getPin(pinID) {
    try {
        return await db.get(formatPinKey(pinID));
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Updates a pin
 * @param {Pin} pin The pin to update
 * @returns {Promise<Pin>}
 */
export async function updatePin(pin) {
    const { rev, ok, id } = await db.put(pin);

    if (!ok) {
        console.error(`Failed to update ${pin.pinID} (id=${id} , rev=${rev})`);
    }

    pin._rev = rev;

    return pin;
}

/**
 * Delete a pin
 * @param {Pin} pin The pin to delete
 * @returns {Promise<PouchDB.Core.Response>}
 */
export async function deletePin(pin) {
    return db.remove(pin);
}

/**
 * Retrieve all pins
 * @returns {Promise<Array<Pin>>}
 */
export async function getAllPins() {
    try {
        const pinsResult = await db.allDocs({
            include_docs: true,
            startkey: 'pin',
            endkey: `pin\ufff0`,
        });

        return pinsResult.rows.map((row) => row.doc);
    } catch (err) {
        return null;
    }
}

/**
 * Retrieve upcoming pins
 * @returns {Promise<Array<Pin>>}
 */
export async function getUpcomingPins() {
    try {
        const now = Date.now();

        const pinsResult = await db.allDocs({
            include_docs: true,
            startkey: `pin_${now}_`,
            endkey: `pin_${now + 1000 * 60 * 60 * 24 * 2}_\ufff0`,
        });

        return pinsResult.rows.map((row) => row.doc);
    } catch (err) {
        return null;
    }
}

// ********************************************
// Users
// ********************************************

/**
 * Formats `userID` into a database key
 * @param {string} userID the ID of the user
 * @returns {string}
 */
function formatUserKey(userID) {
    return `user_${userID}`;
}

/**
 * Retrieves a user
 * @param {string} userID The ID of the user to retrieve
 * @returns {Promise<User | null>}
 */
export async function getUser(userID) {
    try {
        return await db.get(formatUserKey(userID));
    } catch (err) {
        return null;
    }
}

/**
 * Retrieves user by email
 * @param {string} email The email of the user to retrieve
 * @returns {Promise<User>}
 */
export async function getUserByEmail(email) {
    const users = await db.allDocs({
        include_docs: true,
        startkey: 'user',
        endkey: `user\ufff0`,
    });

    const user = users.rows.find((row) => row.doc.email === email) ? .doc;
    return user || null;
}

/**
 * Gets a user by name
 * @param {string} name
 * @returns {Promise<User>}
 */
export async function getUserByName(name) {
    const users = await db.allDocs({
        include_docs: true,
        startkey: 'user',
        endkey: 'user\ufff0',
    });

    console.log(users);
    const user = users.rows.find((row) => row.doc.name === name);
    return user.doc;
}

/**
 * Adds a new user
 * @param {CreateUserInput} userData User data to create a new user
 * @returns {Promise<User>} The created user
 */
export async function createUser(userData) {
    const { userID } = userData;
    const existingUser = await getUserByEmail(userData.email);

    if (existingUser) {
        console.error(`An account with ${userData.email} already exists`);
        return existingUser;
    } else {
        const userDoc = {
            _id: formatUserKey(userID),
            userID,
            ...userData,
            bio: "";
        };

        const { rev } = await db.put(userDoc);

        return {
            ...userDoc,
            _rev: rev,
        };
    }
}

/**
 *
 * Updates existing user
 * @param {User} user
 * @returns {Promise<User>}
 */
export async function updateUser(user) {
    const { rev } = await db.put(user);

    user._rev = rev;

    return user;
}

/**
 * Retrieve all users
 * @returns {Promise<Array<User>>}
 */
export async function getAllUsers() {
    try {
        const usersResult = await db.allDocs({
            include_docs: true,
            startkey: 'user_',
            endkey: `user_\ufff0`,
        });

        return usersResult.rows.map((row) => row.doc);
    } catch (err) {
        return null;
    }
}

// ********************************************
// Connections
// ********************************************

/**
 * Formats `userID` and `targetID` into a database key
 * @param {string} userID
 * @param {string} targetID
 * @returns {string}
 */
function formatConnectionKey(userID, targetID) {
    return `connection_${userID}_${targetID}`;
}

/**
 * Creates a new connection
 * @param {CreateVillageConnectionInput} connection Input data to create the connection
 * @returns {Promise<VillageConnection>} The newly created connection
 */
export async function createConnection(connection) {
    console.log('Creating connection ', connection);
    const { userID, targetID } = connection;

    const connectionKey = formatConnectionKey(userID, targetID);

    const existingConnection = await getConnection(userID, targetID);

    if (existingConnection) return existingConnection;

    const connectionDoc = {
        ...connection,
        _id: connectionKey,
    };

    const { id, rev, ok } = await db.put(connectionDoc);

    if (!ok) {
        console.error(`Failed to create ${connectionKey} (id=${id} , rev=${rev})`);
    }

    return {
        ...connectionDoc,
        _rev: rev,
    };
}

/**
 *
 * Creates connection object between userId and targetID
 * @param {string} userID
 * @param {string} targetID
 */
export async function getConnection(userID, targetID) {
    try {
        return await db.get(formatConnectionKey(userID, targetID));
    } catch (err) {
        return null;
    }
}

/**
 * Retrieves connections for the specified userID
 * @param {string} userID
 * @returns {Promise<Array<VillageConnection>>}
 */
export async function getConnections(userID) {
    const connectionsFilterKey = `connection_${userID}`;
    const connectionsResult = await db.allDocs({
        include_docs: true,
        startkey: connectionsFilterKey,
        endkey: `${connectionsFilterKey}\ufff0`,
    });

    return connectionsResult.rows.map((row) => row.doc);
}

/**
 * Deletes the specified connection
 * @param {VillageConnection} connection Connection to delete
 * @returns {Promise<PouchDB.Core.Response>}
 */
export async function deleteConnection(connection) {
    return db.remove(connection);
}

// ********************************************
// Pin Attendees
// ********************************************

/**
 * Format `pinId` and `userId` into a pin attendee database key
 * @param {string} pinID
 * @param {string} userID
 */
function formatPinAttendeeKey(pinID, userID) {
    return `pat_${pinID}_${userID}`;
}

/**
 * Add an attendee to a pin
 * @param {string} pinID
 * @param {string} userID
 * @returns {Promise<PinAttendee>}
 */
export async function addPinAttendee(pinID, userID) {
    const existingAttendee = await getPinAttendee(pinID, userID);

    if (existingAttendee) return existingAttendee;

    const doc = {
        _id: formatPinAttendeeKey(pinID, userID),
        pinID,
        userID,
    };

    const { ok, id, rev } = await db.put(doc);

    if (!ok) {
        console.error(
            `Could not add userId=${userID} as attendee for pin pinI=${pinID}`,
        );
    }

    return {
        ...doc,
        _rev: rev,
    };
}

/**
 * Get the attendees of a pin
 * @param {string} pinID
 * @returns {Promise<PinAttendee[]>}
 */
export async function getPinAttendees(pinID) {
    const pinAttendeesResult = await db.allDocs({
        include_docs: true,
        startkey: `pat_${pinID}`,
        endkey: `pat_${pinID}\ufff0`,
    });

    return pinAttendeesResult.rows.map((row) => row.doc);
}

/**
 * Gets the attendee for a pin
 * @param {string} pinID
 * @param {string} userID
 * @returns {Promise<PinAttendee>}
 */
export async function getPinAttendee(pinID, userID) {
    try {
        return await db.get(formatPinAttendeeKey(pinID, userID));
    } catch (err) {
        return null;
    }
}

/**
 * Removes an attendee from a pin
 * @param {PinAttendee} attendee
 */
export async function removePinAttendee(attendee) {
    return db.remove(attendee);
}

// ********************************************
// User Pin Notifications
// ********************************************

// ********************************************
// Messaging
// ********************************************

/**
 * Formats `gcID` into a database key
 * @param {number} gcID The ID of the group chat
 * @returns {string}
 */
function formatGroupKey(gcID) {
    return 'groupchat_' + gcID;
}

/**
 * Formats message db key
 * @param {string} gcID
 * @param {string} msgID
 * @returns {string}
 */
function formatGroupMessageKey(gcID, msgID) {
    return `message_${gcID}_${msgID}`;
}

/**
 * Formats person (temp) db key
 * @param {number} pID
 * @returns {string}
 */
function formatPersonKey(pID) {
    return `person_${pID}`;
}

/**
 * Retrieves group chat with given ID.
 * @param {number} gcID
 * @returns {Promise<GroupChat | null>}
 */
export async function getGroupById(gcID) {
    try {
        const groupChat = await db.get(formatGroupKey(gcID));
        return groupChat;
    } catch (err) {
        return null;
    }
}

/**
 * Adds a group chat with the given ID to the database.
 * @param {number} gcID
 * @returns {Promise<GroupChat>}
 */
export async function addGroupChat(gcID) {
    //('in addGroupChat');
    const existingGC = await getGroupById(gcID);
    //console.log(`existingGC is ${existingGC}`);
    if (existingGC) {
        console.error(`Group chat with ID ${gcID} already exists.`);
        return existingGC;
    } else {
        const gcDoc = {
            _id: formatGroupKey(gcID),
            GroupChatID: gcID,
        };

        const { id, rev, ok } = await db.put(gcDoc);

        if (!ok) {
            console.error(`Failed to create ${gcID} (id=${id} , rev=${rev})`);
        }

        return {
            _id: id,
            _rev: rev,
            ...gcDoc,
        };
    }
}

/**
 * Adds a message with the given group chat ID, author ID, content, and time sent to the database
 * @param {number} gcID
 * @param {number} pID
 * @param {string} content
 * @param {Date} time
 */
export async function addGroupChatMessage(gcID, pID, content, time) {
    const messageID = `${Date.now()}_${randomUUID()}`;
    const messageDoc = {
        _id: formatGroupMessageKey(`${gcID}`, messageID),
        messageID: messageID,
        GroupChatID: gcID,
        PersonID: pID,
        messageContent: content,
        time: time,
    };
    const { id, rev, ok } = await db.put(messageDoc);

    if (!ok) {
        console.error(`Failed to create ${messageID} (id=${id} , rev=${rev})`);
    }

    return {
        _id: id,
        _rev: rev,
        ...messageDoc,
    };
}

/**
 *
 * @param {string} gcId
 * @param {string} pID
 */
function formatGroupChatMemberKey(gcId, pID) {
    return `groupchatmember_${gcId}_${pID}`;
}

/**
 * Adds a group chat member with the given person ID and group chat ID.
 * @param {number} pID
 * @param {number} gcID
 * @returns {Promise<GroupChatMember>}
 */
export async function addGroupChatMember(pID, gcID) {
    const existingGCMember = (await getMembersByGroupChatID(gcID)).filter(
        (member) => member.PersonID === pID,
    );
    if (existingGCMember.length !== 0) {
        console.error(
            `GroupChatMember with person ID ${pID} and group chat ID ${gcID} already exists.`,
        );
        return existingGCMember[0];
    } else {
        const gcmDoc = {
            _id: formatGroupChatMemberKey(`${gcID}`, `${pID}`),
            PersonID: pID,
            GroupChatID: gcID,
        };

        const { id, rev, ok } = await db.put(gcmDoc);

        if (!ok) {
            console.error(`Failed to create ${gcID}_${pID} (id=${id}, rev=${rev})`);
        }

        return {
            _id: id,
            _rev: rev,
            ...gcmDoc,
        };
    }
}

/**
 * Retrieves all group chats for the current user.
 * @returns {Promise<Array<GroupChat>>}
 */
export async function getAllGroupChats() {
    const gcsResult = await db.allDocs({
        include_docs: true,
        startkey: 'groupchat_',
        endkey: `groupchat_\ufff0`,
    });

    return gcsResult.rows.map((row) => row.doc);
}

/**
 * Retrieves all messages given a group chat's ID.
 * @param {number} gcID
 * @returns {Promise<Array<GroupChatMessage>>}
 */
export async function getMessagesByGroupChatID(gcID) {
    const messageResult = await db.allDocs({
        include_docs: true,
        startkey: `message_${gcID}`,
        endkey: `message_${gcID}\ufff0`,
    });

    return messageResult.rows.map((row) => row.doc);
}

/**
 * Retrieves all members
 * @param {number} gcID
 * @returns {Promise<Array<GroupChatMember>>}
 */
export async function getMembersByGroupChatID(gcID) {
    const memberResult = await db.allDocs({
        include_docs: true,
        startkey: `groupchatmember_${gcID}`,
        endkey: `groupchatmember_${gcID}\ufff0`,
    });
    return memberResult.rows.map((row) => row.doc);
}