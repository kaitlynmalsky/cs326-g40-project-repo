export default class Pin {
  map;

  constructor(map) {
    this.map = map;
  }

  addToMap() {
    this.placeMarker();
  }

  render() {
    console.error('Forgot to override render!');
  }
}
