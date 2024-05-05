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
    const createPinResponse = await fetch(`/pins`, {
      method: 'POST',
      body: JSON.stringify(pinData),
    });

    if (!createPinResponse.ok) {
      console.error(`FAILED TO CREATE PIN WITH ${pinData}`);
      return;
    }

    return createPinResponse.json();
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

      return pinData.json();
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
    const updatePinResponse = await fetch(`/pins/${pin.pinID}`, {
      method: 'PUT',
      body: JSON.stringify(pin),
    });

    if (!updatePinResponse.ok) {
      console.error(`Failed to update ${pin.pinID}`);
      return null;
    }

    return updatePinResponse.json();
  }

  /**
   * Calls the backend Delete route to delete pin
   * @param {Pin} pin The pin to delete
   * @returns {Promise<PouchDB.Core.Response>}
   */
  async deletePin(pin) {
    const deletePinResponse = await fetch(`/pins/${pin.pinID}`, {
      method: 'DELETE',
    });
    return await deletePinResponse.json();
  }

  /**
   * Retrieve upcoming pins
   * @returns {Promise<Array<Pin>>}
   */
  async getUpcomingPins() {
    try {
      const upcomingPinsResponse = await fetch('/pins?type=active');

      if (!upcomingPinsResponse.ok) {
        console.log('Failed to get active pins');
        return null;
      }

      return upcomingPinsResponse.json();
    } catch (err) {
      console.log(err);
      return [];
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

    if (!userResponse.ok) {
      console.error('Failed to get user');
      return null;
    }

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
      return data.json();
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
      body: JSON.stringify(user),
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
        bio: bio,
      };
      const data = await fetch(`/users/${newUserData.userID}`, {
        method: 'PUT',
        body: JSON.stringify(newUserData),
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
    try {
      const createPromise = await fetch(
        `/users/${connection.userID}/connections/`,
        {
          method: 'POST',
          body: JSON.stringify({
            targetID: connection.targetID,
          }),
        },
      );
      if (!createPromise.ok) {
        console.error(`FAILED TO CREATE CONNECTION`);
        return;
      }
      return createPromise.json();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Calls the get call to get all connections of userID
   * @param {string} [userID]
   * @returns {Promise<Array<VillageConnection>>}
   */
  async getConnections(userID) {
    try {
      const getPromise = await fetch(`/users/${userID}/connections`);
      if (!getPromise.ok) {
        console.error(`FAILED TO GET ALL CONNECTIONS OF ${userID}`);
        return;
      }
      return getPromise.json();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Calls the delete backend to delete connection
   * @param {VillageConnection} connection Connection to delete
   * @returns {Promise<PouchDB.Core.Response>}
   */
  async deleteConnection(connection) {
    try {
      const deletePromise = await fetch(
        `/users/${connection.userID}/connections/${connection.targetID}`,
        {
          method: 'DELETE',
        },
      );
      return deletePromise.json();
    } catch (err) {
      console.error(err);
    }
  }

  // ********************************************
  // Pin Attendees
  // ********************************************

  /**
   * Add an attendee to a pin
   * @param {string} pinID
   * @returns {Promise<PinAttendee>}
   */
  async joinPin(pinID) {
    const joinPinResponse = await fetch(`/${pinID}/attendees`, {
      method: 'POST',
    });

    if (!joinPinResponse.ok) {
      console.error('Failed to join pin');
      return null;
    }

    return joinPinResponse.json();
  }

  /**
   * Get the attendees of a pin
   * @param {string} pinID
   */
  async getPinAttendees(pinID) {
    const pinAttendeesResponse = await fetch(`/${pinID}/attendees`);

    if (!pinAttendeesResponse.ok) {
      console.error('Failed to get pin attendees');
      return null;
    }

    return pinAttendeesResponse.json();
  }

  /**
   * Removes an attendee from a pin
   * @param {PinAttendee} attendee
   */
  async removePinAttendee(attendee) {
    const removeAttendeeResponse = await fetch(
      `/${attendee.pinID}/attendees/${attendee.userID}`,
      {
        method: 'DELETE',
      },
    );

    if (!removeAttendeeResponse.ok) {
      console.error('Failed to leave pin');
    }
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
