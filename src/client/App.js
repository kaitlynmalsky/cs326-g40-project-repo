import GlobalEvents from './Events/index.js';
import MapView from './Map/MapView.js';
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

    this.#navigateTo('map');

    GlobalEvents.addEventListener('navigate', (navEvent) =>
      this.#navigateTo(navEvent.navTarget),
    );
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

    window.location.hash = routeKey;
    this.#navbar.setActive(routeKey);
  }
}
