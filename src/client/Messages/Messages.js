import View from '../View.js';

export default class MessagesView extends View {
    constructor() {
        super();
    }

    async render() {
        const elm = document.createElement('header');
        elm.id = 'messages-view';

        const splitScreenSection = document.createElement('section');
        const splitGrid = document.createElement('div');
        splitGrid.className = "grid h-screen grid-cols-2 gap-10";
        const col1 = document.createElement('div');
        col1.innerHTML = "hi"
        const col2 = document.createElement('div');
        col2.innerHTML = "bye";
        col1.classList.add("bg-amber-500");


        elm.appendChild(splitScreenSection);
        splitScreenSection.appendChild(splitGrid);
        splitGrid.appendChild(col1);
        splitGrid.appendChild(col2);

        return elm;
    }

}