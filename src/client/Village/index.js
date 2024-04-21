import View from '../View.js';
import dbInstance from '../database.js';

export default class VillageView extends View {
  constructor() {
    super();

    const currentUserID = dbInstance.getCurrentUserID();

    const newUser = {
      id: 2,
      name: 'scooby doo',
      avatar: '../images/Sooby_doo.png',
    };

    const newUser2 = {
      id: 3,
      name: 'nemo',
      avatar: '../images/nemo.png',
    };

    const mockUser = {
      name: "Cat",
      username: "cat123",
      email: "cat123@example.com",
      avatar: './images/placeholder_avatar.png',
      password: 'dontdr'
    }

    const userList = [newUser, newUser2, mockUser];
    this.init(userList);

    console.log(dbInstance.getUserByName("Cat"));

  }

  async init(userList) {
    const currentUserID = dbInstance.getCurrentUserID();
    for (const user of userList) {
      dbInstance.createConnection({userID: currentUserID, targetID: (await dbInstance.addUser(user)).userID});
    }
  }

  async render() {
    const villageViewElm = document.createElement('div');
    villageViewElm.id = 'village-view';
    villageViewElm.className = 'mt-5 ml-5 mr-5 grid grid-cols-10 gap-5';

    const headerElm = document.createElement('div');
    headerElm.className =
      'col-span-full flex justify-between items-center mb-2 bg-gray-800 p-2 rounded-lg';
    headerElm.innerHTML = `<h2 class="text-white text-lg font-bold m-0">CONNECTION INVITES</h2>`;
    villageViewElm.appendChild(headerElm);

    const header1Elm = document.createElement('div');
    header1Elm.className =
      'col-span-full flex justify-between items-center bg-gray-800 p-2 rounded-lg';
    header1Elm.innerHTML = `<h2 class="text-white text-lg font-bold flex-grow">CONNECTIONS</h2><button class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>`;
    villageViewElm.appendChild(header1Elm);

    const connections = await this.graph.getVillage();
    console.log('connections', connections);

    const elSize = 12;
    for (const userId in connections) {
      const connection = connections[userId];
      console.log(`userID : ${userId}`, connection);
      const connectionElm = document.createElement('div');
      connectionElm.className = `size-${elSize} relative p-1 m-2`;

      connectionElm.innerHTML = `
      <div class="group cursor-pointer">
        <img src="${connection}" alt="${connection.getName()}" class="w-24 h-24 rounded-full border-2 border-white shadow">
        <div class="absolute w-full px-2 py-1 text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity text-center" style="top: 100%; left: 50%; transform: translateX(-50%);"> 
          ${connection.getName()}
        </div>
      </div>
    `;
      villageViewElm.appendChild(connectionElm);
    }


    return villageViewElm;



  }
}