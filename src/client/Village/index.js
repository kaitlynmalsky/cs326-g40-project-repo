import View from '../View.js';
import { Node } from './Graph.js';
import dbInstance from '../database.js';

export default class VillageView extends View {
  constructor() {
    super();
    const currentUserID = dbInstance.getCurrentUserID();

    /**
     * @type {import('../database.js').CreateUserInput}
     */
    const newUser = {
      name: 'scooby doo',
      username: 'sooby_doo',
      email: 'soobyDoo@gmail.com',
      password: 'Paul_Atreides',
      avatar: '../images/Sooby_doo.png'
    }

    const newUser2 = {
      name: 'nemo',
      username: 'Nemo123',
      email: 'nemoIsLost@yahoo.com',
      password: 'DoryIsMyLoove',
      avatar: '../images/nemo.png'
    }

    const mockUser = {
      name: "Cat",
      username: "cat123",
      email: "cat123@example.com",
      avatar: './images/placeholder_avatar.png',
      password: 'dontdr'
    }

    const userList = [newUser, newUser2, mockUser];

    let users = null;
    this.init(userList).then(res => { users = res; console.log(userList); });
    if (users !== null) {
      for (const user of users) {
        dbInstance.createConnection({
          userID: currentUserID,
          targetID: user.userID
        });
      }
    }

    console.log('HERE!');

  }

  async init(userList) {
    const res = [];
    for (const user of userList) {
      res.push(await dbInstance.addUser(user));
    }
    return res;
  }

  async render() {
    const villageViewElm = document.createElement('div');
    villageViewElm.id = 'village-view';
    villageViewElm.className = 'mt-5 ml-5 mr-5 grid grid-cols-10 gap-5';

    const header1Elm = document.createElement('div');
    header1Elm.className = 'col-span-full flex justify-between items-center bg-gray-800 p-2 rounded-lg';
    header1Elm.innerHTML = `<h2 class="text-white text-lg font-bold flex-grow">CONNECTIONS</h2><button class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>`;
    villageViewElm.appendChild(header1Elm);

    const connections = await dbInstance.getConnections();
    console.log('connections', connections);

    for (const userId in connections) {
      const connection = connections[userId];
      console.log(`userID : ${userId}`, connection);
      const connectionElm = document.createElement('div');
      connectionElm.className = 'relative p-1 m-2';
      /*
      connectionElm.innerHTML = `
      <div class="group cursor-pointer">
        <img src="${connection}" alt="${connection.getName()}" class="w-24 h-24 rounded-full border-2 border-white shadow">
        <div class="absolute w-full px-2 py-1 text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity text-center" style="top: 100%; left: 50%; transform: translateX(-50%);"> 
          ${connection.getName()}
        </div>
      </div>
    `;
    */
      villageViewElm.appendChild(connectionElm);
    }




  }