import dbInstance from '../database.js';
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
  /**
   * @type {import('../database.js').User}
   */
  #host;
  /**
   * @type {import('../database.js').PinAttendee}
   */
  attendee;

  startTimeInputName = 'existing-start-time-input';
  endTimeInputName = 'existing-end-time-input';
  detailInputName = 'existing-detail-input';
  editButtonName = 'existing-edit-button';
  deleteButtonName = 'existing-delete-button';
  interestButtonName = 'existing-interest-button';

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

  /**
   * Render an existing pin
   */
  async render() {
    const {
      coords: [x, y],
    } = this.#pinInfo;

    this.#host = await dbInstance.getUser(this.#pinInfo.hostID);

    let currUserImage = this.#host.avatar;
    const marker = this.map.createMarker(currUserImage, false, x, y, {
      draggable: false,
      autoPan: false,
    });

    this.marker = marker;

    await this.bindPopupTemplate(marker);
  }

  /**
   * Create pin popup
   * @param {import('./MapView.js').LeafletMarker} marker
   */
  async bindPopupTemplate(marker) {
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
    const form = document.createElement('form');

    const pinHeader = document.createElement('div');
    pinHeader.id = `pin-header-${this.#pinInfo.pinID}`;
    pinHeader.className = 'flex flex-row gap-x-36';

    const pinTitle = document.createElement('div');
    pinTitle.classList.add('pin-label-text');
    pinTitle.innerHTML = '<strong>Pin</strong>';

    const hostNameElm = document.createElement('p');
    hostNameElm.innerText = this.#host.name;
    hostNameElm.className = 'flex-auto'

    pinHeader.appendChild(pinTitle);
    pinHeader.appendChild(hostNameElm);

    form.appendChild(pinHeader);

    const [startHour, startMinutes] = this.extractHourAndMinutes(
      this.#pinInfo.startTime,
    );
    const [endHour, endMinutes] = this.extractHourAndMinutes(
      this.#pinInfo.endTime,
    );

    const startTimeInputElm = document.createElement('input');
    startTimeInputElm.required = true;
    startTimeInputElm.className = timeClass;
    startTimeInputElm.id = this.startTimeInputName;
    startTimeInputElm.type = 'time';
    startTimeInputElm.readOnly = true;
    this.startTimeInputElm = startTimeInputElm;

    startTimeInputElm.value = `${startHour}:${startMinutes}`;

    form.appendChild(startLabel);
    form.appendChild(startTimeInputElm);

    const endTimeInputElm = document.createElement('input');
    endTimeInputElm.required = true;
    endTimeInputElm.className = timeClass;
    endTimeInputElm.id = this.endTimeInputName;
    endTimeInputElm.type = 'time';
    endTimeInputElm.readOnly = true;
    this.endTimeInputElm = endTimeInputElm;

    endTimeInputElm.value = `${endHour}:${endMinutes}`;

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

    detailInputElm.value = this.#pinInfo.details;

    form.appendChild(detailsLabel);
    form.appendChild(detailInputElm);

    popupHTML.appendChild(form);

    // ******************************************
    // Pin Actions

    const pinActionsDiv = document.createElement('div');
    pinActionsDiv.className = 'flex gap-32';

    if (this.#pinInfo.hostID === dbInstance.getCurrentUserID()) {
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
    } else {
      const interestButton = document.createElement('button');
      interestButton.id = `${this.interestButtonName}-${this.#pinInfo.pinID}`;

      this.attendee = await dbInstance.getPinAttendee(
        this.#pinInfo.pinID,
        dbInstance.getCurrentUserID(),
      );
      interestButton.innerText = this.attendee ? 'Leave' : 'Join'; // Depending on if user is already interested or not
      interestButton.addEventListener('click', () => this.toggleAttending());

      pinActionsDiv.appendChild(interestButton);
    }

    popupHTML.appendChild(pinActionsDiv);
    // ******************************************

    marker.bindPopup(popupHTML, { className: 'customPopup' });
  }

  /**
   * Toggle pin attendance
   */
  async toggleAttending() {
    const btn = document.getElementById(
      `${this.interestButtonName}-${this.#pinInfo.pinID}`,
    );
    if (this.attendee) {
      await dbInstance.removePinAttendee(this.attendee);
      this.attendee = null;
      btn.innerText = 'Join';
    } else {
      this.attendee = await dbInstance.addPinAttendee(
        this.id,
        dbInstance.getCurrentUserID(),
      );
      btn.innerText = 'Leave';
    }
  }
}
