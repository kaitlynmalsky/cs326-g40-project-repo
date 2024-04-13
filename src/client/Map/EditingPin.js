import Pin from './Pin.js';

export default class EditingPin extends Pin {
  #pinInfo;

  startTimeInputName = 'start-time-input';
  endTimeInputName = 'end-time-input';
  detailInputName = 'detail-input';
  postButtonName = 'post-button';

  marker;
  startTimeInputElm;
  endTimeInputElm;
  detailInputElm;
  postButtonElm;

  constructor(map, pinInfo) {
    super(map);
    this.#pinInfo = pinInfo;
  }

  render() {
    let marker;

    if (this.#pinInfo) {
      const {
        coords: [x, y],
      } = this.#pinInfo;

      marker = this.map.createMarker(
        './images/placeholder_avatar.png',
        './images/shadowcircletemp.png',
        x,
        y,
        {
          draggable: true,
          autoPan: true,
        },
      );
    } else {
      marker = this.map.createCenterMarker(
        './images/placeholder_avatar.png',
        './images/shadowcircletemp.png',
        {
          draggable: true,
          autoPan: true,
        },
      );
    }

    this.marker = marker;

    this.bindPopupTemplate(marker);
    this.showPopup(marker);

    marker.on('dragend', () => this.showPopup(marker));
  }

  async submitPin() {
    const startTime = this.startTimeInputElm.value;
    const endTime = this.endTimeInputElm.value;
    const details = this.detailInputElm.value;

    const { lat, lng } = this.marker.getLatLng();

    const pinInfo = {
      startTime,
      endTime,
      details,
      coords: [lat, lng],
    };

    await this.map.savePin(pinInfo);
    this.marker.remove();
  }

  bindPopupTemplate(marker) {
    const timeClass = `bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5`;
    const detailClass =
      'bg-gray-50 border border-gray-300 block mb-2 text-sm font-medium text-gray-900 text-black rounded-lg p-2';
    const buttonClass =
      'bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 border-b-4 border-orange-800 hover:border-orange-900 rounded';

    const popupHTML = document.createElement('div');

    // ******************************************
    // Labels
    const startLabel = document.createElement('label');
    startLabel.for = this.startTimeInput;
    startLabel.classList.add('pin-label-text');
    startLabel.innerHTML = 'Start time:';

    const endLabel = document.createElement('label');
    endLabel.for = this.endTimeInput;
    endLabel.classList.add('pin-label-text');
    endLabel.innerHTML = 'End time:';

    const detailsLabel = document.createElement('label');
    detailsLabel.for = this.detailInput;
    detailsLabel.classList.add('pin-label-text');
    detailsLabel.innerHTML = 'Details: ';

    // ******************************************

    const pinTitle = document.createElement('div');
    pinTitle.classList.add('pin-label-text');
    pinTitle.innerHTML = '<strong>New Pin\n</strong>';

    const form = document.createElement('form');

    form.appendChild(pinTitle);

    const startTimeInputElm = document.createElement('input');
    startTimeInputElm.required = true;
    startTimeInputElm.className = timeClass;
    startTimeInputElm.id = this.startTimeInputName;
    startTimeInputElm.type = 'time';
    this.startTimeInputElm = startTimeInputElm;

    if (this.#pinInfo) {
      startTimeInputElm.value = this.#pinInfo.startTime;
    }

    form.appendChild(startLabel);
    form.appendChild(startTimeInputElm);

    const endTimeInputElm = document.createElement('input');
    endTimeInputElm.required = true;
    endTimeInputElm.className = timeClass;
    endTimeInputElm.id = this.endTimeInputName;
    endTimeInputElm.type = 'time';
    this.endTimeInputElm = endTimeInputElm;

    if (this.#pinInfo) {
      endTimeInputElm.value = this.#pinInfo.endTime;
    }

    form.append(endLabel);
    form.appendChild(endTimeInputElm);

    const detailInputElm = document.createElement('textarea');
    detailInputElm.required = true;
    detailInputElm.id = this.detailInputName;
    detailInputElm.rows = 4;
    detailInputElm.cols = 30;
    detailInputElm.className = detailClass;
    this.detailInputElm = detailInputElm;

    if (this.#pinInfo) {
      detailInputElm.value = this.#pinInfo.details;
    }

    form.appendChild(detailsLabel);
    form.appendChild(detailInputElm);

    const postButtonElm = document.createElement('input');
    postButtonElm.type = 'submit';
    postButtonElm.id = this.postButtonName;
    postButtonElm.value = 'Post';
    postButtonElm.className = buttonClass;
    this.postButtonElm = postButtonElm;
    form.appendChild(postButtonElm);

    // Handle form submit
    form.onsubmit = () => this.submitPin();

    popupHTML.appendChild(form);

    marker.bindPopup(popupHTML, { className: 'customPopup' });
  }

  showPopup(marker) {
    marker.openPopup();
  }
  hidePopup(marker) {
    marker.closePopup();
  }
}
