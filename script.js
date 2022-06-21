'use strict';

//____________________________ELEMENTS

class Workout {

    constructor(coords, distance, duration) {
        this._id = Math.trunc(Math.random() * 1000000 + 1);

        this._coords = coords;
        this._distance = distance;
        this._duration = duration;
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this._description = `${this._type[0].toUpperCase()}${this._type.slice(1)}`;
    }

}

//wrote this on ipad!

class Running extends Workout {
    _type = 'running';

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;

        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        // min/miles

        this._pace = this._duration / this._distance;
        return this._pace;
    }
}

class Cycling extends Workout {
    _type = 'cycling';

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this._elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed() {
        this._speed = this._distance / (this._duration / 60);
        return this._speed;
    }
}

////////////////////////////////////////////////////////////
//APP ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;
    #workouts = [];
    currCords = [];

    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function () {
                    alert('Could not get your position');
                }
            );
    }

    _loadMap(position) {
        const zoomLevel = 15;
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
        const URL = `https://www.google.com/maps/@${latitude},${longitude}`;
        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, zoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        L.marker(coords)
            .addTo(this.#map)
            .bindPopup('Your location!')
            .openPopup();
        this.#map.on('click', this._showForm.bind(this));

    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
        document.querySelector(".begin-text").classList.add("hidden");
    }

    _toggleElevationField() {

    }

    _newWorkout(e) {

        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => {
            return inp >= 0;
        })

        e.preventDefault();

        //get data from form
        const {lat, lng} = this.#mapEvent.latlng;
        this.currCoords = [lat, lng];
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        let workout;

        //check if data is valid

        // if activity __, then make the right object
        if (type === 'running') {
            const cadence = +inputCadence.value;
            //check if data is valid
            if (!validInputs(distance, duration, cadence) ||
                !allPositive(distance, duration, cadence)) {
                alert('inputs must be positive numbers');
                return;
            }

            workout = new Running([lat, lng], distance, duration, cadence);

        } else if (type === 'cycling') {
            const elevation = +inputElevation;
            if (!validInputs(distance, duration, elevation) ||
                !allPositive(distance, duration)) {
                alert('inputs must be positive numbers');
                return;
            }
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        // add new object to work out array
        this.#workouts.push(workout);

        //render workout on map as marker
        this._renderWorkout(workout);

        // Render workout on the list


        //hide the form and...
        //clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        //display marker
        this._renderWorkoutMarker(workout);

    }

    _renderWorkout(workout) {
        let html = `
            <li class="workout ${workout._type}--running" data-id="${workout._id}">
             <h2 class="workout__title">${workout._description}</h2>
              <div class="workout__details">
                <span class="workout__icon">${workout._type === 'running' ? '🏃' : '‍🚴‍️'}‍️</span>
                <span class="workout__value">${workout._distance}</span>
                <span class="workout__unit">km</span>
              </div>
              <div class="workout__details">
                 <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout._duration}</span>
                <span class="workout__unit">min</span>
              </div>
        `;

        if (workout._type === 'running'){
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout._pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
            </li>
        `;
        }

        if(workout._type === 'cycling'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout._speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout._elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>`;
        }
        form.insertAdjacentHTML(`afterend`, html);
    }

    _renderWorkoutMarker(workout) {
        //this.currCords...?
        L.marker(workout._coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `normal-walk-popup`,
            // className: `${workout._type}-popup`,
        }))
            .setPopupContent(workout.distance)
            .openPopup();
    }

}


function clickError() {
    alert("Could not get position");
}


inputType.addEventListener('change', function () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

})

const app = new App();