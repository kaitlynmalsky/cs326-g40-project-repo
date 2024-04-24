import View from '../View.js';
import database from '../database.js';

/**
 *
 */
export default class MessagesView extends View {
  groupList;
  groupChats;
  #curr_id;
  #active_id;
  #col1;
  #col2;
  #chatView;
  #sendView;
  #currUser;

  /**
   * Creates the message view (no parameters).
   * @constructor
   */

  constructor() {
    super();
    this.curr_id = 0;
    this.#active_id = 0;
    this.groupList = [];
    this.groupChats = [];
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

    //this.#col1.className = "max-h-screen overflow-y-scroll w-1/5 h-100 message-view-col bg-amber-500";
    this.#col1.className = 'overscroll-contain overflow-y-scroll col-span-1';
    this.#col1.id = 'col1';

    this.#col2 = document.createElement('div');
    this.#col2.className =
      'overscroll-contain grid grid-rows-5 col-span-4 overflow-y-scroll';
    this.#col2.id = 'col2';
    this.#chatView = document.createElement('div');
    this.#chatView.id = 'chat-container';
    this.#chatView.className =
      'pt-1 overscroll-contain overflow-y-scroll overflow-x-hidden gap-2.5 grid grid-flow-row auto-rows-max row-span-4'; // content-end breaks scrolling for some reason???
    this.#col2.appendChild(this.#chatView);

    const col1Title = document.createElement('h1');
    col1Title.className = 'message-text text-xl p-2 bg-slate-100';
    col1Title.innerText = 'My Groups';
    this.#col1.appendChild(col1Title);

    this.#sendView = document.createElement('div');
    this.#sendView.className = 'p-5';
    this.#sendView.id = 'send-message';
    this.#col2.appendChild(this.#sendView);

    this.initializeSendView();

    elm.appendChild(this.#col1);
    elm.appendChild(this.#col2);

    // Demo messages
    //await this.demoMessages();
    await this.demoMessagesDB();

    const fillerBox = document.createElement('div');
    fillerBox.className = 'h-full max-h-full bg-slate-100';
    this.#col1.appendChild(fillerBox);
    //console.log("this.#curr_id is", this.#curr_id);

    if (this.#curr_id !== undefined) {
      // i.e. If the user actually has any chats
      this.changeChat(0);
    }

    return elm;
  }

  /**
   * Adds dummy group chats and messages, keeping the persistence with PouchDB in mind.
   */
  async demoMessagesDB() {
    const groupchats = await database.getAllGroupChats();
    console.log('groupchats is', groupchats);
    // When there is no data, groupchats will be an emty array.
    if (groupchats.length === 0) {
      console.log('No message data found in database, generating demo data.');
      await this.demoMessages();
    } else {
      console.log('Found group chats in databse, retrieved', groupchats);
      // @ts-ignore
      const user0result = await database.getPersonById(0);
      this.#currUser = {
        id: user0result.id,
        name: user0result.name,
        avatar: user0result.avatar,
      };
      for (let groupchat of groupchats) {
        // @ts-ignore
        const members = await database.getMembersByGroupChatID(groupchat.GroupChatID);
        // @ts-ignore
        const messages = await database.getMessagesByGroupChatID( groupchat.GroupChatID);
        // console.log(messages)
        // console.log("members is", members);
        // console.log("messages is", messages);
        messages.sort(function (a, b) {
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        });
        //console.log("messages after sorting:", messages);
        const people = [];
        for (let member of members) {
          const person = await database.getPersonById(member.PersonID);
          people.push({
            id: person.id,
            avatar: person.avatar,
            name: person.name,
          });
        }
        await this.addGroupChat(people);
        for (let message of messages) {
          const person = await database.getPersonById(message.PersonID);
          this.#chatView.appendChild(
            await this.generateMessageElm(
              person,
              new Date(message.time),
              message.messageContent,
              message.GroupChatID,
            ),
          );
        }
      }
    }
  }

  /**
   * Adds dummy group chats and messages, assuming that nothing exists in the database already.
   */
  async demoMessages() {
    this.#currUser = {
      id: 0,
      name: 'Cool Cat',
      avatar: '../images/pc.png',
    };
    const spiderman = {
      id: 1,
      name: 'Spiderman',
      avatar: '../images/green.png',
    };
    const scoob = {
      id: 2,
      name: 'Scoob',
      avatar: '../images/red.png',
    };
    const nemo = {
      id: 3,
      name: 'Nemo',
      avatar: '../images/yellow.png',
    };

    const people = [this.#currUser, spiderman, scoob, nemo];
    people.forEach(async (person) => {
      try {
        await database.addPerson(person.id, person.name, person.avatar);
      } catch (err) {
        console.error(err);
      }
    });

    await this.addGroupChat([spiderman, scoob]);
    await this.addGroupChat([nemo]);
    await this.addGroupChat([spiderman, nemo, scoob]);

    const messages = [
      {
        person: scoob,
        date: new Date('April 23, 2024 13:24:00'),
        content:
          'hey i heard that they have therapy dogs visiting in the campus center today!',
        gcID: 0,
      },
      {
        person: spiderman,
        date: new Date('April 23, 2024 13:24:00'),
        content: 'Wait really?',
        gcID: 0,
      },
      {
        person: spiderman,
        date: new Date('April 23, 2024 13:24:01'),
        content: 'We actually have to go right now',
        gcID: 0,
      },
      {
        person: spiderman,
        date: new Date('April 23, 2024 13:24:02'),
        content: 'I am running there',
        gcID: 0,
      },
      {
        person: scoob,
        date: new Date('April 23, 2024 13:25:00'),
        content: "please don't go too fast or you will scare the dogs",
        gcID: 0,
      },
    ];

    messages.forEach(async (message) => {
      this.#chatView.appendChild(
        await this.generateMessageElm(
          message.person,
          message.date,
          message.content,
          message.gcID,
        ),
      );
      await database.addGroupChatMessage(
        message.gcID,
        message.person.id,
        message.content,
        message.date,
      );
    });

    // console.log('this.groupChats', this.groupChats);
    // console.log('this.groupList',this.groupList);

    this.groupList.forEach(async (gc) => {
      try {
        // !!!!
        await database.addGroupChat(gc.id);
      } catch (err) {
        console.error(err);
      }

      gc.people.forEach(async (/** @type {{ id: number; }} */ person) => {
        try {
          await database.addGroupChatMember(person.id, gc.id);
        } catch (err) {
          console.error(err);
        }
      });
    });
  }

  /**
   * Changes the chat view to the given chat ID.
   * @param {number} id
   */
  changeChat(id) {
    this.#chatView.innerHTML = '';
    this.groupChats[id].messages.forEach((messageElm) => {
      this.#chatView.appendChild(messageElm);
    });
    this.groupChats[this.#active_id].gcElm.classList.remove(
      'active-group-chat',
    );
    this.groupChats[id].gcElm.classList.add('active-group-chat');
    this.#active_id = id;
  }

  /**
   * (people IS A TEMPORARY PARAM!) Adds a group chat to the left panel and to the user's internal messageList.
   * @param {Object[]} people
   */

  async addGroupChat(people) {
    this.#curr_id = this.groupList.length;
    this.groupList.push({
      id: this.curr_id,
      people: people,
    });

    await database.addGroupChat(this.curr_id);
    for (let person of people) {
      await database.addGroupChatMember(person.id, this.curr_id);
    }

    const gcElm = document.createElement('div');
    gcElm.className =
      'flex -space-x-4 rtl:space-x-reverse bg-slate-100 hover:cursor-pointer';
    gcElm.classList.add('py-5');
    gcElm.classList.add('pl-2');
    gcElm.classList.add('gc-stack');

    people.forEach((person) => {
      const avatarElm = document.createElement('img');
      avatarElm.className = 'w-10 h-10 border-2 border-white rounded-full';

      avatarElm.src = person.avatar; // TEMPORARY PERSON OBJECT
      gcElm.appendChild(avatarElm);
    });

    const temp = this.#curr_id;

    gcElm.addEventListener('click', () => {
      this.changeChat(temp);
    });

    this.#col1.appendChild(gcElm);
    this.groupChats[this.curr_id] = {
      id: this.curr_id,
      messages: [],
      gcElm: gcElm,
    };

    this.curr_id++;
  }

  /**
   * Adds a message to a chat.
   * @param {Object} person
   * @param {Date} timestamp
   * @param {string} message
   * @param {number} gcID
   * @returns {Promise<HTMLElement>}
   */
  async generateMessageElm(person, timestamp, message, gcID) {
    const messageElm = document.createElement('div');
    messageElm.className = 'flex';

    const messageAvatar = document.createElement('img');
    messageAvatar.className =
      ' w-14 h-14 mx-3 flex-none border-2 border-white rounded-full';
    messageAvatar.src = person.avatar;

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

    const fromMe = this.#currUser.id === person.id;

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

    this.groupChats[gcID].messages.push(messageElm);

    //this.#chatView.appendChild(messageElm);
    return messageElm;
  }

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
        await database.addGroupChatMessage(
          this.#active_id,
          this.#currUser.id,
          messageArea.value,
          sentDate,
        );
        this.#chatView.scrollTop = this.#chatView.scrollHeight;
        //messageForm.submit();
        messageForm.reset();
      }
    });
    messageForm.appendChild(messageArea);

    this.#sendView.appendChild(messageForm);
  }
}
