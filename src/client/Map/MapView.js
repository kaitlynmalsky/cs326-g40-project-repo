export class MapView {
    #map = null;
    
    constructor() {

    }

    async render() {
        const elm = document.createElement('div');
        elm.id = 'map';
        return elm;
    }

    async setView(x, y, zoom) {
        let map = L.map('map').setView([x, y], zoom);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
}