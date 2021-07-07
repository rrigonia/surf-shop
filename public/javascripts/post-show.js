// MAPBOX
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

    // Toggle EDIT REVIEW FORM
const editBtns = document.querySelectorAll('.toggle-edit-form');
const editForms = document.querySelectorAll('.edit-review-form');

editBtns.forEach((btn, i) => {
    btn.addEventListener('click', function (e) {
        // toggle the edit button text on click
        btn.innerHTML = btn.innerHTML === 'Edit' ? 'Cancel' : 'Edit';
        // toggle the visibily of the edit review form
        if (editForms[i].style.display === '') editForms[i].style.display = 'block';
        else editForms[i].style.display = editForms[i].style.display === 'none' ? 'block' : 'none';
    })
})




