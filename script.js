'use strict';

//____________________________ELEMENTS
const walk = 'walk';
const hike = 'hike';


class Workout {
    _date = new Date();


    constructor(coords, distance, duration) {
        this._id = Math.trunc(Math.random() * 1000000 + 1);
        this._description = "NULL";
        this._coords = coords;
        this._distance = distance;
        this._duration = duration;
        this._hour = this._date.getHours();
        this._time = "";
        if (this._hour >= 12) {
            this._timeOfDay = "PM";
            if (this._hour !== 12) {
                this._time += this._hour - 12;
            }
        } else {
            this._timeOfDay = "AM";
        }
        this._time += ":" + this._date.getMinutes() + " " + this._timeOfDay;

    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this._description = `${this._type[0].toUpperCase()}${this._type.slice(1)} on ${
            months[this._date.getMonth()]
        } ${this._date.getDate()} at ${this._time}`;
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
    #zoomLevel = 15;
    currCords = [];

    constructor() {
        this._getPosition();
        this._getLocalStorage();

        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);

        // containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    }

    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        // console.log(workoutEl);
        if (!workoutEl) return;

        const workout = this.#workouts.find(
            work => work._id === workoutEl.dataset.id
        );
        this.#map.setView(workout._coords, this.#zoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            },
        });
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

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
        const URL = `https://www.google.com/maps/@${latitude},${longitude}`;
        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, this.#zoomLevel);

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

    _hideForm() {
        //Empty inputs
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        //add hidden class back on
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(
            () => (form.style.display = 'grid'), 1000
        );
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

        }

        if (type === 'cycling') {
            const elevation = +inputElevation.value;
            if (!validInputs(distance, duration, elevation) ||
                !allPositive(distance, duration))
                return alert('Inputs have to be positive numbers!');

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        // add new object to work out array
        this.#workouts.push(workout);

        //render workout on map as marker
        this._renderWorkout(workout);

        // Render workout on the list


        //hide the form and...
        this._hideForm();
        //display marker
        this._renderWorkoutMarker(workout);

        this._setLocalStorage();

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

        if (workout._type === 'running') {
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

        if (workout._type === 'cycling') {
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
            .setPopupContent("Popup Text")
            .openPopup();
    }
    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));

        if (!data) return;

        this.#workouts = data;

        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        });
    }

}



inputType.addEventListener('change', function () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

})

const app = new App();