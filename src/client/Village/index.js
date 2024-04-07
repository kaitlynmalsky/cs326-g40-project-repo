import View from '../View.js';

export default class VillageView extends View {
  constructor() {
    super();
  }

  render() {
    const villageViewElm = document.createElement('div');
    villageViewElm.id = 'village-view';
    return villageViewElm;
  }
}
