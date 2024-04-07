import { MapView } from './Map/MapView.js'

export class App {
  
  constructor() {
   
  }

  async render(root) {
    const rootElm = document.getElementById(root);
    rootElm.innerHTML = '';


    const mapView = new MapView();
    rootElm.appendChild(await mapView.render());
    await mapView.setView(42.3868, -72.5293, 17);
    const testIcon = mapView.createIcon("src/docs/milestone-01/images/batman.png", "src/docs/milestone-01/images/spiderman.png");
     mapView.createMarker(42.3868,-72.5293, testIcon);
    
    
  }

  #navigateTo(view) {
    
  }
}
