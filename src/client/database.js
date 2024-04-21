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
 * @property {string} password The user's password
 * @property {string} avatar The user's avatar
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
 * Reprsents a person with a name and a link to their avatar image.
 * @typedef {Object} Person
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 */

/**
 * Represents a group chat object.
 * @typedef {Object} GroupChat
 * @property {number} id
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

/**
 * @class
 */
// @ts-ignore duplicate declaration for Database?????
class Database {
  #db;

  constructor() {
    this.#db = new PouchDB('villagelink');
  }

  /**
   * Formats `pinID` into a database key
   * @param {string} pinID The ID of the pin
   * @returns {string}
   */
  #formatPinKey(pinID) {
    return `pin_${pinID}`;
  }

  /**
   * Formats `userID` into a database key
   * @param {string} userID the ID of the user
   * @returns {string}
   */
  #formatUserKey(userID) {
    return `user_${userID}`;
  }

  /**
   * Formats `userID` and `targetID` into a database key
   * @param {string} userID
   * @param {string} targetID
   * @returns {string}
   */
  #formatConnectionKey(userID, targetID) {
    return `connection_${userID}_${targetID}`;
  }

  /**
   * Format `pinId` and `userId` into a pin attendee database key
   * @param {string} pinID
   * @param {string} userID
   */
  #formatPinAttendeeKey(pinID, userID) {
    return `pat_${pinID}_${userID}`;
  }

  /**
   * Saves `userID` to `localStorage`
   * @param {string} userID
   */
  setCurrentUserId(userID) {
    localStorage.setItem('userID', userID);
  }

  /**
   * Retrieves the current `userID` from `localStorage`
   * @returns {string | null}
   */
  getCurrentUserID() {
    return localStorage.getItem('userID');
  }

  /**
   * Deletes the current `userId` from `localStorage`
   */
  deleteCurrentUserId() {
    localStorage.removeItem('userID');
  }

  /**
   * Creates a new pin
   * @param {CreatePinInput} pinData Input data to create the pin
   * @returns {Promise<Pin>} The created pin
   */
  async createPin(pinData) {
    const pinID = self.crypto.randomUUID();

    const pinDoc = {
      _id: this.#formatPinKey(pinID),
      pinID,
      ...pinData,
    };

    const { id, rev, ok } = await this.#db.put(pinDoc);

    if (!ok) {
      console.error(`Failed to create ${pinID} (id=${id} , rev=${rev})`);
    }

    return {
      ...pinDoc,
      _id: id,
      _rev: rev,
    };
  }

  /**
   * Gets pin information
   * @param {string} pinID The ID of the pin to retrieve
   * @returns {Promise<Pin>}
   * @throws {Error}
   */
  async getPin(pinID) {
    return this.#db.get(this.#formatPinKey(pinID));
  }

  /**
   * Updates a pin
   * @param {Pin} pin The pin to update
   * @returns {Promise<Pin>}
   */
  async updatePin(pin) {
    const { rev, ok, id } = await this.#db.put(pin);

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
  async deletePin(pin) {
    return this.#db.remove(pin);
  }

  /**
   * Retrieves all pins
   * @returns {Promise<Array<Pin>>}
   */
  async getAllPins() {
    const pinsResult = await this.#db.allDocs({
      include_docs: true,
      startkey: 'pin',
      endkey: `pin\ufff0`,
    });

    return pinsResult.rows.map((row) => row.doc);
  }

  /**
   * Add an attendee to a pin
   * @param {string} pinID
   * @param {string} userID
   * @returns {Promise<PinAttendee>}
   */
  async addPinAttendee(pinID, userID) {
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
    return this.#db.get(this.#formatPinAttendeeKey(pinId, userID));
  }

  /**
   * Removes an attendee from a pin
   * @param {PinAttendee} attendee
   */
  async removePinAttendee(attendee) {
    return this.#db.remove(attendee);
  }

  /**
   * Retrieves a user
   * @param {string} userID The ID of the user to retrieve
   * @returns {Promise<User>}
   */
  async getUser(userID) {
    return this.#db.get(this.#formatUserKey(userID));
  }

  /**
   * Creates a new connection
   * @param {CreateVillageConnectionInput} connection Input data to create the connection
   * @returns {Promise<VillageConnection>} The newly created connection
   */
  async createConnection(connection) {
    const userID = this.getCurrentUserID();
    const connectionKey = this.#formatConnectionKey(
      userID,
      connection.targetID,
    );

    const connectionDoc = {
      ...connection,
      _id: connectionKey,
    };

    const { id, rev, ok } = await this.#db.put(connectionDoc);

    if (!ok) {
      console.error(
        `Failed to create ${connectionKey} (id=${id} , rev=${rev})`,
      );
    }

    return {
      ...connectionDoc,
      _rev: rev,
    };
  }

  /**
   * Retrieves connections for either the specified userID or for the current user
   * @param {string} [userID]
   * @returns {Promise<Array<VillageConnection>>}
   */
  async getConnections(userID) {
    userID = userID || this.getCurrentUserID();
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

  /**
   * Retrieves user by email
   * @param {string} email The email of the user to retrieve
   * @returns {Promise<User>}
   */
  async getUserByEmail(email) {
    const users = await this.#db.allDocs({
      include_docs: true,
      startkey: 'user',
      endkey: `user\ufff0`,
    });

    const user = users.rows.find((row) => row.doc.email === email)?.doc;
    return user || null;
  }

  async getUserByName(name) {
    const users = await this.#db.allDocs({
      include_docs: true,
      startkey: 'user',
      endkey: 'user\ufff0',
    });

    console.log(users);
    const user = users.rows.filter((row) => row.doc.name === name);
    return user;
  }

  /**
   * Adds a new user
   * @param {CreateUserInput} userData User data to create a new user
   * @returns {Promise<User>} The created user
   */
  async addUser(userData) {
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      console.error(`An account with ${userData.email} already exists`);
      return existingUser;
    } else {
      const userID = self.crypto.randomUUID();
      const userDoc = {
        _id: this.#formatUserKey(userID),
        userID,
        ...userData,
      };

      const { rev } = await this.#db.put(userDoc);

      return {
        ...userDoc,
        _rev: rev,
      };
    }
  }

  /**
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async updateUser(user) {
    const { rev } = await this.#db.put(user);

    user._rev = rev;

    return user;
  }

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
   * @returns
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
      const groupChat = this.#db.get(this.#formatGroupKey(gcID));
    } catch (err) {
      return null;
    }
  }

  /**
   * Adds a group chat with the given ID to the database.
   * @param {number} gcID
   */
  async addGroupChat(gcID) {
    const existingGC = await this.getGroupById(gcID);

    if (existingGC) {
      console.error(`Group chat with ID ${gcID} already exists.`);
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
   * @param {number} pID
   * @param {string} content
   * @param {Date} time
   */
  async addMessage(gcID, pID, content, time) {
    const messageID = self.crypto.randomUUID();
    const messageDoc = {
      _id: this.#formatGroupMessageKey(`${gcID}`, messageID),
      messageID: messageID,
      GroupChatID: gcID,
      PersonID: pID,
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
   * Adds a person with the given ID, name, and avatar to the database.
   * @param {number} pID
   * @param {string} name
   * @param {string} avatar
   */
  async addPerson(pID, name, avatar) {
    const personDoc = {
      _id: 'person_' + pID,
      name: name,
      avatar: avatar,
    };

    const { id, rev, ok } = await this.#db.put(personDoc);

    if (!ok) {
      console.error(`Failed to create ${pID} (id=${id}, rev=${rev})`);
    }
    return {
      _id: id,
      _rev: rev,
      ...personDoc,
    };
  }

  /**
   *
   * @param {string} gcId
   * @param {string} pID
   */
  #formatGroupChatMemberKey(gcId, pID) {
    return `groupchatmember_${gcId}_${pID}`;
  }

  /**
   * Adds a group chat member with the given person ID and group chat ID.
   * @param {number} pID
   * @param {number} gcID
   * @returns
   */
  async addGroupChatMember(pID, gcID) {
    const gcmDoc = {
      _id: this.#formatGroupChatMemberKey(`${gcID}`, `${pID}`),
      PersonID: pID,
      GroupChatID: gcID,
    };

    const { id, rev, ok } = await this.#db.put(gcmDoc);

    if (!ok) {
      console.error(`Failed to create ${gcID}_${pID} (id=${id}, rev=${rev})`);
    }

    return {
      _id: id,
      _rev: rev,
      ...gcmDoc,
    };
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
