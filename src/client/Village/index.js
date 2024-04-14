import View from '../View.js';
import { Node } from './Graph.js';

export default class VillageView extends View {
  constructor() {
    super();
    const currentUser = {
      id: 1,
      name: 'cat',
      avatar: '../images/placeholder_avatar.png'
    }

    this.graph = new Node(currentUser);         // replace currentUser data from login

    const newUser = {
      id: 2,
      name: 'scooby doo',
      avatar: '../images/Sooby_doo.png'
    }

    const newUser2 = {
      id: 3, 
      name: 'nemo',
      avatar: '../images/nemo.png'
    }

    this.graph.ready.then(() => {
      this.graph.addConnection(newUser);
      this.graph.addConnection(newUser2);
    })
  }

async render() {
  const villageViewElm = document.createElement('div');
  villageViewElm.id = 'village-view';

  // Header element
  const headerElm = document.createElement('div');
  headerElm.className = 'header';
  headerElm.innerHTML = `<h2>CONNECTIONS</h2><button class="delete-btn">Delete</button>`;
  villageViewElm.appendChild(headerElm);

  const connections = await this.graph.getVillage();

  console.log('connections', connections);

  const numConnections = Object.keys(connections).length;

  let leftPosition = 0;
  for (const userId in connections) {
    const connection = connections[userId];
    const connectionElm = document.createElement('div');
    connectionElm.className = 'user_connections';
    connectionElm.innerHTML = `
      <img src="${connection.getAvatar()}" alt="${connection.getName()}">
    `;
    villageViewElm.appendChild(connectionElm);
    const overlayElm = document.createElement('div');
    overlayElm.className = 'overlay';
    const text = document.createElement('div');
    text.className = 'text';
    text.innerHTML = `${connection.getName()}`;
    overlayElm.appendChild(text);
    connectionElm.appendChild(overlayElm);
  }

  return villageViewElm;
}


}
