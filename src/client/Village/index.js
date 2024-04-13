import View from '../View.js';
import Person from './Person.js';
import { Graph, Node } from './Graph.js';
import localStorageInstance from '../database.js';

export default class VillageView extends View {
  constructor() {
    super();
    this.graph = new Graph();
    const user = {
      id: 1,
      name: 'Scoob',
      avatar: '../images/Sooby_doo.png'
    }
    this.currentUser = new Node(user);                          // Change this to get currentUser info from login 
    this.graph.addNode(this.currentUser);

    const user2 = {
      id: 2, 
      name: 'Cat',
      avatar: '../images/placeholder_avatar.png'
    }

    const user3 = {
      id: 3, 
      name: 'nemo',
      avatar: '../images/nemo.png'
    }

    const newUser = new Node(user2);
    const newUser2 = new Node(user3);
    this.graph.addNode(newUser);
    this.graph.addNode(newUser2);
    
    this.graph.addConnection(user, newUser);
    this.graph.addConnection(user, newUser2);
    console.log(this.graph);
  }

  render() {
    const villageViewElm = document.createElement('div');
    villageViewElm.id = 'village-view';

    const currentUserElm = document.createElement('div');
    currentUserElm.className = 'user';
    currentUserElm.innerHTML = `
    <img src="${this.currentUser.getAvatar()}" alt="${this.currentUser.getName()}">
    <p>${this.currentUser.getName()}</p>
  `;
    villageViewElm.appendChild(currentUserElm);

    const connections = this.graph.getConnections(this.currentUser);

    console.log('connections', connections);

    const numConnections = Object.keys(connections).length;
    const connectionSpacing = numConnections > 1 ? 100 / (numConnections - 1) : 0;

    let leftPosition = 0;
    for (const userId in connections) {
      const connection = connections[userId];
      const connectionElm = document.createElement('div');
      connectionElm.className = 'user_connections';
      connectionElm.style.left = leftPosition + '%';
      connectionElm.innerHTML = `
      <img src="${connection.getAvatar()}" alt="${connection.getName()}">
      <p>${connection.getName()}</p>
    `;
      villageViewElm.appendChild(connectionElm);
      leftPosition += connectionSpacing;
    }

    return villageViewElm;
  }

}
