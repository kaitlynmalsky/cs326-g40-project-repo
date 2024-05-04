import GlobalEvents from '../Events/index.js';
import View from '../View.js';
import dbInstance from '../database.js';
import 

export default class LoginView extends View {
  constructor() {
    super();
  }

  /**
   * Renders login view
   * @returns {Promise<HTMLElement>}
   */
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
      'flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600';
    submitButton.textContent = 'Sign in';

    submitButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const email = /** @type {HTMLInputElement} */ (
        document.getElementById('email')
      ).value;
      const password = /** @type {HTMLInputElement} */ (
        document.getElementById('password')
      ).value;
      // Event listener for email input field
      emailDiv.querySelector('input').addEventListener('input', () => {
        this.hideAlert(emailDiv);
      });

      // Event listener for password input field
      passwordDiv.querySelector('input').addEventListener('input', () => {
        this.hideAlert(passwordDiv);
      });

      try {
        const loginResponse = await fetch(`/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (loginResponse.ok) {
          console.log('Authentication successful');

          const userResponse = await fetch(`/users/me`);
          const user = await userResponse.json();
          
          dbInstance.setCurrentUserId(user.userID);
          GlobalEvents.login();
          GlobalEvents.navigate('map');
        } else {
          if (loginResponse.status === 401) {
            // Incorrect password
            this.showAlert(passwordDiv, 'Wrong password!'); // Added line to show alert for wrong password
          } else if (loginResponse.status === 404) {
            // Invalid email
            this.showAlert(emailDiv, 'Incorrect email or not a user'); // Added line to show alert for incorrect email or not a user
          } else {
            // Some other error
            // TODO: show something
          }
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
    signupLink.href = '#signup';
    signupLink.className =
      'font-semibold leading-6 text-black-600 hover:text-black-500';
    signupLink.textContent = ' Join now!';
    //Join now to signup
    signupLink.addEventListener('click', () => {
      GlobalEvents.navigate('signup');
    });

    signupText.appendChild(signupLink);

    wrapper.appendChild(title);
    wrapper.appendChild(subtitle);
    wrapper.appendChild(form);
    wrapper.appendChild(signupText);

    container.appendChild(wrapper);

    return container;
  }

  /**
   * Creates an input element with a corresponding label.
   * @param {string} id
   * @param {string} label
   * @param {string} type
   * @returns
   */
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
    // @ts-ignore
    inputElem.autocomplete = type;
    inputElem.required = true;
    inputElem.className =
      'block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6';

    inputDiv.appendChild(labelElem);
    inputDiv.appendChild(inputElem);

    return inputDiv;
  }

  /**
   * Displays an alert message within the specified container element.
   * @param {HTMLElement} container
   * @param {string} message
   */
  showAlert(container, message) {
    const existingAlerts = container.querySelectorAll('.alert');
    existingAlerts.forEach((alert) => {
      alert.remove();
    });

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert text-red-600 text-sm mt-1';
    alertDiv.textContent = message;
    container.appendChild(alertDiv);
  }

  /**
   * Hides the alert element within the specified HTMLDivElement.
   * @param {HTMLDivElement} inputDiv
   */
  hideAlert(inputDiv) {
    const alert = /** @type {HTMLDivElement} */ (
      inputDiv.querySelector('.alert')
    );

    if (alert) {
      alert.style.display = 'none';
    }
  }
}
