import GlobalEvents from '../Events/index.js';
import View from '../View.js';
import dbInstance from '../database.js';
import Database from '../database.js';

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

    const firstNameInput = this.createInput('firstname', 'Name', 'text');
    const usernameInput = this.createInput('username', 'username', 'text');

    gridDiv.appendChild(firstNameInput);
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
      // console.log(form.elements['firstname']);

      const firstName = document.getElementById('firstname').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      //   if (!firstName || !username || !email || !password || !confirmPassword) {
      //     alert('No field can be left empty');
      //     return;
      // }

      // Confirm passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Create user object
      const userData = {
        firstName,
        username,
        email,
        password,
      };

      try {
        if (await Database.getUserByEmail(email)) {
          alert('User with this Email already exists!');
          return;
        }

        const user = await Database.addUser(userData);

        // maybe redirect the user to the login page after successful signup
        console.log('User created successfully');
        dbInstance.setCurrentUserId(user.userID);
        GlobalEvents.navigate('map');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    });

    return container;
  }

  createInput(id, label, type) {
    const inputDiv = document.createElement('div');
    inputDiv.className = 'mt-5';

    // console.log(id)r
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.placeholder = label;
    input.className = 'border border-gray-400 py-1 px-2 w-full';

    inputDiv.appendChild(input);

    return inputDiv;
  }
}
