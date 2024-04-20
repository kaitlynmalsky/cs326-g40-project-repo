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
    #lastMessageAuthor;

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
        this.#lastMessageAuthor = null;
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
        this.#col2.className = "overscroll-contain grid grid-rows-5 col-span-4"
        this.#col2.id = "col2";
        this.#chatView = document.createElement('div');
        this.#chatView.id = "chat-container"
        this.#chatView.className = "overscroll-contain gap-2.5 grid grid-flow-row auto-rows-max row-span-4 content-end";
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
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);
        // this.addGroupChat([spiderman, scoob]);
        // this.addGroupChat([nemo]);
        // this.addGroupChat([spiderman, nemo, scoob]);

        // this.addMessage(scoob, new Date, "i eat kids", false, 0);
        // this.addMessage(spiderman,new Date, "dude what", false, 0);
        // this.addMessage(scoob, new Date, `Connection terminated. I'm sorry to interrupt you, Elizabeth, if you still even remember that name, But I'm afraid you've been misinformed. You are not here to receive a gift, nor have you been called here by the individual you assume, although, you have indeed been called. You have all been called here, into a labyrinth of sounds and smells, misdirection and misfortune. A labyrinth with no exit, a maze with no prize. You don't even realize that you are trapped. Your lust for blood has driven you in endless circles, chasing the cries of children in some unseen chamber, always seeming so near, yet somehow out of reach, but you will never find them. None of you will. This is where your story ends.
        // And to you, my brave volunteer, who somehow found this job listing not intended for you, although there was a way out planned for you, I have a feeling that's not what you want. I have a feeling that you are right where you want to be. I am remaining as well. I am nearby. This place will not be remembered, and the memory of everything that started this can finally begin to fade away. As the agony of every tragedy should.
        // And to you monsters trapped in the corridors, be still and give up your spirits. They don't belong to you. For most of you, I believe there is peace and perhaps more waiting for you after the smoke clears. Although, for one of you, the darkest pit of Hell has opened to swallow you whole, so don't keep the devil waiting, old friend.
        // My daughter, if you can hear me, I knew you would return as well. It's in your nature to protect the innocent. I'm sorry that on that day, the day you were shut out and left to die, no one was there to lift you up into their arms the way you lifted others into yours, and then, what became of you. I should have known you wouldn't be content to disappear, not my daughter. I couldn't save you then, so let me save you now. It's time to rest - for you, and for those you have carried in your arms.
        // This ends for all of us.
        // End communication.`, false, 0);
        this.addMessage(nemo, new Date, `Today when I walked into my economics class I saw something I dread every time I close my eyes. Someone had brought their new gaming laptop to class. The Forklift he used to bring it was still running idle at the back. I started sweating as I sat down and gazed over at the 700lb beast that was his laptop. He had already reinforced his desk with steel support beams and was in the process of finding an outlet for a power cable thicker than Amy Schumer's thigh. I start shaking. I keep telling myself I'm going to be alright and that there's nothing to worry about. He somehow finds a fucking outlet. Tears are running down my cheeks as I send my last texts to my family saying I love them. The teacher starts the lecture, and the student turns his laptop on. The colored lights on his RGB Backlit keyboard flare to life like a nuclear flash, and a deep humming fills my ears and shakes my very soul. The entire city power grid goes dark. The classroom begins to shake as the massive fans begin to spin. In mere seconds my world has gone from vibrant life, to a dark, earth shattering void where my body is getting torn apart by the 150mph gale force winds and the 500 decibel groan of the cooling fans. As my body finally surrenders, I weep, as my school and my city go under. I fucking hate gaming laptops. `, false, 1);
        
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
        messageAvatar.className = " w-11 h-11 mx-3 flex-none border-2 border-white rounded-full"
        messageAvatar.src = person.avatar;
        

        const messageContainer = document.createElement('div');
        messageContainer.className = "flex-grow";
        const messageContent = document.createElement('div');
        messageContent.innerText = message;
        

        if (fromMe) {
            messageContent.className = "max-w-prose text-base bg-stone-200 h-min w-auto p-2 mx-3 rounded-l-lg rounded-br-lg z-0";
            messageElm.classList.add("justify-end");
            messageContainer.appendChild(messageContent);
            messageElm.appendChild(messageContent);
            messageElm.appendChild(messageAvatar);
            
        } else {
            messageContent.className = "max-w-prose text-base bg-green-200 h-min w-auto p-2 mx-3 rounded-r-lg rounded-bl-lg z-0";
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
        messageArea.className = "message-text overscroll-contain resize-y text-lg block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500";
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