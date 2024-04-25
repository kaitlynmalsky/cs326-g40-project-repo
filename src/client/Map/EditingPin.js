import dbInstance from '../database.js';
import MapView from './MapView.js';
import Pin from './Pin.js';

/**
 * @typedef {'new' | 'existing'} PinEditType
 */

/**
 * @class
 */
export default class EditingPin extends Pin {
  /**
   * @type {PinEditType}
   */
  #type;
  /**
   * @type {import('../database.js').Pin}
   */
  #pinInfo;

  startTimeInputName = 'edit-start-time-input';
  endTimeInputName = 'edit-end-time-input';
  detailInputName = 'edit-detail-input';
  postButtonName = 'edit-post-button';

  /**
   * @type {HTMLInputElement}
   */
  startTimeInputElm;
  /**
   * @type {HTMLInputElement}
   */
  endTimeInputElm;

  /**
   * @type {HTMLTextAreaElement}
   */
  detailInputElm;
  /**
   * @type {HTMLInputElement}
   */
  postButtonElm;

  /**
   * Constructor for EditingPin
   * @param {MapView} map
   * @param {PinEditType} type
   * @param {import('../database.js').Pin} [pinInfo]
   */
  constructor(map, type = 'new', pinInfo) {
    super(map);
    this.#type = type;
    this.#pinInfo = pinInfo;
  }

  /**
   * Renders a pin currently being edited or created
   * @returns {Promise<void>}
   */
  async render() {
    let marker;
    let currUserImage = (
      await dbInstance.getUser(dbInstance.getCurrentUserID())
    ).avatar;

    if (this.#pinInfo) {
      const {
        coords: [lat, lng],
      } = this.#pinInfo;

      marker = this.map.createMarker(currUserImage, true, lat, lng, {
        draggable: true,
        autoPan: true,
      });
    } else {
      marker = this.map.createCenterMarker(currUserImage, true, {
        draggable: true,
        autoPan: true,
      });
    }

    this.marker = marker;

    this.bindPopupTemplate(marker);
    this.showPopup(marker);

    marker.on('dragend', () => this.showPopup(marker));
  }

  /**
   *
   * @param {number} hour
   * @param {number} minutes
   */
  getClosestTimestamp(hour, minutes) {
    const now = new Date();
    const nowHour = now.getHours();
    const nowMinutes = now.getMinutes();

    const datetime = new Date();
    datetime.setSeconds(0);
    datetime.setHours(hour);
    datetime.setMinutes(minutes);

    if (nowHour < hour || (nowHour === hour && nowMinutes < minutes)) {
      datetime.setDate(datetime.getDate() + 1);
    }

    return datetime;
  }

  /**
   * Saves the edited pin information
   */
  async savePin() {
    const startTimeInputValue = this.startTimeInputElm.value;
    const endTimeInputValue = this.endTimeInputElm.value;
    const details = this.detailInputElm.value;

    const [startHour, startMinutes] = startTimeInputValue.split(':');
    const [endHour, endMinutes] = endTimeInputValue.split(':');

    const startTime = this.getClosestTimestamp(
      parseInt(startHour),
      parseInt(startMinutes),
    ).toISOString();
    const endTime = this.getClosestTimestamp(
      parseInt(endHour),
      parseInt(endMinutes),
    ).toISOString();

    const { lat, lng } = this.marker.getLatLng();

    if (this.#type === 'new') {
      /**
       * @type {import('../database.js').CreatePinInput}
       */
      const pinInfo = {
        hostID: dbInstance.getCurrentUserID(),
        startTime,
        endTime,
        details,
        coords: /** @type {[number, number]} */ ([lat, lng]),
      };

      await this.map.savePin(pinInfo);
    } else {
      /**
       * @type {import('../database.js').Pin}
       */
      const pinInfo = {
        ...this.#pinInfo,
        hostID: dbInstance.getCurrentUserID(),
        startTime,
        endTime,
        details,
        coords: /** @type {[number, number]} */ ([lat, lng]),
      };

      await this.map.updatePin(pinInfo);
    }

    this.removeMarker();
  }

  /**
   * Cancel pin edits
   */
  cancel() {
    this.removeMarker();

    if (this.#type !== 'new') {
      this.map.addPin(this.#pinInfo);
    }
  }

  /**
   * Create pin popup
   * @param {import('./MapView.js').LeafletMarker} marker
   */
  bindPopupTemplate(marker) {
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
    pinTitle.innerHTML = '<strong>New Pin\n</strong>';

    const form = document.createElement('form');

    form.appendChild(pinTitle);

    const startTimeInputElm = document.createElement('input');
    startTimeInputElm.required = true;
    startTimeInputElm.className = this.timeClass;
    startTimeInputElm.id = this.startTimeInputName;
    startTimeInputElm.type = 'time';
    this.startTimeInputElm = startTimeInputElm;

    if (this.#pinInfo) {
      const [startHour, startMinutes] = this.extractHourAndMinutes(
        this.#pinInfo.startTime,
      );
      startTimeInputElm.value = `${startHour}:${startMinutes}`;
    }

    form.appendChild(startLabel);
    form.appendChild(startTimeInputElm);

    const endTimeInputElm = document.createElement('input');
    endTimeInputElm.required = true;
    endTimeInputElm.className = this.timeClass;
    endTimeInputElm.id = this.endTimeInputName;
    endTimeInputElm.type = 'time';
    this.endTimeInputElm = endTimeInputElm;

    if (this.#pinInfo) {
      const [endHour, endMinutes] = this.extractHourAndMinutes(
        this.#pinInfo.endTime,
      );
      endTimeInputElm.value = `${endHour}:${endMinutes}`;
    }

    form.append(endLabel);
    form.appendChild(endTimeInputElm);

    const detailInputElm = document.createElement('textarea');
    detailInputElm.required = true;
    detailInputElm.id = this.detailInputName;
    detailInputElm.rows = 4;
    detailInputElm.cols = 30;
    detailInputElm.className = this.detailsClass;
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
    postButtonElm.className = this.buttonClass;
    form.appendChild(postButtonElm);

    // Handle form submit
    form.onsubmit = (e) => {
      e.preventDefault();
      this.savePin();
    };

    popupHTML.appendChild(form);

    marker.bindPopup(popupHTML, { className: 'customPopup' });
  }

  /**
   * Show the pin popup
   * @param {import('./MapView.js').LeafletMarker} marker
   */
  showPopup(marker) {
    marker.openPopup();
  }
}
