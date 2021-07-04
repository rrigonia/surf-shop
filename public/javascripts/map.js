mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: post.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(post.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${post.title}</h3> <p>${post.description}</p>`
            )
    )
    .addTo(map);



