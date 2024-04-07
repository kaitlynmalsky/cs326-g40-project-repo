import GlobalEvents from '../Events/index.js';

export default class NavBar {
  #routes;

  constructor() {
    this.#routes = [
      { name: 'Map', target: 'map' },
      { name: 'Village', target: 'village' },
    ];
  }

  async render() {
    const navBarElm = document.createElement('nav');
    navBarElm.id = 'navbar';

    this.#routes.forEach((route) => {
      const navLink = document.createElement('a');
      navLink.innerText = route.name;
      navBarElm.appendChild(navLink);

      navLink.addEventListener('click', () => {
        GlobalEvents.navigate(route.target);
      });
    });

    return navBarElm;
  }
}
