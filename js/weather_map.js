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

    // This changes  the type of  theme for the map
    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');

    for (const input of inputs) {
        input.onclick = (layer) => {
            const layerId = layer.target.id;
            map.setStyle('mapbox://styles/mapbox/' + layerId);
        };
    }

    // I got the code from  https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/ that creates a draggable marker
    const marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat([-99.48962, 29.42692])
        .addTo(map);

    function onDragEnd() {
        const lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
        // created coords so we can call it on updateWeather
        let coords = [
            `${lngLat.lng}`,
            `${lngLat.lat}`
        ]
        updateWeather(coords)

    }
    marker.on('dragend', onDragEnd);
    map.setCenter([-99.48962, 29.42692]);





































})