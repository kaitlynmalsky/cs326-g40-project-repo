import GlobalEvents from '../Events/index.js';
import dbInstance from '../database.js';

/**
 * @typedef {Object}  NavRoute
 * @property {string} name The route name
 * @property {string} target The `routeKey` for the route
 */

export default class NavBar {
  /**
   * @type {Array<NavRoute>}
   */
  #routes;
  /**
   * @type {HTMLElement}
   */
  #navBarElm;

  constructor() {
    this.#routes = [
      { name: 'Messages', target: 'messages' },
      { name: 'Map', target: 'map' },
      { name: 'Village', target: 'village' },
      { name: 'Profile', target: 'profile' },
    ];
  }

  /**
   * This function dynamically adds a logout button to a specified parent element.
   * @param {HTMLDivElement} parent
   */
  addLogoutBtn(parent) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    logoutBtn.title = 'Logout';

    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dbInstance.deleteCurrentUserId();
      GlobalEvents.logout();
      GlobalEvents.navigate('login');
    });

    parent.appendChild(logoutBtn);
  }

  /**
   * Renders a navigation bar
   * @returns {Promise<HTMLElement>}
   */
  async render() {
    const navBarElm = document.createElement('nav');
    this.#navBarElm = navBarElm;
    this.#navBarElm.classList.add('z-50');
    navBarElm.id = 'navbar';

    this.#routes.forEach((route) => {
      const navLink = document.createElement('a');
      navLink.innerText = route.name;
      navLink.href = `#${route.target}`;

      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        GlobalEvents.navigate(route.target);
      });

      navBarElm.appendChild(navLink);
    });

    const logoutBtnDiv = document.createElement('div');
    logoutBtnDiv.className = 'ml-auto';

    if (await dbInstance.getCurrentUserID()) {
      this.addLogoutBtn(logoutBtnDiv);
    }

    GlobalEvents.addEventListener('login', () => {
      this.addLogoutBtn(logoutBtnDiv);
    });

    GlobalEvents.addEventListener('logout', () => {
      logoutBtnDiv.innerHTML = '';
    });

    navBarElm.appendChild(logoutBtnDiv);

    return navBarElm;
  }

  /**
   * Sets the active state for the navigation link corresponding to the specified route key.
   * @param {string} routeKey
   */
  setActive(routeKey) {
    const activeNavLinks = this.#navBarElm.querySelectorAll(`a.active`);

    if (activeNavLinks.length > 0) {
      activeNavLinks.forEach((navLink) => navLink.classList.remove('active'));
    }

    const activeNavLink = this.#navBarElm.querySelector(
      `a[href="#${routeKey}"]`,
    );

    if (activeNavLink) {
      activeNavLink.classList.add('active');
    }
  }
}
