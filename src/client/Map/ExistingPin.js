import Pin from './Pin.js';

/**
 * @class
 */
export default class ExistingPin extends Pin {
  id;
  #pinInfo;

  constructor(map, pinInfo) {
    super(map);
    this.#pinInfo = pinInfo;
    this.id = pinInfo.pinID;
  }

  render() {
    const {
      coords: [x, y],
    } = this.#pinInfo;

    const marker = this.map.createMarker(
      './images/placeholder_avatar.png',
      false,
      x,
      y,
      {
        draggable: false,
        autoPan: false,
      },
    );

    this.bindPopupTemplate(marker);
  }

  bindPopupTemplate(marker) {
    const timeClass = `bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5`;
    const detailClass =
      'bg-gray-50 border border-gray-300 block mb-2 text-sm text-gray-900 text-black rounded-lg p-2';
    const buttonClass =
      'bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 border-b-4 border-orange-800 hover:border-orange-900 rounded';

    const popupHTML = document.createElement('div');

    // ******************************************
    // Labels
    const startLabel = document.createElement('label');
    startLabel.htmlFor = this.startTimeInput;
    startLabel.classList.add('pin-label-text');
    startLabel.innerHTML = 'Start time:';

    const endLabel = document.createElement('label');
    endLabel.htmlFor = this.endTimeInput;
    endLabel.classList.add('pin-label-text');
    endLabel.innerHTML = 'End time:';

    const detailsLabel = document.createElement('label');
    detailsLabel.htmlFor = this.detailInput;
    detailsLabel.classList.add('pin-label-text');
    detailsLabel.innerHTML = 'Details: ';

    // ******************************************

    const pinTitle = document.createElement('div');
    pinTitle.classList.add('pin-label-text');
    pinTitle.innerHTML = '<strong>Pin\n</strong>';

    const form = document.createElement('form');

    form.appendChild(pinTitle);

    const startTimeInputElm = document.createElement('input');
    startTimeInputElm.required = true;
    startTimeInputElm.className = timeClass;
    startTimeInputElm.id = this.startTimeInputName;
    startTimeInputElm.type = 'time';
    startTimeInputElm.readOnly = true;
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
    endTimeInputElm.readOnly = true;
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
    detailInputElm.readOnly = true;
    detailInputElm.style.resize = 'none';
    this.detailInputElm = detailInputElm;

    if (this.#pinInfo) {
      detailInputElm.value = this.#pinInfo.details;
    }

    form.appendChild(detailsLabel);
    form.appendChild(detailInputElm);

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
