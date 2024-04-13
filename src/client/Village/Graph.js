class Node {
  id;
  name;
  personalVillage;
  avatar;

  //Params : user -> Person
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.personalVillage = {};
    this.avatar = user.avatar;
  }

  addConnection(user) {
    if (!this.personalVillage[user.id]) {
      this.personalVillage[user.id] = user;
    }
  }

  deleteConnection(user) {
    if (this.personalVillage[user.id]) {
      delete this.personalVillage[user.id];
      delete user.village[this.id];
    }
  }

  getName(){
    return this.name;
  }

  getAvatar() {
    return this.avatar;
  }

  getVillage() {
    return this.personalVillage;
  }
}

class Graph {
  nodes = {};

  constructor() {
    this.nodes = {};
  }

  addNode(user) {
    if (!this.nodes[user.id]) {
      this.nodes[user.id] = user;
    }
  }

  addConnection(user1, user2) {
    if (this.nodes[user1.id] && this.nodes[user2.id]) {
      console.log('addConnection', this.nodes[user1.id]);
      console.log('addConnection', this.nodes[user2.id]);
      this.nodes[user1.id].addConnection(user2);
      this.nodes[user2.id].addConnection(user1);
    }
  }

  deleteConnection(user1, user2) {
    if (this.nodes[user1] && this.nodes[user2]) {
      this.nodes[user1.id].deleteConnection(user2);
      this.nodes[user2.id].deleteConnection(user1);
    }
  }

  getConnections(user) {
    if (this.nodes[user.id]) {
      return this.nodes[user.id].getVillage();
    }
    return {};
  }
}

export { Graph, Node };
