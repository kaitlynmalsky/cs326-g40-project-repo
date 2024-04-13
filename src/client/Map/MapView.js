import View from '../View.js';

export default class MapView extends View {
  #map = null;

  constructor() {
    super();
  }

  async render() {
    const elm = document.createElement('div');
    elm.id = 'map';

    const leafletElm = document.createElement('div');
    leafletElm.id = 'leaflet';

    const btnDiv = document.createElement('div');
    btnDiv.id = 'create-pin';
    btnDiv.className = 'leaflet-bottom leaflet-right';
    btnDiv.style.pointerEvents = 'auto';
    btnDiv.innerHTML = `
    <button class="button-action">Add Pin</button>
    `;
    btnDiv.onclick = () => console.log('Clicked FAB');

    elm.appendChild(leafletElm);
    elm.appendChild(btnDiv);

    return elm;
  }

  async onLoad() {
    await this.setView(42.3868, -72.5293, 17);
    this.placeTestMarker();
  }

  placeTestMarker() {
    const testMarker = this.createMarker(
      './images/placeholder_avatar.png',
      './images/shadowcircletemp.png',
      42.3868,
      -72.5293,
    );
    this.bindPopup(testMarker, `<p>This is some <strong>text</strong></p>`);
    let startTimeInput = 'start-time-input-1';
    let endTimeInput = 'end-time-input-1';
    let detailInput = 'detail-input-1';
    let postButton = 'post-button-1';
    this.bindPopupTemplate(
      testMarker,
      startTimeInput,
      endTimeInput,
      detailInput,
      postButton,
    );
    this.showPopup(testMarker);
  }

  async setView(x, y, zoom) {
    this.#map = L.map('leaflet').setView([x, y], zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }

  createMarker = (imageLink, shadowLink, x, y) => {
    const newIcon = L.icon({
      iconUrl: imageLink,
      //   shadowUrl: shadowLink,

      iconSize: [50, 50], // size of the icon
      //   shadowSize: [50, 50], // size of the shadow
      iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
      //   shadowAnchor: [4, 92], // the same for the shadow
      popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
    });
    return L.marker([x, y], { icon: newIcon }).addTo(this.#map);
  };

  bindPopup(marker, content) {
    marker.bindPopup(content);
  }
  bindPopupTemplate(marker, start, end, detail, post) {
    const timeClass = `bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5`;
    const detailClass =
      'bg-gray-50 border border-gray-300 block mb-2 text-sm font-medium text-gray-900 dark:text-white rounded-lg';
    const buttonClass =
      'bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 border-b-4 border-orange-800 hover:border-orange-900 rounded';
    marker.bindPopup(
      `<div class="pin-label-text"><strong>New Pin</strong></div><br><br>
            <label for="${start}" class="pin-label-text">Start time:</label>
            <input type="time" id="${start}" class="${timeClass}"/><br>
            <label for="${end}" class="pin-label-text">End time:</label>
            <input type="time" id="${end}" class="${timeClass}"/><br>
            <label for="${detail}" class="pin-label-text">Details:</label><br>
            <textarea id="${detail}" rows="4" cols="30" class="${detailClass}"></textarea><br>
            <input type="button" id="${post}" class="${buttonClass}" value="Post"/>
            `,
      { className: 'customPopup' },
    );
  }

  showPopup(marker) {
    marker.openPopup();
  }
}
