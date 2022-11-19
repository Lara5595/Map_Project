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
        // created coords, so we can call it on updateWeather without it, it would not update the weather when we drop the pin
        let coords = [
            `${lngLat.lng}`,
            `${lngLat.lat}`
        ]
        updateWeather(coords)

        }
        marker.on('dragend', onDragEnd);
        map.setCenter([-99.48962, 29.42692]);

        // https://docs.mapbox.com/mapbox-gl-js/example/locate-user/
        // Add geolocate control to the map.
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
       // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
       // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        );

    //Set a style to the map
    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });



    // This make the cards with a five-day forecast

    $.get("https://api.openweathermap.org/data/2.5/forecast", {
        APPID: OPEN_WEATHER_APPID,
        lat: 29.423017,
        lon: -98.48527,
        units: "imperial"
    }).done(function (data) {
        // the console.log show how we get the weather descriptions
        console.log(data.list[0].weather[0].description)
        console.log(data)
        //    This logs the current city name
        $("#currentCity").text(`Current City: ${data.city.name}`);

           // This loop for every 8 days since its a new day in the data

        data.list.forEach((forecast, i) => {
            if(i % 8 == 0) {
                $(`#cards`).append(`<div class="card-header col-2 mx-2 border"> <p class="date">${data.list[i].dt_txt.split(" ")[0]}</p>
                 <p class="temp"><img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"><br> ${data.list[i].main.temp}&#8457 / ${data.list[i].main.temp}&#8457;</p><hr>
                 <p class="city">City: ${data.city.name}</p><hr>
                 <p class="description">Description: ${data.list[i].weather[0].description}</p><hr>
                 <p class="humidity">Humidity: ${data.list[i].main.humidity}</p><hr>
                 <p class="wind">Wind: ${data.list[i].wind.speed}</p><hr>
                 <p class="preassure">Preassure: ${data.list[i].main.pressure}</p></div>  `);
            }
        })
    });



    // This creates new cards for when you search a new place
    function printWeather(data){
        $(`#cards`).empty();
        data.list.forEach((forecast, i) => {
            if(i % 8 == 0) {
                $(`#cards`).append(`<div class="card-header col-2 mx-2 border"> <p class="date">${data.list[i].dt_txt.split(" ")[0]}</p>
                 <p class="temp"><img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"><br>${data.list[i].main.temp}&#8457 / ${data.list[i].main.temp}&#8457;</p><hr>
                 <p class="city">City: ${data.city.name}</p><hr>
                 <p class="description">Description: ${data.list[i].weather[0].description}</p><hr>
                 <p class="humidity">Humidity: ${data.list[i].main.humidity}</p><hr>
                 <p class="wind">Wind: ${data.list[i].wind.speed}</p><hr>
                 <p class="preassure">Preassure: ${data.list[i].main.pressure}</p></div>  `);
            }
        });
    }


    // this updates current city
    function updateWeather(coordinates){
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            APPID: OPEN_WEATHER_APPID,
            lat: coordinates[1],
            lon: coordinates[0],
            units: "imperial"
        }).done(function (data){
            $("#currentCity").text(`Current City: ${data.city.name}`);

            printWeather(data);

        })
    }

    // I got this function from mapbox lecture, and it helps make your button find a place
    document.getElementById("setMarkerButton").addEventListener('click', function (e) {
        e.preventDefault();
        const address = document.getElementById("form1").value;
        geocode(address, MAPBOX_API_TOKEN).then(function (coordinates) {
            console.log(coordinates);
            const userMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
            map.setCenter(coordinates);
            updateWeather(coordinates);
        });
    })

    // ^^^








}) // End of $function