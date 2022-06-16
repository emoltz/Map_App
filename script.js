'use strict';

// prettier-ignore

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


//_____________________________________________ELEMENTS
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const zoomLevel = 15;

// let map, mapEvent;

class App{

    #map;
    #mapEvent;

    constructor(){
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

    _loadMap(position){
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

    _showForm(mapE){
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField(){

    }

    _newWorkout(e) {
        e.preventDefault();
        //clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        //display marker
        const {lat, lng} = this.#mapEvent.latlng;
        const currCoords = [lat, lng];
        L.marker(currCoords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            // closeOnClick: false,
            className: `normal-walk-popup`,
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