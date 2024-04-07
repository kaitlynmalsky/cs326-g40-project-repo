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
        this.#map = L.map('map').setView([x, y], zoom);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.#map);
    }

    createIcon(imageLink, shadowLink) {
        return L.icon({
            iconUrl: imageLink,
            shadowUrl: shadowLink,

            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
    }

    createMarker(x, y, icon) {
        L.marker([x, y], {icon: icon}).addTo(this.#map);
    }
}