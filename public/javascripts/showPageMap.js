mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: project.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(project.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup()
            .setHTML("sadasd")
    )
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());
