import MapView from './MapView.js';
import Pin from './Pin.js';

/**
 * @class
 */
export default class ExistingPin extends Pin {
  /**
   * @type {string}
   */
  id;
  /**
   * @type {import('../database.js').Pin}
   */
  #pinInfo;

  startTimeInputName = 'existing-start-time-input';
  endTimeInputName = 'existing-end-time-input';
  detailInputName = 'existing-detail-input';
  editButtonName = 'existing-edit-button';
  deleteButtonName = 'existing-delete-button';

  /**
   *
   * @param {MapView} map
   * @param {import('../database.js').Pin} pinInfo
   */
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

    this.marker = marker;

    this.bindPopupTemplate(marker);
  }

  /**
   *
   * @param {import('./MapView.js').LeafletMarker} marker
   */
  bindPopupTemplate(marker) {
    const timeClass = `bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5`;
    const detailClass =
      'bg-gray-50 border border-gray-300 block mb-2 text-sm text-gray-900 text-black rounded-lg p-2';
    const editButtonClass =
      'bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-600 hover:border-orange-700 rounded';
    const deleteButtonClass =
      'bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 border-b-4 border-red-800 hover:border-red-900 rounded';

    const popupHTML = document.createElement('div');

    // ******************************************
    // Labels
    const startLabel = document.createElement('label');
    startLabel.htmlFor = this.startTimeInputName;
    startLabel.classList.add('pin-label-text');
    startLabel.innerHTML = 'Start time:';

    const endLabel = document.createElement('label');
    endLabel.htmlFor = this.endTimeInputName;
    endLabel.classList.add('pin-label-text');
    endLabel.innerHTML = 'End time:';

    const detailsLabel = document.createElement('label');
    detailsLabel.htmlFor = this.detailInputName;
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

    // ******************************************
    // Pin Actions
    const pinActionsDiv = document.createElement('div');
    pinActionsDiv.className = 'flex gap-32';

    const editButtonElm = document.createElement('button');
    editButtonElm.id = this.editButtonName;
    editButtonElm.innerText = 'Edit';
    editButtonElm.className = editButtonClass;

    editButtonElm.addEventListener('click', () => {
      this.map.editPin(this.id);
    });

    pinActionsDiv.appendChild(editButtonElm);

    const deleteButtonElm = document.createElement('button');
    deleteButtonElm.id = this.deleteButtonName;
    deleteButtonElm.innerText = 'Delete';
    deleteButtonElm.className = deleteButtonClass;

    deleteButtonElm.addEventListener('click', () => {
      this.map.deletePin(this.#pinInfo);
    });

    pinActionsDiv.appendChild(deleteButtonElm);

    popupHTML.appendChild(pinActionsDiv);
    // ******************************************

    marker.bindPopup(popupHTML, { className: 'customPopup' });
  }
}
