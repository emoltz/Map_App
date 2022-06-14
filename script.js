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


navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const URL = `https://www.google.com/maps/@${latitude},${longitude}`;
    const coords = [latitude, longitude];
    const map = L.map('map').setView(coords, zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coords).addTo(map)
        .bindPopup('Your location!')
        .openPopup();

}, function () {
    alert('Could not get GPS position');
})
