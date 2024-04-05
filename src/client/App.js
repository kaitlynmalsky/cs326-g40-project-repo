import { MapView } from './Map/MapView.js'

export class App {
  
  constructor() {
   
  }

  async render(root) {
    const rootElm = document.getElementById(root);
    rootElm.innerHTML = '';

    const mapElement = document.createElement('div');
    mapElement.id = 'map';

    rootElm.appendChild(mapElement);
    let map = L.map('map').setView([42.3868, -72.5293], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    
  }

  #navigateTo(view) {
    
  }
}
