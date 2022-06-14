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

let map, mapEvent;

function clickError(){
    alert("Could not get position");
}


navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const URL = `https://www.google.com/maps/@${latitude},${longitude}`;
    const coords = [latitude, longitude];
    map = L.map('map').setView(coords, zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coords)
        .addTo(map)
        .bindPopup('Your location!')
        .openPopup();
    map.on('click', function(mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
        // createPin();

    },clickError)

}, function () {
    alert('Could not get GPS position');
})

function createPin(){
    const {lat, lng} = mapEvent.latlng;
    const currCoords = [lat, lng];
    L.marker(currCoords).addTo(map).bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        // closeOnClick: false,
        className: `normal-walk-popup`,
    }))
        .setPopupContent('New Popup')
        .openPopup();

}

form.addEventListener('submit', function(e){
    //clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

    //display marker
    e.preventDefault();
    createPin();

})

inputType.addEventListener('change', function(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

})