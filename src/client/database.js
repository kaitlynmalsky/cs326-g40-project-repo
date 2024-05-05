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
 * Represents a group chat object.
 * @typedef {Object} GroupChat
 * @property {number} GroupChatID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents which people are in which group chats.
 * @typedef {Object} GroupChatMember
 * @property {string} UserID
 * @property {number} GroupChatID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents a message.
 * @typedef {Object} GroupChatMessage
 * @property {string} messageID
 * @property {number} GroupChatID
 * @property {string} UserID
 * @property {string} messageContent
 * @property {Date} time
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents a user pin notification
 * @typedef {Object}
 */

/**
 * @class
 */
// @ts-ignore duplicate declaration for Database?????
class Database {
  #db;

  constructor() {
    this.#db = new PouchDB('villagelink');
  }
  // ********************************************
  // Current User
  // ********************************************

  /**
   * Saves `userID` to `localStorage` (keep client-side database calls)
   * @param {string} userID
   */
  async setCurrentUserId(userID) {
    const docID = 'current_user';
    try {
      const doc = await this.#db.get(docID);

      doc.userID = userID;
      await this.#db.put(doc);
    } catch (err) {
      if (err.name === 'not_found') {
        await this.#db.put({ _id: docID, userID: userID });
      } else {
        console.error('Error accessing the database', err);
      }
    }
  }

  /**
   * Retrieves the current `userID` from `localStorage` (keep client-side database calls)
   * @returns {Promise<string | null>}
   */
  async getCurrentUserID() {
    const docId = 'current_user';
    try {
      const doc = await this.#db.get(docId);
      return doc.userID;
    } catch (err) {
      if (err.name === 'not_found') {
        return null;
      } else {
        console.error('Failed to retrieve user ID', err);
        return null;
      }
    }
  }

  /**
   * Deletes the current `userId` from `localStorage` (keep client-side database calls)
   */
  async deleteCurrentUserId() {
    const docID = 'current_user';
    try {
      const doc = await this.#db.get(docID);
      await this.#db.remove(doc);
    } catch (err) {
      console.error(err);
    }
  }

  // ********************************************
  // Pins
  // ********************************************

  /**
   * Calls the backend route to create pin data
   * @param {CreatePinInput} pinData Input data to create the pin
   * @returns {Promise<Pin>} The created pin
   * @throws {Error}
   */
  async createPin(pinData) {
    const pin_Data_Promise = await fetch(`/pins`, {
      method: 'POST',
      body: JSON.stringify(pinData),
    });
    if (!pin_Data_Promise.ok) {
      console.error(`FAILED TO CREATE PIN WITH ${pinData}`);
      return;
    }
    return await pin_Data_Promise.json();
  }

  /**
   * Calls the backend route to get pin information
   * @param {string} pinID The ID of the pin to retrieve
   * @returns {Promise<Pin | null>}
   * @throws {Error}
   */
  async getPin(pinID) {
    try {
      const pinData = await fetch(`/pins/${pinID}`);
      if (!pinData.ok) {
        console.error(`FAILED TO GET PIN ${pinID}`);
        return null;
      }
      return await pinData.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * Calls the backend Update route to update pin
   * @param {Pin} pin The pin to update
   * @returns {Promise<Pin>}
   */
  async updatePin(pin) {
    const data = await fetch(`/pins/${pin.pinID}`, {
      method: 'PUT',
      body: JSON.stringify(pin),
    });

    if (!data.ok) {
      console.error(`Failed to update ${pin.pinID}`);
    }

    return await data.json();
  }

  /**
   * Calls the backend Delete route to delete pin
   * @param {Pin} pin The pin to delete
   * @returns {Promise<PouchDB.Core.Response>}
   */
  async deletePin(pin) {
    const data = await fetch(`/pins/${pin.pinID}`, {
      method: 'DELETE',
    });
    return await data.json();
  }

  /**
   * Retrieve upcoming pins
   * @returns {Promise<Array<Pin>>}
   */
  async getUpcomingPins() {
    try {
      const now = Date.now();

      const pinsResult = await this.#db.allDocs({
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
   * Calls the get backend to get user by userID
   * @param {string} userID The ID of the user to retrieve
   * @returns {Promise<User>}
   */
  async getUser(userID) {
    const userResponse = await fetch(`/users/${userID}`);

    return userResponse.json();
  }

  /**
   * Calls the get backend to get user by email 
   * @param {string} email The email of the user to retrieve
   * @returns {Promise<User>}
   */
  async getUserByEmail(email) {
    try {
      const data = await fetch(`/users/?email=${email}`);
      if (!data.ok) {
        console.error(`FAILED TO GET USER BY EMAIL ${email}`);
        return;
      }
      return await data.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   *
   * Calls the update backend to update the user 
   * @param {User} user
   * @returns {Promise<User>}
   */
  async updateUser(user) {
    const data = await fetch(`/users/${user.userID}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
    if (!data.ok) {
      console.error(`FAILED TO UPDATE USER ${user}`);
    }
    return data.json();
  }

  /**
   * Calls the update backend to update the bio of the user with the given ID.
   * @param {string} uID 
   * @param {string} bio 
   * @returns {Promise<User|null>}
   */
  async updateUserBio(uID, bio) {
    try {
      const user = await this.getUser(uID);
      const newUserData = {
        ...user,
        userID: uID,
        bio: bio
      };
      const data = await fetch(`/users/${newUserData.userID}`, {
        method: 'PUT',
        body: JSON.stringify(newUserData)
      });
      if (!data.ok) {
        console.error(`FAILED TO UPDATE USER BIO : ${uID}`);
        return null;
      }
      return data.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // ********************************************
  // Connections
  // ********************************************

  /**
   * Calls a post call to create connection 
   * @param {CreateVillageConnectionInput} connection Input data to create the connection
   * @returns {Promise<VillageConnection>} The newly created connection
   */
  async createConnection(connection) {
    const createPromise = 
  }

  /**
   *
   * Creates connection object between userId and targetID
   * @param {string} userID
   * @param {string} targetID
   */
  async getConnection(userID, targetID) {
    try {
      return await this.#db.get(this.#formatConnectionKey(userID, targetID));
    } catch (err) {
      return null;
    }
  }

  /**
   * Retrieves connections for either the specified userID or for the current user
   * @param {string} [userID]
   * @returns {Promise<Array<VillageConnection>>}
   */
  async getConnections(userID) {
    userID = userID || (await this.getCurrentUserID());
    const connectionsFilterKey = `connection_${userID}`;
    const connectionsResult = await this.#db.allDocs({
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
  async deleteConnection(connection) {
    return this.#db.remove(connection);
  }

  // ********************************************
  // Pin Attendees
  // ********************************************

  /**
   * Format `pinId` and `userId` into a pin attendee database key
   * @param {string} pinID
   * @param {string} userID
   */
  #formatPinAttendeeKey(pinID, userID) {
    return `pat_${pinID}_${userID}`;
  }

  /**
   * Add an attendee to a pin
   * @param {string} pinID
   * @param {string} userID
   * @returns {Promise<PinAttendee>}
   */
  async addPinAttendee(pinID, userID) {
    const existingAttendee = await this.getPinAttendee(pinID, userID);

    if (existingAttendee) return existingAttendee;

    const doc = {
      _id: this.#formatPinAttendeeKey(pinID, userID),
      pinID,
      userID,
    };

    const { ok, id, rev } = await this.#db.put(doc);

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
   */
  async getPinAttendees(pinID) {
    const pinAttendeesResult = await this.#db.allDocs({
      include_docs: true,
      startkey: `pat_${pinID}`,
      endkey: `pat_${pinID}\ufff0`,
    });

    return pinAttendeesResult.rows.map((row) => row.doc);
  }

  /**
   * Gets the attendee for a pin
   * @param {string} pinId
   * @param {string} userID
   * @returns {Promise<PinAttendee>}
   */
  async getPinAttendee(pinId, userID) {
    try {
      return await this.#db.get(this.#formatPinAttendeeKey(pinId, userID));
    } catch (err) {
      return null;
    }
  }

  /**
   * Removes an attendee from a pin
   * @param {PinAttendee} attendee
   */
  async removePinAttendee(attendee) {
    return this.#db.remove(attendee);
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
  #formatGroupKey(gcID) {
    return 'groupchat_' + gcID;
  }

  /**
   * Formats message db key
   * @param {string} gcID
   * @param {string} msgID
   * @returns {string}
   */
  #formatGroupMessageKey(gcID, msgID) {
    return `message_${gcID}_${msgID}`;
  }

  /**
   * Retrieves group chat with given ID.
   * @param {number} gcID
   * @returns {Promise<GroupChat | null>}
   */
  async getGroupById(gcID) {
    try {
      const groupChat = await this.#db.get(this.#formatGroupKey(gcID));
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
  async addGroupChat(gcID) {
    //('in addGroupChat');
    const existingGC = await this.getGroupById(gcID);
    //console.log(`existingGC is ${existingGC}`);
    if (existingGC) {
      //console.error(`Group chat with ID ${gcID} already exists.`);
      return existingGC;
    } else {
      const gcDoc = {
        _id: this.#formatGroupKey(gcID),
        GroupChatID: gcID,
      };

      const { id, rev, ok } = await this.#db.put(gcDoc);

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
   * @param {string} uID
   * @param {string} content
   * @param {Date} time
   */
  async addGroupChatMessage(gcID, uID, content, time) {
    const messageID = self.crypto.randomUUID();
    const messageDoc = {
      _id: this.#formatGroupMessageKey(`${gcID}`, messageID),
      messageID: messageID,
      GroupChatID: gcID,
      UserID: uID,
      messageContent: content,
      time: time,
    };
    const { id, rev, ok } = await this.#db.put(messageDoc);

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
   * @param {string} uID
   */
  #formatGroupChatMemberKey(gcId, uID) {
    return `groupchatmember_${gcId}_${uID}`;
  }

  /**
   * Adds a group chat member with the given person ID and group chat ID.
   * @param {string} uID
   * @param {number} gcID
   * @returns {Promise<GroupChatMember>}
   */
  async addGroupChatMember(uID, gcID) {
    const existingGCMember = (await this.getMembersByGroupChatID(gcID)).filter(
      (member) => member.UserID === uID,
    );
    if (existingGCMember.length !== 0) {
      // console.error(
      //   `GroupChatMember with person ID ${uID} and group chat ID ${gcID} already exists.`,
      // );
      return existingGCMember[0];
    } else {
      const gcmDoc = {
        _id: this.#formatGroupChatMemberKey(`${gcID}`, `${uID}`),
        UserID: uID,
        GroupChatID: gcID,
      };

      const { id, rev, ok } = await this.#db.put(gcmDoc);

      if (!ok) {
        console.error(`Failed to create ${gcID}_${uID} (id=${id}, rev=${rev})`);
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
  async getAllGroupChats() {
    const gcsResult = await this.#db.allDocs({
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
  async getMessagesByGroupChatID(gcID) {
    const messageResult = await this.#db.allDocs({
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
  async getMembersByGroupChatID(gcID) {
    const memberResult = await this.#db.allDocs({
      include_docs: true,
      startkey: `groupchatmember_${gcID}`,
      endkey: `groupchatmember_${gcID}\ufff0`,
    });
    return memberResult.rows.map((row) => row.doc);
  }
}

const dbInstance = new Database();
export default dbInstance;
