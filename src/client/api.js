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
 * @property {string} GroupChatID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents which people are in which group chats.
 * @typedef {Object} GroupChatMember
 * @property {string} UserID
 * @property {string} GroupChatID
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Represents a message.
 * @typedef {Object} GroupChatMessage
 * @property {string} messageID
 * @property {string} GroupChatID
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
    const createPinResponse = await fetch(`/api/pins`, {
      headers: {
        'Content-Type': 'application/json',
      },
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
      const pinData = await fetch(`/api/pins/${pinID}`);

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
    const updatePinResponse = await fetch(`/api/pins/${pin.pinID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
   * @returns {Promise<void>}
   */
  async deletePin(pin) {
    await fetch(`/api/pins/${pin.pinID}`, {
      method: 'DELETE',
    });
  }

  /**
   * Retrieve upcoming pins
   * @returns {Promise<Array<Pin>>}
   */
  async getUpcomingPins() {
    try {
      const upcomingPinsResponse = await fetch('/api/pins?type=active');

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
   * Fetches the current user
   * @returns {Promise<User | null>}
   */
  async getMe() {
    try {
      const meResponse = await fetch('/api/users/me');

      if (!meResponse.ok) {
        console.error('Failed to get me');
        return null;
      }

      return meResponse.json();
    } catch (err) {
      return null;
    }
  }

  /**
   * Calls the get backend to get user by userID
   * @param {string} userID The ID of the user to retrieve
   * @returns {Promise<User | null>}
   */
  async getUser(userID) {
    const userResponse = await fetch(`/api/users/${userID}`);

    if (!userResponse.ok) {
      console.error('Failed to get user');
      return null;
    }

    return userResponse.json();
  }

  /**
   * Gets a list of users by userIDs
   * @param {string[]} userIDs
   * @returns {Promise<User[]>}
   */
  async getUsers(userIDs) {
    const reqUrl = new URL('/api/users', location.origin);

    userIDs.forEach((userID) => reqUrl.searchParams.append('userID', userID));

    const usersResponse = await fetch(reqUrl);

    if (!usersResponse.ok) {
      console.error('Failed to get users');
      return [];
    }

    return usersResponse.json();
  }

  /**
   * Calls the get backend to get user by email
   * @param {string} email The email of the user to retrieve
   * @returns {Promise<User | null>}
   */
  async getUserByEmail(email) {
    try {
      const data = await fetch(`/api/users/?email=${email}`);
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
    const data = await fetch(`/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
      const data = await fetch(`/api/users/${newUserData.userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
        `/api/users/${connection.userID}/connections/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      const getPromise = await fetch(`/api/users/${userID}/connections`);
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
   * @param {string} userID Source of the connection
   * @param {string} targetID Target of the connection
   * @returns {Promise<void>}
   */
  async deleteConnection(userID, targetID) {
    try {
      await fetch(`/api/users/${userID}/connections/${targetID}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Calls the get backend to get Connection Suggestions
   * @param {string} [userID]
   * @returns {Promise<Array<import("../server/database.js").ConnectionSuggestion>>}
   */
  async getConnectionSuggestions(userID) {
    try {
      const getPromise = await fetch(`/api/users/${userID}/suggestions`);
      if (!getPromise.ok) {
        console.error(`FAILED TO GET CONNECTION SUGGESTIONS`);
        return;
      }
      return getPromise.json();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Calls the delete backend to delete connection
   * @param {string} [userID]
   * @param {string} [targetID]
   * @returns {Promise<void>}
   */
  async delConnectionSuggestions(userID, targetID) {
    try {
      await fetch(`/api/users/${userID}/suggestions/${targetID}`, {
        method: 'DELETE',
      });
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
    const joinPinResponse = await fetch(`/api/pins/${pinID}/attendees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
   * @returns {Promise<PinAttendee[]>}
   */
  async getPinAttendees(pinID) {
    const pinAttendeesResponse = await fetch(`/api/pins/${pinID}/attendees`);

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
      `/api/pins/${attendee.pinID}/attendees/${attendee.userID}`,
      {
        method: 'DELETE',
      },
    );

    if (!removeAttendeeResponse.ok) {
      console.error('Failed to leave pin');
    }
  }
  // ********************************************
  // Groups
  // ********************************************

  /**
   * Returns a list of pins that the current user is a part of.
   * @returns {Promise<{userID: string, pinID: string}[]>}
   */
  async getUserGroups() {
    const getPinsResponse = await fetch(`/api/groups/`, { method: 'GET' });
    if (!getPinsResponse.ok) {
      console.error(`Failed to get user groups`);
    }
    return getPinsResponse.json();
  }

  /**
   * Sends message with given pin ID, timestamp, and content. (can this return void idk)
   * @param {string} pinID
   * @param {string} time
   * @param {string} content
   * @returns {Promise<void>} change later??
   */
  async sendMessage(pinID, time, content) {
    const sendMessageResponse = await fetch(`api/groups/${pinID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: content, timeString: time }),
    });
    if (!sendMessageResponse.ok) {
      console.error(`Error sending message`);
    }
    return;
  }

  /**
   * Gets all messages from a given pin (group) ID.
   * @param {string} pinID
   */
  async getGroupMessages(pinID) {
    const getMessagesResponse = await fetch(`/api/groups/${pinID}/messages`, {
      method: 'GET',
    });
    if (!getMessagesResponse.ok) {
      console.error(`Failed to get messages`);
    }
    return getMessagesResponse.json();
  }
}

const dbInstance = new Database();
export default dbInstance;
