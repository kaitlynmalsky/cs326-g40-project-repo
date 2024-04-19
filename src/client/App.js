import GlobalEvents from './Events/index.js';
import MapView from './Map/MapView.js';
import MessagesView from './Messages/Messages.js';
import NavBar from './NavBar/index.js';
import VillageView from './Village/index.js';

export class App {
  #activeViewElm;
  #navbar;
  #routes = {};

  constructor() {}

  async render(root) {
    const rootElm = document.getElementById(root);
    rootElm.innerHTML = '';

    const navbar = new NavBar();
    this.#navbar = navbar;
    const navbarElm = await navbar.render();

    this.#activeViewElm = document.createElement('div');
    this.#activeViewElm.id = 'active-view';

    rootElm.appendChild(navbarElm);
    rootElm.appendChild(this.#activeViewElm);

    const mapView = new MapView();
    this.#addRoute('map', mapView);

    const villageView = new VillageView();
    this.#addRoute('village', villageView);

    const messagesView = new MessagesView();
    this.#addRoute('messages', messagesView);

    history.replaceState('map', '', '#map');
    this.#navigateTo('map');

    GlobalEvents.addEventListener('navigate', (navEvent) =>
      // @ts-ignore
      this.#navigateTo(navEvent.navTarget), // don't change this to target that breaks it???
    );
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.#navigateTo(e.state);
      }
    });
  }

  #addRoute(routeKey, view) {
    this.#routes[routeKey] = { view, rendered: false, loaded: false };
  }

  async #navigateTo(routeKey) {
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
