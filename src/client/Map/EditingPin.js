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

  startTimeInputElm;
  endTimeInputElm;

  detailInputElm;
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

  render() {
    let marker;

    if (this.#pinInfo) {
      const {
        coords: [lat, lng],
      } = this.#pinInfo;

      marker = this.map.createMarker(
        './images/pc.png',
        true,
        lat,
        lng,
        {
          draggable: true,
          autoPan: true,
        },
      );
    } else {
      marker = this.map.createCenterMarker(
        './images/pc.png',
        true,
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

  async savePin() {
    const startTime = this.startTimeInputElm.value;
    const endTime = this.endTimeInputElm.value;
    const details = this.detailInputElm.value;

    const [startHour, startMinutes] = startTime.split(':');
    const [endHour, endMinutes] = endTime.split(':');

    const { lat, lng } = this.marker.getLatLng();

    const pinInfo = {
      ...this.#pinInfo,
      startTime,
      endTime,
      details,
      coords: /** @type {[number, number]} */ ([lat, lng]),
    };

    if (this.#type === 'new') {
      await this.map.savePin(pinInfo);
    } else {
      await this.map.updatePin(pinInfo);
    }

    this.removeMarker();
  }

  cancel() {
    this.removeMarker();

    if (this.#type !== 'new') {
      this.map.addPin(this.#pinInfo);
    }
  }

  /**
   *
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
      startTimeInputElm.value = this.#pinInfo.startTime;
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
      endTimeInputElm.value = this.#pinInfo.endTime;
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
    form.onsubmit = () => this.savePin();

    popupHTML.appendChild(form);

    marker.bindPopup(popupHTML, { className: 'customPopup' });
  }

  /**
   *
   * @param {import('./MapView.js').LeafletMarker} marker
   */
  showPopup(marker) {
    marker.openPopup();
  }
}
