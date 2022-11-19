$(function () {

    // This creates the map
    mapboxgl.accessToken = MAPBOX_API_TOKEN;  //we gave our token a var MAPBOX on keys.js
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-99.48962, 29.42692],
        zoom: 2,
        projection: 'globe'
    });







































})