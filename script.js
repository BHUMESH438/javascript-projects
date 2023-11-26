'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

class Workout {
  date = new Date();
  id = Date.now().toString.slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }
}
class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    //when selector changes input type also changes
    inputType.addEventListener('change', this._toggleElevationFeild.bind(this));
  }
  // _loadMap This pattern is common when dealing with event listeners, asynchronous operations, or any situation where you want a function to be called at a later time. You pass the function reference without invoking it, and the environment (browser, Node.js, etc.) takes care of calling it when appropriate.
  _getPosition() {
    if (navigator.geolocation) {
      console.log(navigator.geolocation);
      //here this point to the current object of geoplocation api
      console.log('this', this);
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('not able fetch');
        }
      );
    }
  }
  _loadMap(cordinate) {
    let latitude = cordinate.coords.latitude;
    let { longitude } = cordinate.coords;
    let lat_log_cor = [latitude, longitude];
    //initialise the view to the dom
    //in the regular functiion the this is undefiend when we use strict mode to prevent we use bind
    this.#map = L.map('map').setView(lat_log_cor, 13);
    //set the map view to the dom
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 40,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);

    //after click on the map form apper, distance auto focus
    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(cord) {
    this.#mapEvent = cord; //updating the position to the global state
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleElevationFeild() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    //reset empty value at inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    const { lat, lng } = this.#mapEvent.latlng;
    //receive position
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 250,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}
const app = new App();
//submit
