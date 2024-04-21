import GlobalEvents from '../Events/index.js';

export default class NavBar {
  #routes;
  #navBarElm;

  constructor() {
    this.#routes = [
      { name: 'Messages', target: 'messages' },
      { name: 'Login', target: 'login' },
      { name: 'Sign-Up', target: 'signup' },
      { name: 'Messages', target: 'messages' },
      { name: 'Map', target: 'map' },
      { name: 'Village', target: 'village' },
      { name: 'Profile', target: 'profile' },
    ];
  }

  async render() {
    const navBarElm = document.createElement('nav');
    this.#navBarElm = navBarElm;
    this.#navBarElm.classList.add('z-50');
    navBarElm.id = 'navbar';

    this.#routes.forEach((route) => {
      const navLink = document.createElement('a');
      navLink.innerText = route.name;
      navLink.href = `#${route.target}`;

      navBarElm.appendChild(navLink);

      navLink.addEventListener('click', (e) => {
        GlobalEvents.navigate(route.target);
        history.pushState(route.target, '', `#${route.target}`);
        e.preventDefault();
      });
    });

    return navBarElm;
  }

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
