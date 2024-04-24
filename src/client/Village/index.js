import View from '../View.js';
import dbInstance from '../database.js';

export default class VillageView extends View {
  #showButton;
  #currentUserID;
  constructor() {
    super();
    this.#showButton = false;

    this.initEventHandlers();
  }

  async initSampleData() {
    const userList = [
      {
        name: 'scooby doo',
        username: 'sooby_doo',
        email: 'food@scooby.org',
        avatar: '../images/Sooby_doo.png',
        password: 'woof',
      },
      {
        name: 'nemo',
        username: 'nemo123',
        email: 'fish@ocean.org',
        avatar: '../images/nemo.png',
        password: 'WhereIsNemo',
      },
      {
        name: 'Cat',
        username: 'cat123',
        email: 'cat123@example.com',
        avatar: './images/placeholder_avatar.png',
        password: 'dontdr',
      },
    ];

    await this.init(userList);
  }

  async init(userList) {
    const currentUserID = dbInstance.getCurrentUserID();
    for (const user of userList) {
      const targetId = (await dbInstance.addUser(user)).userID;
      await Promise.all([
        dbInstance.createConnection({
          userID: currentUserID,
          targetID: targetId,
        }),
        dbInstance.createConnection({
          userID: targetId,
          targetID: currentUserID,
        }),
      ]);
    }
    await dbInstance.createConnection({
      targetID: (await dbInstance.addUser(userList[0])).userID,
      userID: (await dbInstance.addUser(userList[2])).userID,
    });
  }

  initEventHandlers() {
    document.addEventListener(
      'toggleDelete',
      this.toggleDeleteButton.bind(this),
    );
  }

  toggleDeleteButton() {
    this.#showButton = !this.#showButton;
    this.updateDeleteButtonsVisibility();
  }

  updateDeleteButtonsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((btn) => {
      // @ts-ignore
      btn.style.display = this.#showButton ? 'block' : 'none';
    });
  }

  async render() {
    await this.initSampleData();

    const villageViewElm = document.createElement('div');
    villageViewElm.id = 'village-view';
    /*
    const headerElm = document.createElement('div');
    headerElm.className = 'header';
    headerElm.innerHTML = `<h2>CONNECTION INVITES</h2>`;
    villageViewElm.appendChild(headerElm);
    */

    const header1Elm = document.createElement('div');
    header1Elm.className = 'header';
    header1Elm.innerHTML = `<h2>CONNECTIONS</h2><button onclick="document.dispatchEvent(new CustomEvent('toggleDelete'))">Toggle Delete</button>`;
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

    const grid = document.createElement('div');
    grid.className = 'grid-dude';

    const elSize = 12;
    let connectionCount = 0;
    for (const connection of connections) {
      const user = await dbInstance.getUser(connection.targetID);
      const connectionElm = document.createElement('div');
      connectionElm.className = `user_connections`;

      const grp = document.createElement('div');
      grp.className = 'group';
      grp.setAttribute('data-toggle', 'popover');
      const img = document.createElement('img');
      img.src = user.avatar;
      img.alt = user.name;
      grp.appendChild(img);

      const popover = document.createElement('div');
      popover.className = 'popover bottom';

      const content = document.createElement('div');
      content.className = 'popover-content';
      const text = document.createElement('h3');
      text.className = 'popover-title';
      text.innerHTML = user.name;
      content.appendChild(text);
      popover.appendChild(content);


      const subConn = document.createElement('div');
      subConn.className = 'sub-connections';
      subConn.style.maxHeight = '200px';
      subConn.style.overflowY = 'auto';
      const dataArr = await dbInstance.getConnections(user.userID);
      console.log(dataArr);

      for (const elm of dataArr) {
        const dataElm = await dbInstance.getUser(elm.targetID);
        console.log(dataElm);
        const subConnElm = document.createElement('div');
        subConnElm.className = 'sub-connection-elements';
        const imgElm = document.createElement('img');
        imgElm.src = dataElm.avatar;
        imgElm.alt = dataElm.name;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = dataElm.name;
        nameSpan.className = 'sub-connection-name';
        subConnElm.appendChild(imgElm);
        subConnElm.appendChild(nameSpan);
        subConn.appendChild(subConnElm);
      }
      content.appendChild(subConn);

      grp.appendChild(popover);

      grp.addEventListener('click', () => {
        if (popover.style.visibility === 'visible') {
          popover.style.visibility = 'hidden';
        } else {
          popover.style.visibility = 'visible';
        }
      });

      connectionElm.appendChild(grp);

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-button';
      delBtn.style.display = 'none';
      delBtn.innerText = 'Delete';
      delBtn.addEventListener('click', () => {
        dbInstance.deleteConnection(connection);
        this.loadConnections();
      });

      connectionElm.appendChild(delBtn);

      grid.appendChild(connectionElm);
      /*
      connectionCount++;

      // Check if adding one more connection will cause overflow
      if (connectionCount % 5 === 0) { // Adjust this number based on your layout
        // Add an empty element to force the grid to move to the next row
        const emptyEl = document.createElement('div');
        emptyEl.style.visibility = 'hidden';
        grid.appendChild(emptyEl);
      }
      */
    }

    this.connectionsDiv.appendChild(grid);

    this.updateDeleteButtonsVisibility();
  }
}
