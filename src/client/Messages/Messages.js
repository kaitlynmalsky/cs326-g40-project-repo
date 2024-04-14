import View from '../View.js';

export default class MessagesView extends View {
    #messageList;
    #curr_id;
    #chatListElm;
    
    constructor() {
        super();
        this.curr_id = 0;
        this.#messageList = [];
        
    }

    async render() {
        const elm = document.createElement('header');
        elm.id = 'messages-view';
        elm.className = "h-full flex justify-start items-start";

        const col1 = document.createElement('div');

        col1.className = "max-h-screen overflow-y-auto w-1/5 h-100 message-view-col bg-amber-500";


        const col2 = document.createElement('div');
        col2.className = "max-h-screen overflow-y-auto message-view-col overflow-y-auto flex-grow";
        col2.innerHTML = "bye";

        //peopleElm = document.createElement()

        elm.appendChild(col1);
        elm.appendChild(col2);

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
    }




}