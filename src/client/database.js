class Database {
  static #instance = null;
  #local_storage = null;

  static async db() {
    if (!Database.#instance) {
      Database.#instance = new Database();
      await Database.#instance.initialize();
    }
    return Database.#instance;
  }

  async initialize() {
    this.#local_storage = window.localStorage;
    console.log(this.#local_storage);
  }

  async has(key) {
    return this.#local_storage.getItem(key) !== null;
  }

  async get(key) {
    return JSON.parse(await this.#local_storage.getItem(key));
  }

  async set(key, value) {
    this.#local_storage.setItem(key, JSON.stringify(value));
  }

  async remove(key) {
    this.#local_storage.removeItem(key);
  }

  async clear() {
    this.#local_storage.clear();
  }

  async addPin(pinData) {
    const pins = await this.getAllPins();
    pinData.id = pins.length;
    pins.push(pinData);
    await this.set('pins', JSON.stringify(pins));
    return pinData;
  }

  async getPin(pinID) {
    const pins = await this.getAllPins();
    return pins.find((pin) => pin.pinID === pinID);
  }

  async updatePin(pinID, newData) {
    const pins = await this.getAllPins();
    const updatedPins = pins.map((pin) => {
      if (pin.pinID === pinID) {
        return { ...pin, ...newData };
      }
      return pin;
    });
    await this.set('pins', JSON.stringify(updatedPins));
  }

  async deletePin(pinID) {
    const pins = await this.getAllPins();
    const filteredPins = pins.filter((pin) => pin.pinID !== pinID);
    await this.set('pins', JSON.stringify(filteredPins));
  }

  async getAllPins() {
    const pinsData = await this.get('pins');
    return pinsData ? JSON.parse(pinsData) : [];
  }

  async getAllNodes() {
    const peopleData = await this.get('villageGraph');
    return peopleData ? JSON.parse(peopleData) : {};
  }

  async addPerson(personData) {
    const people = await this.getAllPeople();
    people.push(peopleData);
    await this.set('villageGraph', people);
  }

  async getPersonID() {
    return await this.getAllPeople().length();
  }
}

const localStorageInstance = await Database.db();
export default localStorageInstance;
