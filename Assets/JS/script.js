var submitButton = $("#submitButton");
var submitBox = $("#submitBox");

submitButton.click(function (event) {
    event.preventDefault;
    var cityName = submitBox.val();
    console.log(cityName);
    getCoordinates(cityName);
}); 


function initMap(x, y) {
    // The location of your map center
    var center = { lat: x, lng: y };
    // The map, centered at your location
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: center
    });
    // The marker, positioned at your location
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });
}

function getCoordinates(cityName) {
    var apiKey = 'AIzaSyD84xL-EW-Inz01Pxoe3XleBCMT_ZZXuTw';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(cityName) + '&key=' + apiKey;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var location = data.results[0].geometry.location;
            // Use the latitude and longitude to display a map centered on the city
            initMap(location.lat, location.lng);
        })
        .catch(error => console.error('Error:', error));

}