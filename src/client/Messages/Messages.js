import View from '../View.js';

export default class MessagesView extends View {
    constructor() {
        super();
    }

    async render() {
        const elm = document.createElement('div');
        elm.id = 'messages-view';
        elm.innerText = "message view";
        return elm;
    }

}