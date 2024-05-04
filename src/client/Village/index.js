import View from '../View.js';
import dbInstance from '../database.js';

export default class VillageView extends View {
  /**
   * @type {boolean}
   */
  #showButton;

  /**
   * @type {string}
   */

  constructor() {
    super();
    this.#showButton = false;

    this.initEventHandlers();
  }

  /**
   * Initializes event handler for toggle delete button
   */
  initEventHandlers() {
    document.addEventListener(
      'toggleDelete',
      this.toggleDeleteButton.bind(this),
    );
  }

  /**
   * To toggle button on and off condition
   */
  toggleDeleteButton() {
    this.#showButton = !this.#showButton;
    this.updateDeleteButtonsVisibility();
  }

  /**
   * Updates the visibility of delete buttons based on the value of the 'showButton' property.
   * If 'showButton' is true, sets the display style of delete buttons to 'block',
   * otherwise sets it to 'none'.
   */
  updateDeleteButtonsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((/** @type {HTMLElement} */btn) => {
      btn.style.display = this.#showButton ? 'block' : 'none';
    });
  }

  /**
   * Renders the village view
   * @returns {Promise<HTMLDivElement>}
   */
  async render() {

    const villageViewElm = document.createElement('div');
    villageViewElm.id = 'village-view';

    const header1Elm = document.createElement('div');
    header1Elm.className = 'header';
    header1Elm.innerHTML = `<h2>CONNECTIONS</h2><button onclick="document.dispatchEvent(new CustomEvent('toggleDelete'))">Toggle Delete</button>`;
    villageViewElm.appendChild(header1Elm);

    const connectionsDiv = document.createElement('div');
    this.connectionsDiv = connectionsDiv;
    villageViewElm.appendChild(connectionsDiv);

    return villageViewElm;
  }

  /**
   * Asynchronous method called when the component is loaded.
   */
  async onLoad() {
    await this.loadConnections();
  }

  /**
   * Asynchronously loads connections data and renders them on the UI.
   */
  async loadConnections() {
    this.connectionsDiv.innerHTML = '';
    const userData = await fetch(`http://localhost:3260/users/me`)
    if (!userData.ok) {
      console.error("FAILED TO GET USERDATA");
    }
    const userJson = await userData.json();
    const userID = userJson.userID;

    const connectionData = await fetch(`http://localhost:3260/users/${userID}/connections`);
    if (!connectionData.ok) {
      console.error(`FAILED TO GET CONNECTIONS OF ${userID}`);
    }
    const connections = await connectionData.json();

    console.log('connections', connections);

    const grid = document.createElement('div');
    grid.className = 'grid-dude';

    const elSize = 12;
    let connectionCount = 0;
    for (const connection of connections) {
      const userD = await fetch(`http://localhost:3260/users/${connection.targetID}/`);
      if (!userD.ok) {
        console.error(`FAILED TO GET DATA OF USER ${connection}`);
      }
      const user = await userD.json();
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
      let dataArrData = await fetch(`http://localhost:3260/users/${user.userID}/connections/`)
      if (!dataArrData.ok) {
        console.error("FAILED TO GET CURRENT USER CONNECTIONS");
      }
      const dataArr = await dataArrData.json();
      console.log(dataArr);

      for (const elm of dataArr) {
        const dataElmPromise = await fetch(`http://localhost:3260/users/${elm.targetID}/`)
        if (!dataElmPromise.ok) {
          console.error(`FAILED TO GET USER DATA OF ${elm}`);
        }
        const dataElm = await dataElmPromise.json();
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
      delBtn.addEventListener('click', async () => {
        try {
          const delResponse = await fetch(`http://localhost:3260/users/${connection.userID}/connections/${connection.targetID}`, {
            method: 'DELETE'
          });
          if (!delResponse.ok) {
            throw new Error('Failed to delete connection');
          }
          console.log('Connection deleted successfully');
          this.loadConnections();
        } catch (error) {
          console.error(`Delete failed: ${error}`);
        }
      });


      connectionElm.appendChild(delBtn);

      grid.appendChild(connectionElm);
    }

    this.connectionsDiv.appendChild(grid);

    this.updateDeleteButtonsVisibility();
  }
}
