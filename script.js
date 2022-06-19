'use strict';

// prettier-ignore

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


//_____________________________________________ELEMENTS

const zoomLevel = 15;


class Workout{

    constructor(coords, distance, duration){
        this._id = Math.trunc(Math.random() * 1000000 + 1);

        this._coords = coords;
        this._distance = distance;
        this._duration = duration;
    }
}
//wrote this on ipad!

class Running extends Workout{
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;

        this.calcPace();
    }

    calcPace(){
        // min/miles

        this._pace = this._duration / this._distance;
        return this._pace;
    }
}
class Cycling extends Workout{
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed(){
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
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
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

        // Render workout on the list

        //hide the form and...
        //clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        //display marker

        const currCoords = [lat, lng];
        L.marker(currCoords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            // closeOnClick: false,
            // className: `normal-walk-popup`,
            className: `${type}-popup}`
        }))
            .setPopupContent('New Popup')
            .openPopup();
    }

}


function clickError(){
    alert("Could not get position");
}



inputType.addEventListener('change', function(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

})

const app = new App();