/**
 * Input data to create a VillageLink User
 * @typedef {Object} CreateUserInput
 * @property {string} name The user's name
 * @property {string} avatar The user's avatar
 */

/**
 * Represents a VillageLink user object
 * @typedef {Object} User
 * @property {string} userID The ID of the user
 * @property {string} name The user's name
 * @property {string} avatar The user's avatar
 * @property {string} _id PouchDB ID
 * @property {string} _rev PouchDB revision
 */

/**
 * Input data to create a VillageLink Pin
 * @typedef {Object} CreatePinInput
 * @property {string} startTime The start time of the pin's event (in ISO-8601 format)
 * @property {string} endTime The end time of the pin's event (in  ISO-8601 format)
 * @property {string} details The pin details
 * @property {[number, number]} coords The [lat,long] coordinates representing the pin's location
 */

/**
 * Represents a VillageLink pin object
 * @typedef {Object} Pin
 * @property {string} pinID The ID of the pin
 * @property {string} startTime The start time of the pin's event (in ISO-8601 format)
 * @property {string} endTime The end time of the pin's event (in  ISO-8601 format)
 * @property {string} details The pin details
 * @property {[number, number]} coords The [lat,long] coordinates representing the pin's location
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
 * @class
 */
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
      ...pinData,
    };

    const { id, rev, ok } = await this.#db.put(pinDoc);

    if (!ok) {
      console.error(`Failed to create ${pinID} (id=${id} , rev=${rev})`);
    }

    return {
      ...pinData,
      pinID,
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
}

const dbInstance = new Database();
export default dbInstance;
