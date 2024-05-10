import View from '../View.js';
import database from '../api.js';

import ExistingPin from "../Map/ExistingPin.js" // this might be relevant soon

/**
 * @typedef GroupChat
 * @property {string} id
 * @property {HTMLElement[]} messages
 * @property {HTMLElement} gcElm
 */

/**
 * @typedef Group
 * @property {string} id
 * @property {import('../api.js').User[]} people
 */
export default class MessagesView extends View {
  /**
   * @type {{[gcID: string]: Group}}
   */
  groupList;
  /**
   * @type {{[gcID: string]: GroupChat}}
   */
  groupChats;
  /**
   * @type {string}
   */
  #active_id;
  /**
   * @type {HTMLElement}
   */
  #col1;
  /**
   * @type {HTMLElement}
   */
  #col2;
  /**
   * @type {HTMLElement}
   */
  #chatView;
  /**
   * @type {HTMLElement}
   */
  #sendView;
  /**
   * @type {import('../api.js').User}
   */
  #currUser;

  /**
   * Creates the message view (no parameters).
   * @constructor
   */

  constructor() {
    super();
    this.#active_id = undefined;
    this.groupList = {};
    this.groupChats = {};
  }

  /**
   * Returns a promise containing HTML element containing the message view.
   * @returns {Promise<HTMLElement>}
   */
  async render() {
    const elm = document.createElement('header');
    elm.id = 'messages-view';
    elm.className = 'h-full grid grid-cols-5';

    this.#col1 = document.createElement('div');

    this.#col1.className = 'overscroll-contain overflow-y-scroll col-span-1';
    this.#col1.id = 'col1';

    this.#col2 = document.createElement('div');
    this.#col2.className =
      'overscroll-contain grid grid-rows-5 col-span-4 overflow-y-scroll';
    this.#col2.id = 'col2';
    this.#chatView = document.createElement('div');
    this.#chatView.id = 'chat-container';

    this.#col2.appendChild(this.#chatView);

    const col1Title = document.createElement('h1');
    col1Title.className = 'message-text text-xl p-2 bg-slate-100';
    col1Title.innerText = 'My Groups';
    this.#col1.appendChild(col1Title);

    this.#sendView = document.createElement('div');
    this.#sendView.className = 'p-5';
    this.#sendView.id = 'send-message';
    this.#col2.appendChild(this.#sendView);

    // Demo messages
    this.#currUser = await database.getUser(await database.getCurrentUserID());
    // if ((await database.getAllGroupChats()).length === 0) {
    //   await mockMessages();
    // }
   await this.loadDBMessages();


    if (Object.keys(this.groupChats).length !== 0) { // replace with Object.keys(this.groupChats).length
      this.#chatView.className =
      'pt-1 overscroll-contain overflow-y-scroll overflow-x-hidden gap-2.5 grid grid-flow-row auto-rows-max row-span-4'; // content-end breaks scrolling for some reason???
      this.initializeSendView();
    } else {
      this.#chatView.className =
      'pt-1 overscroll-contain overflow-y-scroll overflow-x-hidden row-span-4 flex-col items-center justify-center flex flex-col-reverse justify-end'
      this.#col2.classList.add("items-center");
      this.#col2.classList.add("justify-center");
      const noGroupImage = document.createElement('img');
      noGroupImage.className = "justify-self-center mx-auto";
      noGroupImage.src = "../images/no_group_placeholder.png";
      noGroupImage.width = 400;
      noGroupImage.height = 400;
      const noFriendBox = document.createElement('div');
      noFriendBox.innerText = "We couldn't find any groups...";
      noFriendBox.className = "text-lg message-text text-center self-center justify-center"
      this.#chatView.appendChild(noGroupImage);
      this.#chatView.appendChild(document.createElement('br'));
      this.#chatView.appendChild(noFriendBox);
    }

    elm.appendChild(this.#col1);
    elm.appendChild(this.#col2);


    const fillerBox = document.createElement('div');
    fillerBox.className = 'h-full max-h-full bg-slate-100';
    this.#col1.appendChild(fillerBox);

    if (this.groupChats && Object.keys(this.groupChats).length !== 0) { // replace with Object.keys(this.groupChats).length
      // i.e. If the user actually has any chats
      let firstKey = Object.keys(this.groupChats)[0];
      this.changeChat(firstKey);
    }

    

    return elm;
  }

  async loadDBMessages() {
    const pinsDB = await database.getUserGroups();
    if (pinsDB && pinsDB.length > 0) {
      for (let i = 0; i < pinsDB.length; i++) {
        const gcMembersDB = await database.getPinAttendees(pinsDB[i].pinID);
        const gcUsersDB = []
        for (let gcMember of gcMembersDB) {
          const userDB = await database.getUser(gcMember.userID);
          if (userDB !== null) {
            gcUsersDB.push(userDB);
          }
        }
        await this.addGroupChat(gcUsersDB, pinsDB[i].pinID);
        const gcMessagesDB = await database.getGroupMessages(pinsDB[i].pinID);
        gcMessagesDB.sort(function (/**@type import('../api.js').GroupChatMessage*/ a, /**@type import('../api.js').GroupChatMessage*/ b) {
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        });
        for (let message of gcMessagesDB) {
          this.#chatView.appendChild(await this.generateMessageElm(await database.getUser(message.UserID), new Date(message.time), message.messageContent, message.GroupChatID));
        }
      }
    }
  }

  /**
   * Changes the chat view to the given chat ID.
   * @param {string} id (change to s string!)
   */
  changeChat(id) {
    this.#chatView.innerHTML = '';
    this.groupChats[id].messages.forEach((/** @type {HTMLElement} */ messageElm) => { // this can stay the same
      this.#chatView.appendChild(messageElm);
    });
    this.groupChats[this.#active_id].gcElm.classList.remove( // this can stay the same
      'active-group-chat',
    );
    this.groupChats[id].gcElm.classList.add('active-group-chat'); // this can stay the same
    this.#active_id = id;
  }

  /**
   * Adds a group chat to the left panel and to the user's internal messageList.
   * @param {import('../api.js').User[]} users
   * @param {string} pinID
   * @returns {Promise<void>}
   */

  async addGroupChat(users, pinID = undefined) {
    this.groupList[pinID] = {
      id: pinID,
      people: users
    }

    // await database.addGroupChat(pinID);
    // for (let user of users) {
    //   await database.addGroupChatMember(user.userID, pinID);
    // }

    const gcElm = this.generateGCElm(users, pinID);

    this.#col1.appendChild(gcElm);
    this.groupChats[pinID] = { // replace with pin id (this.groupChats becomes an object with pin id (string) indices)
      id: pinID, // replace with pin id
      messages: [],
      gcElm: gcElm,
    };
  }

  /**
   * Adds a message to a chat.
   * @param {import('../api.js').User} user
   * @param {Date} timestamp
   * @param {string} message
   * @param {string} gcID
   * @returns {Promise<HTMLElement>}
   */
  async generateMessageElm(user, timestamp, message, gcID) {
    if (user === null) {user = this.#currUser}
    const messageElm = document.createElement('div');
    messageElm.className = 'flex';

    const messageAvatar = document.createElement('img');
    messageAvatar.className =
      ' w-14 h-14 mx-3 flex-none border-2 border-white rounded-full';
    messageAvatar.src = user.avatar;

    const messageContainer = document.createElement('div');
    messageContainer.className = 'flex-grow';
    const messageContent = document.createElement('div');
    messageContent.innerText = message;

    const messageTimestamp = document.createElement('div');
    messageTimestamp.className = 'text-xs';
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let dayText;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    if (
      timestamp.getDate() === today.getDate() &&
      timestamp.getMonth() === today.getMonth() &&
      timestamp.getFullYear() === today.getFullYear()
    ) {
      dayText = 'Today';
    } else if (
      timestamp.getDate() === yesterday.getDate() &&
      timestamp.getMonth() === yesterday.getMonth() &&
      timestamp.getFullYear() === yesterday.getFullYear()
    ) {
      dayText = 'Yesterday';
    } else {
      dayText = monthNames[timestamp.getMonth()] + ' ' + timestamp.getDate();
    }
    const pm = timestamp.getHours() >= 12 ? true : false;
    if (pm) {
      let h = timestamp.getHours();
      if (h !== 12) {
        h -= 12;
      }
      messageTimestamp.innerText =
        dayText +
        ' at ' +
        h +
        ':' +
        timestamp.getMinutes().toString().padStart(2, '0') +
        ' PM';
    } else {
      messageTimestamp.innerText =
        dayText +
        ' at ' +
        timestamp.getHours() +
        ':' +
        timestamp.getMinutes().toString().padStart(2, '0') +
        ' AM';
    }

    messageContent.appendChild(messageTimestamp);

    const fromMe = this.#currUser.userID === user.userID;

    if (fromMe) {
      messageContent.className =
        'text-end max-w-prose bg-stone-200 h-min w-auto p-3 mx-3 rounded-l-lg rounded-br-lg z-0';
      messageElm.classList.add('justify-end');
      messageContainer.appendChild(messageContent);
      messageElm.appendChild(messageContent);
      messageElm.appendChild(messageAvatar);
    } else {
      messageContent.className =
        'justify-right max-w-prose bg-green-200 h-min w-auto p-3 mx-3 rounded-r-lg rounded-bl-lg z-0';
      messageContainer.appendChild(messageContent);
      messageElm.appendChild(messageAvatar);
      messageElm.appendChild(messageContent);
    }

    this.groupChats[gcID].messages.push(messageElm); // this can stay the same

    //this.#chatView.appendChild(messageElm);
    return messageElm;
  }

  /**
   * 
   * @param {import('../api.js').User[]} users 
   * @param {string} pinID
   * @returns {HTMLElement}
   */
  generateGCElm(users, pinID) {
    const gcElm = document.createElement('div');
    gcElm.className =
      'flex -space-x-4 rtl:space-x-reverse bg-slate-100 hover:cursor-pointer';
    gcElm.classList.add('py-5');
    gcElm.classList.add('pl-2');
    gcElm.classList.add('gc-stack');

    users.forEach((user) => {
      if (user.userID !== this.#currUser.userID) {
        const avatarElm = document.createElement('img');
        avatarElm.className = 'w-10 h-10 border-2 border-white rounded-full';
  
        avatarElm.src = user.avatar;
        gcElm.appendChild(avatarElm);
      }
    });

    const temp = pinID; // replace with pin id

    gcElm.addEventListener('click', () => {
      this.changeChat(temp);
    });
    return gcElm;
  }


  // This function isn't called so I'm commenting it out for now.

  // /**
  //  * 
  //  * @param {string} pinID 
  //  * @param {import('../api.js').User} user 
  //  */
  // async addGroupChatMember(pinID, user) {
  //   this.groupList[pinID].people.push(user);
  //   let gcElm = this.generateGCElm(this.groupList[pinID].people, pinID);
  //   this.groupChats[pinID].gcElm = gcElm;
  //   await database.addGroupChatMember(user.userID, pinID);
  // }

  /**
   * Renders the send-message texarea.
   */
  initializeSendView() {
    const messageForm = document.createElement('form');
    messageForm.className = 'overscroll-contain h-auto';
    messageForm.name = 'message';
    const messageArea = document.createElement('textarea');
    messageArea.className =
      'overscroll-contain resize-y text-lg block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    messageArea.id = 'message-area';
    messageArea.addEventListener('keyup', async (e) => {
      e.preventDefault();
      if (e.key === 'Enter') {
        const sentDate = new Date();
        this.#chatView.appendChild(
          await this.generateMessageElm(
            this.#currUser,
            sentDate,
            messageArea.value,
            this.#active_id,
          ),
        );
        // await database.addGroupChatMessage(
        //   this.#active_id,
        //   this.#currUser.userID,
        //   messageArea.value,
        //   sentDate,
        // );
        await database.sendMessage(this.#active_id, sentDate, messageArea.value);
        this.#chatView.scrollTop = this.#chatView.scrollHeight;
        messageForm.reset();
      }
    });
    messageForm.appendChild(messageArea);

    this.#sendView.appendChild(messageForm);
  }
}
