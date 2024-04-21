import GlobalEvents from './Events/index.js';
import MapView from './Map/MapView.js';
import MessagesView from './Messages/Messages.js';
import NavBar from './NavBar/index.js';
import VillageView from './Village/index.js';
import LoginView from './Login/login.js';
import SignupView from './Signup/signup.js';
import dbInstance from './database.js';
import View from './View.js';

/**
 * @typedef {Object} RouteOptions
 * @property  {View} view
 * @property {boolean} [authRequired]
 */

/**
 * @typedef {Object} Route
 * @property {boolean} rendered
 * @property {boolean} loaded
 * @property {boolean} authRequired
 * @property  {View} view
 * @property {HTMLElement} [elm]
 */

export class App {
  /**
   * @type {HTMLDivElement}
   */
  #activeViewElm;
  /**
   * @type {NavBar}
   */
  #navbar;
  /**
   * @type {{[routeKey: string]: Route}}
   */
  #routes = {};

  constructor() {}

  /**
   * Renders the application
   * @param {string} root
   */
  async render(root) {
    const rootElm = document.getElementById(root);
    rootElm.innerHTML = '';

    const navbar = new NavBar();
    this.#navbar = navbar;
    const navbarElm = await navbar.render();

    this.#activeViewElm = document.createElement('div');
    this.#activeViewElm.classList.add('overscroll-contain');
    this.#activeViewElm.id = 'active-view';

    rootElm.appendChild(navbarElm);
    rootElm.appendChild(this.#activeViewElm);

    const mapView = new MapView();
    this.#addRoute('map', { view: mapView });

    const villageView = new VillageView();
    this.#addRoute('village', { view: villageView });

    const loginView = new LoginView();
    this.#addRoute('login', { view: loginView, authRequired: false });

    const signupView = new SignupView();
    this.#addRoute('signup', { view: signupView, authRequired: false });

    const messagesView = new MessagesView();
    this.#addRoute('messages', { view: messagesView });

    if (dbInstance.getCurrentUserID()) {
      history.replaceState('map', '', '#map');
      this.#navigateTo('map');
    } else {
      history.replaceState('login', '', '#login');
      this.#navigateTo('login');
    }

    GlobalEvents.addEventListener('navigate', (navEvent) =>
      this.#navigateTo(navEvent.navTarget),
    );
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.#navigateTo(e.state);
      }
    });
  }

  /**
   * Adds a route to the routes table
   * @param {string} routeKey
   * @param {RouteOptions} routeOptions
   */
  #addRoute(routeKey, routeOptions) {
    this.#routes[routeKey] = {
      loaded: false,
      rendered: false,
      authRequired: true,
      ...routeOptions,
    };
  }

  /**
   * Navigates to a registered `routeKey`
   * @param {string} routeKey
   */
  async #navigateTo(routeKey) {
    if (this.#routes[routeKey].authRequired && !dbInstance.getCurrentUserID()) {
      return GlobalEvents.navigate('login');
    }

    console.log(`Navigating to ${routeKey}`);
    this.#activeViewElm.innerHTML = '';

    const route = this.#routes[routeKey];

    if (!route.rendered) {
      route.elm = await route.view.render();
      route.rendered = true;
    }

    this.#activeViewElm.appendChild(route.elm);

    if (!route.loaded) {
      route.view.onLoad();
      route.loaded = true;
    }

    this.#navbar.setActive(routeKey);
  }
}
