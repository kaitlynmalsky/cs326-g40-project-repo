import localStorageInstance from "../database.js";

class Node {
  id;
  name;
  personalVillage = [];
  avatar;

  constructor(user) {
    this.id = user.id;
    const { promise, resolve } = Promise.withResolvers();
    this.ready = promise;
    this.loadFromStorage(user, resolve);
  }

  get storageKey() {
    return `users_${this.id}`;
  }

  async loadFromStorage(user, setReady) {
    if (await localStorageInstance.has(this.storageKey)) {
      const data = await localStorageInstance.get(this.storageKey);
      this.id = data.id;
      this.name = data.name;
      this.personalVillage = data.personalVillage;
      this.avatar = data.avatar;
    } else {
      this.id = user.id;
      this.name = user.name;
      this.personalVillage = [];
      this.avatar = user.avatar;
      await this.saveToStorage();
    }

    setReady();
  }

  async saveToStorage() {
    const data = {
      id: this.id,
      name: this.name,
      personalVillage: this.personalVillage,
      avatar: this.avatar
    }
    await localStorageInstance.set(this.storageKey, data);
  }

  async addConnection(user) {
    if (!this.personalVillage.includes(user.id)) {
      this.personalVillage.push(user.id);

      const otherUser = new Node(user);

      otherUser.ready.then(() => {
        otherUser.personalVillage.push(this.id);
        otherUser.saveToStorage();
      });

      await this.saveToStorage();
    }
  }

  async deleteConnection(user) {
    if (this.personalVillage[user.id]) {
      this.personalVillage = this.personalVillage.filter(node => node != user.id);

      const otherUser = new Node(user);

      otherUser.ready.then(() => {
        otherUser.personalVillage = otherUser.personalVillage.filter(node => node != this.id);
        otherUser.saveToStorage();
      });

      await this.saveToStorage();
    }
  }

  getName() {
    return this.name;
  }

  getAvatar() {
    return this.avatar;
  }

  async getVillage() {
    const village = {};
    console.log('apple', this.personalVillage);

    for (const userId of this.personalVillage) {
      village[userId] = new Node({ id: userId });
    }

    await Promise.all(Object.keys(village).map(u => u.ready));

    console.log('orange', village);
    return village;
  }

  async updateVillage(village) {
    this.personalVillage = village;
    await this.saveToStorage();
  }
}


export { Node };
