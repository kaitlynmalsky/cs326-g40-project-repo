import View from '../View.js';

/**
 * 
 */
export default class MessagesView extends View {
    #messageList;
    #groupChats;
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
        this.#messageList = [];
        this.#groupChats = [];
    }

    /**
     * Returns a promise containing HTML element containing the message view.
     * @returns {Promise<HTMLElement>} 
     */
    async render() {
        const elm = document.createElement('header');
        elm.id = 'messages-view';
        elm.className = "h-full grid grid-cols-5";

        this.#col1 = document.createElement('div');

        //this.#col1.className = "max-h-screen overflow-y-scroll w-1/5 h-100 message-view-col bg-amber-500";
        this.#col1.className = "overscroll-contain overflow-y-scroll col-span-1";
        this.#col1.id = "col1";

        this.#col2 = document.createElement('div');
        this.#col2.className = "overscroll-contain grid grid-rows-5 col-span-4 overflow-y-scroll"
        this.#col2.id = "col2";
        this.#chatView = document.createElement('div');
        this.#chatView.id = "chat-container"
        this.#chatView.className = "pt-1 overscroll-contain overflow-y-scroll overflow-x-hidden gap-2.5 grid grid-flow-row auto-rows-max row-span-4"; // content-end breaks scrolling for some reason???
        this.#col2.appendChild(this.#chatView);

        const col1Title = document.createElement('h1');
        col1Title.className = "message-text text-xl p-2 bg-slate-100";
        col1Title.innerText = 'My Groups';
        this.#col1.appendChild(col1Title);

        this.#sendView = document.createElement('div');
        this.#sendView.className = "p-5";
        this.#sendView.id = "send-message";
        this.#col2.appendChild(this.#sendView);

        this.initializeSendView();

        elm.appendChild(this.#col1);
        elm.appendChild(this.#col2);

        // Demo messages
        this.demoMessages();


        const fillerBox = document.createElement('div');
        fillerBox.className = "h-full max-h-full bg-slate-100";
        this.#col1.appendChild(fillerBox);
        console.log(this.#curr_id);

        this.changeChat(0);

        return elm;
    }

    /**
     * Adds dummy group chats and messages.
     */
    demoMessages() {
        this.#currUser = {
            name: "Cool Cat",
            avatar: "../images/placeholder_avatar.png"
        }
        const spiderman = {
            name: "Spiderman",
            avatar: "../images/spiderman.png"
        }
        const scoob = {
            name: "Scoob",
            avatar: '../images/Sooby_doo.png'
        }
        const nemo = {
            name: "Nemo",
            avatar: '../images/nemo.png'
        }


        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
   
        this.addMessage(scoob, new Date, "hey i heard that they have therapy dogs visiting in the campus center today!", false, 0);
        this.addMessage(spiderman, new Date, "Wait really?", false, 0);
        this.addMessage(spiderman, new Date, "We actually have to go right now", false, 0);
        this.addMessage(spiderman, new Date, "I am running there", false, 0);
        this.addMessage(scoob, new Date, "please don't go too fast or you'll scare the dogs", false, 0);

    }

    /**
     * Changes the chat view to the given chat ID.
     * @param {number} id 
     */
    changeChat(id) {
        this.#chatView.innerHTML = "";
        console.log(this.#groupChats);
        this.#groupChats[id].messages.forEach(messageElm => {
            this.#chatView.appendChild(messageElm);
        })
        this.#groupChats[this.#active_id].gcElm.classList.remove("active-group-chat");
        this.#groupChats[id].gcElm.classList.add("active-group-chat");
        this.#active_id = id;
    }

    renderAvatars() {

    }

    /**
     * (people IS A TEMPORARY PARAM!) Adds a group chat to the left panel and to the user's internal messageList.
     * @param {Object[]} people 
     */

    addGroupChat(people) {
        // https://flowbite.com/docs/components/avatar/
        this.#curr_id = this.#messageList.length;
        this.#messageList.push({
            id: this.curr_id,
            people: people
        });
        

        const gcElm = document.createElement('div');
        gcElm.className = "flex -space-x-4 rtl:space-x-reverse bg-slate-100 hover:cursor-pointer";
        gcElm.classList.add("py-5");
        gcElm.classList.add("pl-2");
        gcElm.classList.add("gc-stack");
        
        
        people.forEach(person => {
            const avatarElm = document.createElement('img');
            avatarElm.className = "w-10 h-10 border-2 border-white rounded-full";

            avatarElm.src = person.avatar; // TEMPORARY PERSON OBJECT
            gcElm.appendChild(avatarElm);
        })

        const temp = this.#curr_id;

        gcElm.addEventListener("click", () => {
            this.changeChat(temp);
        });

        this.#col1.appendChild(gcElm);
        this.#groupChats[this.curr_id] = {id: this.curr_id, messages: [], gcElm: gcElm};
        console.log(this.#groupChats);
        this.curr_id++;
    }

    /**
     * Adds a message to a chat.
     * @param {{avatar: string}} person 
     * @param {Date} timestamp 
     * @param {string} message 
     * @param {boolean} fromMe
     * @param {number} gcID
     */
    addMessage(person, timestamp, message, fromMe, gcID) {
        const messageElm = document.createElement('div');
        messageElm.className = "flex";

        const messageAvatar = document.createElement('img');
        messageAvatar.className = " w-14 h-14 mx-3 flex-none border-2 border-white rounded-full"
        messageAvatar.src = person.avatar;
        

        const messageContainer = document.createElement('div');
        messageContainer.className = "flex-grow";
        const messageContent = document.createElement('div');
        messageContent.innerText = message;
        

        if (fromMe) {
            messageContent.className = "max-w-prose bg-stone-200 h-min w-auto p-3 mx-3 rounded-l-lg rounded-br-lg z-0";
            messageElm.classList.add("justify-end");
            messageContainer.appendChild(messageContent);
            messageElm.appendChild(messageContent);
            messageElm.appendChild(messageAvatar);
            
        } else {
            messageContent.className = "max-w-prose bg-green-200 h-min w-auto p-3 mx-3 rounded-r-lg rounded-bl-lg z-0";
            messageContainer.appendChild(messageContent);
            messageElm.appendChild(messageAvatar);
            messageElm.appendChild(messageContent);
        }
        this.#groupChats[gcID].messages.push(messageElm);
        this.#chatView.appendChild(messageElm);
    }

    /**
     * Renders the send-message texarea.
     */
    initializeSendView() {
        const messageForm = document.createElement('form');
        messageForm.className = "overscroll-contain h-auto";
        messageForm.name = "message";
        const messageArea = document.createElement('textarea');
        messageArea.className = "overscroll-contain resize-y text-lg block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500";
        messageArea.id="message-area";
        messageArea.addEventListener("keyup", e => {
            e.preventDefault();
            if (e.key === "Enter") {
                console.log("enter");
                this.addMessage(this.#currUser, new Date, messageArea.value, true, this.#active_id);
                this.#chatView.scrollTop = this.#chatView.scrollHeight;
                messageForm.submit();
                messageForm.reset();

            }
        })
        messageForm.appendChild(messageArea);
        


        this.#sendView.appendChild(messageForm);
    }



}