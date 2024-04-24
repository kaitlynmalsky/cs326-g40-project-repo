import GlobalEvents from '../Events/index.js';
import defaultAvatar from '../Profile/defaultAvatar.js';
import View from '../View.js';
import dbInstance from '../database.js';
import Database from '../database.js';
// import GlobalEvents from '../Events/index.js';

export default class SignupView extends View {
  constructor() {
    super();
  }

  async render() {
    const container = document.createElement('div');
    container.className =
      'min-h-screen py-40 bg-gradient-to-br from-yellow-500 to-yellow-200 flex justify-center items-center';

    const innerContainer = document.createElement('div');
    innerContainer.className =
      'w-10/12 lg:w-8/12 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row';

    const imageSection = document.createElement('div');
    imageSection.className =
      'w-full lg:w-1/2 bg-center bg-cover bg-no-repeat p-12';
    imageSection.style.backgroundImage = "url('./images/signup.png')";

    const formSection = document.createElement('div');
    formSection.className = 'w-full lg:w-1/2 py-16 px-12';

    const registerTitle = document.createElement('h2');
    registerTitle.className = 'text-4xl font-bold mb-4';
    registerTitle.textContent = 'Welcome to VillageLink';

    const registerText = document.createElement('p');
    registerText.className = 'mb-4';
    registerText.textContent = 'Create your account. It’s free Sign-Up now!';

    const form = document.createElement('form');
    form.action = '#';

    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid grid-cols-2 gap-5';

    const nameInput = this.createInput('name', 'Name', 'text');
    const usernameInput = this.createInput('username', 'username', 'text');

    gridDiv.appendChild(nameInput);
    gridDiv.appendChild(usernameInput);

    const emailInput = this.createInput('email', 'Email', 'email');
    const passwordInput = this.createInput('password', 'Password', 'password');
    const confirmPasswordInput = this.createInput(
      'confirmPassword',
      'Confirm Password',
      'password',
    );

    const termsDiv = document.createElement('div');
    termsDiv.className = 'mt-5';

    const registerButton = document.createElement('button');
    registerButton.className =
      'w-full bg-yellow-500 py-3 text-center text-white mt-5';
    registerButton.textContent = 'Sign-Up';

    form.appendChild(gridDiv);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(confirmPasswordInput);
    form.appendChild(termsDiv);
    form.appendChild(registerButton);

    formSection.appendChild(registerTitle);
    formSection.appendChild(registerText);
    formSection.appendChild(form);

    innerContainer.appendChild(imageSection);
    innerContainer.appendChild(formSection);

    container.appendChild(innerContainer);

    registerButton.addEventListener('click', async () => {
      const name = /** @type {HTMLInputElement} */ (
        document.getElementById('name')
      ).value;
      const username = /** @type {HTMLInputElement} */ (
        document.getElementById('username')
      ).value;
      const email = /** @type {HTMLInputElement} */ (
        document.getElementById('email')
      ).value;
      const password = /** @type {HTMLInputElement} */ (
        document.getElementById('password')
      ).value;
      const confirmPassword = /** @type {HTMLInputElement} */ (
        document.getElementById('confirmPassword')
      ).value;

      if (!name || !username || !email || !password || !confirmPassword) {
        this.showAlert(formSection, "No field's can be left empty!");
        return;
      }

      // Confirm passwords match
      if (password !== confirmPassword) {
        this.showAlert(formSection, 'Passwords do not match.');
        return;
      }

      // Create user object
      /**
       * @type {import('../database.js').CreateUserInput}
       */
      const userData = {
        name,
        avatar: defaultAvatar,
        avatarConfig: {
          bg: 0,
          body: 0,
          ears: 0,
          hat: 0,
        },
        username,
        email,
        password,
      };

      try {
        if (await Database.getUserByEmail(email)) {
          this.showAlert(formSection, 'User with this email already exists!');
          return;
        }

        const user = await Database.addUser(userData);

        // maybe redirect the user to the login page after successful signup
        console.log('User created successfully');
        dbInstance.setCurrentUserId(user.userID);
        GlobalEvents.navigate('profile');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    });

    emailInput.querySelector('input').addEventListener('input', () => {
      this.hideAlert(formSection);
    });

    passwordInput.querySelector('input').addEventListener('input', () => {
      this.hideAlert(formSection);
    });

    confirmPasswordInput
      .querySelector('input')
      .addEventListener('input', () => {
        this.hideAlert(formSection);
      });

    return container;
  }

  /**
   *
   * @param {string} id
   * @param {string} label
   * @param {string} type
   * @returns
   */
  createInput(id, label, type) {
    const inputDiv = document.createElement('div');
    inputDiv.className = 'mt-5';

    // console.log(id)r
    const input = document.createElement('input');
    input.required = true;
    input.id = id;
    input.type = type;
    input.placeholder = label;
    input.className = 'border border-gray-400 py-1 px-2 w-full';

    inputDiv.appendChild(input);

    return inputDiv;
  }

  /**
   *
   * @param {HTMLElement} container
   * @param {string} message
   */
  showAlert(container, message) {
    const existingAlert = container.querySelector('.alert');
    if (existingAlert) {
      existingAlert.textContent = message;
    } else {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert text-red-600 text-sm mt-1';
      alertDiv.textContent = message;
      container.appendChild(alertDiv);
    }
  }

  /**
   *
   * @param {HTMLDivElement} container
   */
  hideAlert(container) {
    const alert = container.querySelector('.alert');
    if (alert) {
      alert.remove();
    }
  }
}
