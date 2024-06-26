import View from '../View.js';
import dbInstance from '../api.js';

export default class VillageView extends View {
  /**
   * @type {boolean}
   */
  #showButton;
  #showSuggestionButton;

  /**
   * @type {string}
   */

  constructor() {
    super();
    this.#showButton = false;
    this.#showSuggestionButton = false;

    this.initEventHandlers();
  }

  /**
   * Initializes event handler for toggle delete button
   */
  initEventHandlers() {
    document.addEventListener('toggleDelete', () => this.toggleDeleteButton());
    document.addEventListener('toggleDeleteSuggestion', () =>
      this.toggleDeleteSugButton(),
    );
  }

  /**
   * To toggle button on and off condition of suggestions
   */
  toggleDeleteSugButton() {
    this.#showSuggestionButton = !this.#showSuggestionButton;
    this.updateSugButtonsVisibility();
  }

  /**
   * To toggle button on and off condition
   */
  toggleDeleteButton() {
    this.#showButton = !this.#showButton;
    this.updateDeleteButtonsVisibility();
  }

  /**
   * Updates the visibility of delete suggestion button based on the value of the 'showSuggestionButton' property
   * If 'showSuggestionButton' is true, sets the display style of delete suggestion button to 'block',
   * otherwise sets it to 'none'
   */
  updateSugButtonsVisibility() {
    const deleteButtons = document.querySelectorAll(
      '.delete-suggestion-button',
    );
    // deleteButtons.forEach((/** @type {HTMLElement} */ btn) => {
    //   btn.style.display = this.#showSuggestionButton ? 'block' : 'none';
    // });
    deleteButtons.forEach((/**@type {HTMLElement} */ btn) => {
      btn.style.display = 'block';
      btn.innerText = btn.innerText === "Accept" ? "Decline" : "Accept";
      btn.style.backgroundColor = btn.innerText === "Accept" ? "#00ad03": "#b91c1b"
    })
  }

  /**
   * Updates the visibility of delete buttons based on the value of the 'showButton' property.
   * If 'showButton' is true, sets the display style of delete buttons to 'block',
   * otherwise sets it to 'none'.
   */
  updateDeleteButtonsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((/** @type {HTMLElement} */ btn) => {
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

    const headerElm = document.createElement('div');
    headerElm.className = 'header';
    //headerElm.innerHTML = `<h2 id="connection-label">CONNECTION SUGGESTIONS</h2>`
    headerElm.innerHTML = `<h2 id="connection-label">CONNECTION SUGGESTIONS</h2><button id="del-sug-button" onclick="document.dispatchEvent(new CustomEvent('toggleDeleteSuggestion'))">Toggle Accept/Decline</button>`;
    villageViewElm.appendChild(headerElm);

    const connectionSuggestions = document.createElement('div');
    this.connectionSuggestions = connectionSuggestions;
    villageViewElm.appendChild(connectionSuggestions);

    const header1Elm = document.createElement('div');
    header1Elm.className = 'header';
    header1Elm.innerHTML = `<h2 id="connection-label">CONNECTIONS</h2><button onclick="document.dispatchEvent(new CustomEvent('toggleDelete'))">Toggle Delete</button>`;
    villageViewElm.appendChild(header1Elm);

    const connectionsDiv = document.createElement('div');
    this.connectionsDiv = connectionsDiv;
    villageViewElm.appendChild(connectionsDiv);

    this.updateSugButtonsVisibility();

    return villageViewElm;
  }

  /**
   * Asynchronous method called when the component is loaded.
   */
  async onLoad() {
    await this.loadConnections();
    await this.loadConnectionSuggestions();
  }

  /**
   * Asynchronously loads connection suggestions data and renders them on the UI.
   */
  async loadConnectionSuggestions() {
    this.connectionSuggestions.innerHTML = '';
    const userID = await dbInstance.getCurrentUserID();

    const connectionSuggestions =
      await dbInstance.getConnectionSuggestions(userID);
    const connectionSuggestionUsers = await dbInstance.getUsers(
      connectionSuggestions.map((c) => c.targetID),
    );

    console.log('connection suggestion', connectionSuggestions);

    const grid = document.createElement('div');
    grid.className = 'grid-dude';

    let currentPopover;
    for (const connectionSuggestionUser of connectionSuggestionUsers) {
      const connectionElm = document.createElement('div');
      connectionElm.className = `user_connections`;

      const grp = document.createElement('div');
      grp.className = 'group';
      grp.setAttribute('data-toggle', 'popover');
      const img = document.createElement('img');
      img.src = connectionSuggestionUser.avatar;
      img.alt = connectionSuggestionUser.name;
      grp.appendChild(img);

      const popover = document.createElement('div');
      popover.className = 'popover bottom';

      const content = document.createElement('div');
      content.className = 'popover-content';
      const text = document.createElement('h3');
      text.className = 'popover-title';
      text.innerHTML = connectionSuggestionUser.name;
      content.appendChild(text);
      popover.appendChild(content);

      const subConn = document.createElement('div');
      subConn.className = 'sub-connections';
      subConn.style.maxHeight = '200px';
      subConn.style.overflowY = 'auto';

      const secondDegreeConnections = await dbInstance.getConnections(
        connectionSuggestionUser.userID,
      );
      const secondDegreeConnectionUsers = await dbInstance.getUsers(
        secondDegreeConnections.map((c) => c.targetID),
      );

      for (const secondDegreeUser of secondDegreeConnectionUsers) {
        const subConnElm = document.createElement('div');
        subConnElm.className = 'sub-connection-elements';
        const imgElm = document.createElement('img');
        imgElm.src = secondDegreeUser.avatar;
        imgElm.alt = secondDegreeUser.name;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = secondDegreeUser.name;
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
        if (currentPopover) {
          currentPopover.style.visibility = 'hidden';
        }
        currentPopover = popover;
      });

      connectionElm.appendChild(grp);

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-suggestion-button';
      delBtn.style.display = 'block';
      delBtn.innerText = 'Accept';
      delBtn.style.backgroundColor = "#00ad03";
      delBtn.addEventListener('click', async () => {
        try {
          const del = await dbInstance.delConnectionSuggestions(
            userID,
            connectionSuggestionUser.userID,
          );
          console.log('Connection deleted successfully');
          this.loadConnectionSuggestions();
          if (delBtn.innerText === 'Accept') {
            await dbInstance.createConnection({
              userID: await dbInstance.getCurrentUserID(),
              targetID: connectionSuggestionUser.userID
            })
            this.loadConnections();
          }
        } catch (error) {
          console.error(`Delete failed: ${error}`);
        }
      });

      connectionElm.appendChild(delBtn);

      grid.appendChild(connectionElm);
    }

    this.connectionSuggestions.appendChild(grid);

    this.updateDeleteButtonsVisibility();
  }

  /**
   * Asynchronously loads connections data and renders them on the UI.
   */
  async loadConnections() {
    this.connectionsDiv.innerHTML = '';
    const userID = await dbInstance.getCurrentUserID();

    const connections = await dbInstance.getConnections(userID);
    const connectionUsers = await dbInstance.getUsers(
      connections.map((c) => c.targetID),
    );

    const grid = document.createElement('div');
    grid.className = 'grid-dude';

    let currentPopover;
    for (const connectionUser of connectionUsers) {
      const connectionElm = document.createElement('div');
      connectionElm.className = `user_connections`;

      const grp = document.createElement('div');
      grp.className = 'group';
      grp.setAttribute('data-toggle', 'popover');
      const img = document.createElement('img');
      img.src = connectionUser.avatar;
      img.alt = connectionUser.name;
      grp.appendChild(img);

      const popover = document.createElement('div');
      popover.className = 'popover bottom';

      const content = document.createElement('div');
      content.className = 'popover-content';
      const text = document.createElement('h3');
      text.className = 'popover-title';
      text.innerHTML = connectionUser.name;
      content.appendChild(text);
      popover.appendChild(content);

      const subConn = document.createElement('div');
      subConn.className = 'sub-connections';
      subConn.style.maxHeight = '200px';
      subConn.style.overflowY = 'auto';

      const secondDegreeConnections = await dbInstance.getConnections(
        connectionUser.userID,
      );
      const secondDegreeConnectionUsers = await dbInstance.getUsers(
        secondDegreeConnections.map((c) => c.targetID),
      );

      for (const secondDegreeUser of secondDegreeConnectionUsers) {
        const subConnElm = document.createElement('div');
        subConnElm.className = 'sub-connection-elements';
        const imgElm = document.createElement('img');
        imgElm.src = secondDegreeUser.avatar;
        imgElm.alt = secondDegreeUser.name;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = secondDegreeUser.name;
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
        if (currentPopover) {
          currentPopover.style.visibility = 'hidden';
        }
        currentPopover = popover;
      });

      connectionElm.appendChild(grp);

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-button';
      delBtn.style.display = 'none';
      delBtn.innerText = 'Delete';
      delBtn.addEventListener('click', async () => {
        try {
          const del = await dbInstance.deleteConnection(
            userID,
            connectionUser.userID,
          );
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
