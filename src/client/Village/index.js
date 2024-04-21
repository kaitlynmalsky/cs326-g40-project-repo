import View from '../View.js';
import dbInstance from '../database.js';

export default class VillageView extends View {
  #showButton;
  #currentUserID;
  constructor() {
    super();
    this.#showButton = false;

    this.initSampleData();
    this.initEventHandlers();
  }

  async initSampleData() {
    const userList = [
      { name: 'scooby doo', username: 'sooby_doo', email: 'food@scooby.org', avatar: '../images/Sooby_doo.png', password: 'woof' },
      { name: 'nemo', username: 'nemo123', email: 'fish@ocean.org', avatar: '../images/nemo.png', password: 'WhereIsNemo' },
      { name: 'Cat', username: 'cat123', email: 'cat123@example.com', avatar: './images/placeholder_avatar.png', password: 'dontdr' },
    ];

    await this.init(userList);
  }

  async init(userList) {
    this.#currentUserID = await dbInstance.getCurrentUserID();
    for (const user of userList) {
      await dbInstance.createConnection({
        userID: this.#currentUserID,
        targetID: (await dbInstance.addUser(user)).userID,
      });
    }
  }

  initEventHandlers() {
    document.addEventListener('toggleDelete', this.toggleDeleteButton.bind(this));
  }

  toggleDeleteButton() {
    this.#showButton = !this.#showButton;
    this.updateDeleteButtonsVisibility();
  }

  updateDeleteButtonsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(btn => {
      // @ts-ignore
      btn.style.display = this.#showButton ? 'block' : 'none';
    });
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
    header1Elm.innerHTML = `<h2 class="text-white text-lg font-bold flex-grow">CONNECTIONS</h2><button onclick="document.dispatchEvent(new CustomEvent('toggleDelete'))" class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded">Toggle Delete</button>`;
    villageViewElm.appendChild(header1Elm);

    const connectionsDiv = document.createElement('div');
    this.connectionsDiv = connectionsDiv;
    villageViewElm.appendChild(connectionsDiv);

    return villageViewElm;
  }

  async onLoad() {
    await this.loadConnections();
  }

  async loadConnections() {
    this.connectionsDiv.innerHTML = '';

    const connections = await dbInstance.getConnections();
    console.log('connections', connections);

    const elSize = 12;
    for (const connection of connections) {
      const user = await dbInstance.getUser(connection.targetID);
      console.log(`userID : ${user.userID}`, user);
      const connectionElm = document.createElement('div');
      connectionElm.className = `size-${elSize} relative p-1 m-2`;

      connectionElm.innerHTML = `
      <div class="group cursor-pointer">
        <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 rounded-full border-2 border-white shadow">
        <div class="absolute w-full px-2 py-1 text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity text-center" style="top: 100%; left: 50%; transform: translateX(-50%);"> 
          ${user.name}
        </div>
      </div>
      `;

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-button';
      delBtn.style.display = 'none';
      delBtn.innerText = 'Delete';
      delBtn.addEventListener('click', () => {
        dbInstance.deleteConnection(connection)
        this.loadConnections();
      });

      connectionElm.appendChild(delBtn);

      this.connectionsDiv.appendChild(connectionElm);
    }

    this.updateDeleteButtonsVisibility()
  }
}