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
    let map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    
  }

  #navigateTo(view) {
    
  }
}
