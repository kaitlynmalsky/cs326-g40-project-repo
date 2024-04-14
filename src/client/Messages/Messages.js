import View from '../View.js';

export default class MessagesView extends View {
    #messageList;
    #curr_id;
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
        this.#messageList = [];
        
    }

    /**
     * 
     * @returns 
     */
    async render() {
        const elm = document.createElement('header');
        elm.id = 'messages-view';
        elm.className = "h-full grid grid-cols-5";

        this.#col1 = document.createElement('div');

        //this.#col1.className = "max-h-screen overflow-y-scroll w-1/5 h-100 message-view-col bg-amber-500";
        this.#col1.className = "overflow-y-scroll bg-amber-500 col-span-1";
        this.#col1.id = "col1";

        this.#col2 = document.createElement('div');
        this.#col2.className = "grid grid-rows-5 col-span-4 overflow-y-scroll"
        this.#col2.id = "col2";
        this.#chatView = document.createElement('div');
        this.#chatView.className = "overflow-y-scroll gap-2.5 grid grid-flow-row auto-rows-max row-span-4";
        this.#col2.appendChild(this.#chatView);

        this.#sendView = document.createElement('div');
        this.#sendView.className = "p-5";
        this.#sendView.id = "send-message";
        this.#col2.appendChild(this.#sendView);

        this.initializeSendView();

        // const remainingBar = document.createElement('div');
        // remainingBar.style = "flex: 1 1 auto;"
        //remainingBar.classList.add()

        //peopleElm = document.createElement()

        elm.appendChild(this.#col1);
        elm.appendChild(this.#col2);
        



        this.demoMessages();
        const orangeBox = document.createElement('div');
        orangeBox.className = "bg-amber-500 h-full max-h-full"
        this.#col1.appendChild(orangeBox);
        console.log(this.#curr_id);

        


        return elm;
    }

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

        this.addMessage(scoob, Date.now()-10, "i eat kids");
        this.addMessage(spiderman,Date.now()-5, "dude what");
        this.addMessage(scoob, Date.now(), `Connection terminated. I'm sorry to interrupt you, Elizabeth, if you still even remember that name, But I'm afraid you've been misinformed. You are not here to receive a gift, nor have you been called here by the individual you assume, although, you have indeed been called. You have all been called here, into a labyrinth of sounds and smells, misdirection and misfortune. A labyrinth with no exit, a maze with no prize. You don't even realize that you are trapped. Your lust for blood has driven you in endless circles, chasing the cries of children in some unseen chamber, always seeming so near, yet somehow out of reach, but you will never find them. None of you will. This is where your story ends.
        
        And to you, my brave volunteer, who somehow found this job listing not intended for you, although there was a way out planned for you, I have a feeling that's not what you want. I have a feeling that you are right where you want to be. I am remaining as well. I am nearby. This place will not be remembered, and the memory of everything that started this can finally begin to fade away. As the agony of every tragedy should.
        
        And to you monsters trapped in the corridors, be still and give up your spirits. They don't belong to you. For most of you, I believe there is peace and perhaps more waiting for you after the smoke clears. Although, for one of you, the darkest pit of Hell has opened to swallow you whole, so don't keep the devil waiting, old friend.
        
        My daughter, if you can hear me, I knew you would return as well. It's in your nature to protect the innocent. I'm sorry that on that day, the day you were shut out and left to die, no one was there to lift you up into their arms the way you lifted others into yours, and then, what became of you. I should have known you wouldn't be content to disappear, not my daughter. I couldn't save you then, so let me save you now. It's time to rest - for you, and for those you have carried in your arms.
        
        This ends for all of us.
        
        End communication.
        `);
        this.addMessage(spiderman, Date.now(), `Today when I walked into my economics class I saw something I dread every time I close my eyes. Someone had brought their new gaming laptop to class. The Forklift he used to bring it was still running idle at the back. I started sweating as I sat down and gazed over at the 700lb beast that was his laptop. He had already reinforced his desk with steel support beams and was in the process of finding an outlet for a power cable thicker than Amy Schumer's thigh. I start shaking. I keep telling myself I'm going to be alright and that there's nothing to worry about. He somehow finds a fucking outlet. Tears are running down my cheeks as I send my last texts to my family saying I love them. The teacher starts the lecture, and the student turns his laptop on. The colored lights on his RGB Backlit keyboard flare to life like a nuclear flash, and a deep humming fills my ears and shakes my very soul. The entire city power grid goes dark. The classroom begins to shake as the massive fans begin to spin. In mere seconds my world has gone from vibrant life, to a dark, earth shattering void where my body is getting torn apart by the 150mph gale force winds and the 500 decibel groan of the cooling fans. As my body finally surrenders, I weep, as my school and my city go under. I fucking hate gaming laptops. `);
        
    }

    renderAvatars() {

    }

    addGroupChat(people) {
        // https://flowbite.com/docs/components/avatar/
        this.#curr_id = this.#messageList.length;
        this.#messageList.push({
            id: this.curr_id,
            people: people
        });
        this.curr_id++;

        const gcElm = document.createElement('div');
        gcElm.className = "flex -space-x-4 rtl:space-x-reverse hover:bg-amber-400 hover:cursor-pointer";
        gcElm.classList.add("py-5");
        gcElm.classList.add("pl-2");
        gcElm.classList.add("gc-stack");
        
        
        people.forEach(person => {
            const avatarElm = document.createElement('img');
            avatarElm.className = "w-10 h-10 border-2 border-white rounded-full dark:border-gray-800 ";

            avatarElm.src = person.avatar; // TEMPORARY PERSON OBJECT
            gcElm.appendChild(avatarElm);
        })

        this.#col1.appendChild(gcElm);
    }

    addMessage(person, timestamp, message, fromMe) {
        const messageElm = document.createElement('div');
        messageElm.className = "flex";

        const messageAvatar = document.createElement('img');
        messageAvatar.className = " w-20 h-20 m-3 flex-none border-2 border-white rounded-full"
        messageAvatar.src = person.avatar;
        

        const messageContainer = document.createElement('div');
        messageContainer.className = "flex-grow";
        const messageContent = document.createElement('div');
        messageContent.innerText = message;
        messageContent.className = "bg-amber-200 h-min w-auto p-3 m-3 rounded-md drop-shadow-lg drop-shadow-amber-500 z-0";

        if (fromMe) {
            messageElm.classList.add("justify-end");
            messageContainer.appendChild(messageContent);
            messageElm.appendChild(messageContent);
            messageElm.appendChild(messageAvatar);
            
        } else {
            messageContainer.appendChild(messageContent);
            messageElm.appendChild(messageAvatar);
            messageElm.appendChild(messageContent);
        }
       

        
        
        this.#chatView.appendChild(messageElm);
    }

    initializeSendView() {
        const messageForm = document.createElement('form');
        messageForm.className = "h-auto";
        messageForm.name = "message";
        const messageArea = document.createElement('textarea');
        messageArea.className = "m-5 resize-y text-lg block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        messageArea.id="message-area";
        messageArea.addEventListener("keyup", e => {
            e.preventDefault();
            if (e.key === "Enter") {
                console.log("enter");
                this.addMessage(this.#currUser, Date.now(), messageArea.value, true);
                this.#chatView.scrollTop = this.#chatView.scrollHeight;
                messageForm.submit();
                messageForm.reset();

            }
        })
        messageForm.appendChild(messageArea);
        


        this.#sendView.appendChild(messageForm);
    }



}