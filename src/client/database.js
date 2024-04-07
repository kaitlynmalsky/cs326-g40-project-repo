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
        this.#local_storage.set('pins', []); 
    }

    async has(key){
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
        pins.push(pinData);
        await this.#local_storage.setItem('pins', JSON.stringify(pins));
    }

    async getPin(pinID) {
        const pins = await this.getAllPins();
        return pins.find(pin => pin.pinID === pinID);
    }

    async updatePin(pinID, newData) {
        const pins = await this.getAllPins();
        const updatedPins = pins.map(pin => {
            if (pin.pinID === pinID) {
                return { ...pin, ...newData };
            }
            return pin;
        });
        await this.#local_storage.setItem('pins', JSON.stringify(updatedPins));
    }

    async deletePin(pinID) {
        const pins = await this.getAllPins();
        const filteredPins = pins.filter(pin => pin.pinID !== pinID);
        await this.#local_storage.setItem('pins', JSON.stringify(filteredPins));
    }

    async getAllPins() {
        const pinsData = await this.#local_storage.getItem('pins');
        return pinsData ? JSON.parse(pinsData) : [];
    }
}



const localStorageInstance = await Database.db();
export default localStorageInstance;



