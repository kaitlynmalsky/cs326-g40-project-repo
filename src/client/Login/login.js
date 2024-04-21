import GlobalEvents, { EVENTS } from '../Events/index.js';
import View from '../View.js';
import dbInstance from '../database.js';
import Database from '../database.js';

export default class LoginView extends View {
  constructor() {
    super();
  }

  async render() {
    const container = document.createElement('div');
    container.className =
      'flex min-h-full flex-col justify-center px-6 py-12 lg:px-8';

    const wrapper = document.createElement('div');
    wrapper.className = 'sm:mx-auto sm:w-full sm:max-w-sm';

    const title = document.createElement('h1');
    title.className = 'text-6xl font-bold text-center mb-4';
    title.textContent = 'VillageLink';

    const subtitle = document.createElement('h2');
    subtitle.className =
      'mt-10 text-center text-xl font-bold leading-9 tracking-tight text-gray-900';
    subtitle.textContent = 'Sign in to your account';

    const form = document.createElement('form');
    form.className = 'space-y-6';
    form.action = '#';
    form.method = 'POST';

    const emailDiv = this.createInput('email', 'Email address', 'email');
    const passwordDiv = this.createInput('password', 'Password', 'password');

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className =
      'flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
    submitButton.textContent = 'Sign in';

    submitButton.addEventListener('click', async (event) => {
      event.preventDefault();
      // @ts-ignore
      const email = document.getElementById('email').value;
      // @ts-ignore
      const password = document.getElementById('password').value;
      try {
        const user = await Database.getUserByEmail(email);
        if (user && user.password === password) {
          // Open dashboard
          console.log('Authentication successful');
          dbInstance.setCurrentUserId(user.userID);
          GlobalEvents.navigate('login');
        } else if (user && user.password !== password) {
          console.log('Authentication failed: Wrong Password!');
        } else if (!user) {
          console.log('Authentication failed: Not a user or Incorrect email');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    });

    form.appendChild(emailDiv);
    form.appendChild(passwordDiv);
    form.appendChild(submitButton);

    const signupText = document.createElement('p');
    signupText.className = 'mt-10 text-center text-sm text-gray-500';
    signupText.textContent = 'Not a member? ';

    const signupLink = document.createElement('a');
    signupLink.href = '';
    signupLink.className =
      'font-semibold leading-6 text-black-600 hover:text-black-500';
    signupLink.textContent = 'Join now!';
    //Join now to signup

    signupText.appendChild(signupLink);

    wrapper.appendChild(title);
    wrapper.appendChild(subtitle);
    wrapper.appendChild(form);
    wrapper.appendChild(signupText);

    container.appendChild(wrapper);

    return container;
  }

  createInput(id, label, type) {
    const inputDiv = document.createElement('div');
    inputDiv.className = 'mt-2';

    const labelElem = document.createElement('label');
    labelElem.htmlFor = id;
    labelElem.className = 'block text-sm font-medium leading-6 text-gray-900';
    labelElem.textContent = label;

    const inputElem = document.createElement('input');
    inputElem.id = id;
    inputElem.name = id;
    inputElem.type = type;
    inputElem.autocomplete = type;
    inputElem.required = true;
    inputElem.className =
      'block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6';

    inputDiv.appendChild(labelElem);
    inputDiv.appendChild(inputElem);

    return inputDiv;
  }
}
