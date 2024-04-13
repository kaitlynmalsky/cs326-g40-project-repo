import View from '../View.js';

export default class MapView extends View {
  #map = null;

  startTimeInput = 'start-time-input';
  endTimeInput = 'end-time-input';
  detailInput = 'detail-input';
  postButton = 'post-button';

  startTimeInputElm = null;
  endTimeInputElm = null;
  detailInputElm = null;
  postButtonElm = null;

  #markerList = [];
  

  constructor() {
    super();
  }

  async render() {

    this.renderPopup();

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
    btnDiv.onclick = () => {
      console.log('Clicked FAB');
      this.placeMarker('./images/placeholder_avatar.png');
    }
    

    elm.appendChild(leafletElm);
    elm.appendChild(btnDiv);

    return elm;
  }

  async onLoad() {
    await this.setView(42.3868, -72.5293, 17);
    //this.placeTestMarker();
  }

  renderPopup() {
    const timeClass = `bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5`;
    const detailClass =
      'bg-gray-50 border border-gray-300 block mb-2 text-sm font-medium text-gray-900 dark:text-white rounded-lg';
    const buttonClass =
      'bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 border-b-4 border-orange-800 hover:border-orange-900 rounded';
    this.startTimeInputElm = document.createElement('input');
    this.startTimeInputElm.className = timeClass;
    this.startTimeInputElm.id = this.startTimeInput;
    this.startTimeInputElm.type = 'time';
    this.endTimeInputElm = document.createElement('input');
    this.endTimeInputElm.className = timeClass;
    this.endTimeInputElm.id = this.endTimeInput;
    this.endTimeInputElm.type = 'time';
    this.detailInputElm = document.createElement('textarea');
    this.detailInputElm.id = this.detailInput;
    this.detailInputElm.rows = 4;
    this.detailInputElm.cols = 30;
    this.detailInputElm.className = detailClass;
    this.postButtonElm = document.createElement('input');
    this.postButtonElm.type = 'button';
    this.postButtonElm.id = this.postButton;
    this.postButtonElm.value = 'Post';
    this.postButtonElm.className = buttonClass;
  }

  placeMarker(imageLink) {
    const mark = this.createMarker(
      imageLink,
      './images/shadowcircletemp.png',
      this.#map.getCenter().lat,
      this.#map.getCenter().lng
    );
    this.bindPopupTemplate(mark);
    this.showPopup(mark);

    // this.startTimeInputElm = document.getElementById(this.startTimeInput);
    // this.endTimeInputElm = document.getElementById(this.endTimeInput);
    // this.detailInput = document.getElementById(this.detailInput);
    // this.postButtonElm = document.getElementById(this.postButton);
    console.log(this.postButtonElm);
    this.postButtonElm.addEventListener("click", () => {
      this.hidePopup(mark);
      mark.dragging.disable();
      console.log(mark.options);
      // save marker to database here
      console.log(mark);
    });

    mark.addEventListener("dragstart", () => {
      this.hidePopup(mark);
    });
    mark.addEventListener("dragend", () => {
      this.showPopup(mark);
    })
  }


  placeTestMarker() {
    const testMarker = this.createMarker(
      './images/placeholder_avatar.png',
      './images/shadowcircletemp.png',
      42.3868,
      -72.5293,
    );

    this.bindPopupTemplate(
      testMarker
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
    // use marker.option to change options in the future
    const newIcon = L.icon({
      iconUrl: imageLink,
      //   shadowUrl: shadowLink,

      iconSize: [50, 50], // size of the icon
      //   shadowSize: [50, 50], // size of the shadow
      iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
      //   shadowAnchor: [4, 92], // the same for the shadow
      popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
    });
    return L.marker([x, y], { icon: newIcon, draggable: true, autoPan: true}).addTo(this.#map);
  };

  bindPopup(marker, content) {
    marker.bindPopup(content);
  }
  bindPopupTemplate(marker) {
    let popupHTML = document.createElement('div');

    let pinTitle = document.createElement('div');
    let br = document.createElement('br');
    pinTitle.classList.add("pin-label-text");
    pinTitle.innerHTML = "<strong>New Pin\n</strong>"

    let startLabel = document.createElement('label');
    startLabel.for = this.startTimeInput;
    startLabel.classList.add("pin-label-text");
    startLabel.innerHTML = "Start time:"

    let endLabel = document.createElement('label');
    endLabel.for = this.endTimeInput;
    endLabel.classList.add("pin-label-text");
    endLabel.innerHTML = "End time:";

    let detailsLabel = document.createElement('label');
    detailsLabel.for = this.detailInput;
    detailsLabel.classList.add("pin-label-text");
    detailsLabel.innerHTML = "Details: ";

    popupHTML.appendChild(pinTitle);
    popupHTML.appendChild(startLabel);
    popupHTML.appendChild(this.startTimeInputElm);
    popupHTML.append(endLabel);
    popupHTML.appendChild(this.endTimeInputElm);
    popupHTML.appendChild(detailsLabel);
    popupHTML.appendChild(this.detailInputElm);

    popupHTML.appendChild(this.postButtonElm);

    console.log(popupHTML);
    
    marker.bindPopup(popupHTML, {className: 'customPopup'});

  }

  showPopup(marker) {
    marker.openPopup();
  }
  hidePopup(marker) {
    marker.closePopup();
  }

}