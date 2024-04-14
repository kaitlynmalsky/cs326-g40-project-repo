import View from '../View.js';

export default class MessagesView extends View {
    #messageList;
    #curr_id;
    #col1;
    #col2;
    
    constructor() {
        super();
        this.curr_id = 0;
        this.#messageList = [];
        
    }

    async render() {
        const elm = document.createElement('header');
        elm.id = 'messages-view';
        elm.className = "h-full flex justify-start items-start";

        this.#col1 = document.createElement('div');

        this.#col1.className = "max-h-screen overflow-y-scroll w-1/5 h-100 message-view-col bg-amber-500";


        this.#col2 = document.createElement('div');
        this.#col2.className = "max-h-screen overflow-y-scroll message-view-col overflow-y-auto flex-grow";
        this.#col2.innerHTML = "bye";

        const remainingBar = document.createElement('div');
        remainingBar.style = "flex: 1 1 auto;"
        //remainingBar.classList.add()

        //peopleElm = document.createElement()

        elm.appendChild(this.#col1);
        elm.appendChild(this.#col2);


        this.demoMessages();
        console.log(this.#curr_id);

        


        return elm;
    }

    demoMessages() {
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
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);
        this.addGroupChat([spiderman, scoob]);
        this.addGroupChat([nemo]);
        this.addGroupChat([spiderman, nemo, scoob]);

        
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




}