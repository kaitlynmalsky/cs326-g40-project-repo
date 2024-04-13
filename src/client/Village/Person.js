import localStorageInstance from '../database.js';

class Person {
  #name;
  #bio;
  id;
  #avatar;

  constructor(name) {
    this.#name = name;
    this.id = localStorageInstance.getPersonID();
  }

  addBio(bio) {
    this.#bio = bio;
  }

  addAvatar(avatarSrc) {
    this.#avatar = avatarSrc;
  }
}

export default Person;
