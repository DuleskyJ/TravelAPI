var teleportButton = $("#teleportButton");
var submitBox = $("#submitBox");
var goButton = $('#go');
var datepicker = $('#datepicker');
var userCity = $('#usercity');

//displays modal and removes teleport button
teleportButton.click(function (event) {
    event.preventDefault;
    $('.modal').attr('class', 'modal is-active');
    $('#teleportBox').attr('style', 'display: none');
}); 

//submits input and removes modal
goButton.click(function(event) {
    event.preventDefault();
    var cityName = userCity.val();
    if(cityName){
        $('.modal').attr('class', 'modal');
        $('#map').attr('style', 'display: block');
        getCityID(cityName)
        getCoordinates(cityName)
    } else {
        alert("We know you're excited but you need to enter a city first!\nOr press 'Take Me Somewhere!' for a random adventure!");
    }
})

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
            var location = data.results[0].geometry.location;
            // Use the latitude and longitude to display a map centered on the city
            initMap(location.lat, location.lng);
        })
        .catch(error => console.error('Error:', error));

}

//lists 20 tourist attractions in or around target city--Requires ID code from getcityID
function getAttractions (cityID) {
    const url = 'https://tourist-attraction.p.rapidapi.com/search';
    const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': '45534c69cfmsh2323382acbfdd65p128493jsnc2a053bfb606',
		'X-RapidAPI-Host': 'tourist-attraction.p.rapidapi.com'
	},
	body: new URLSearchParams({
        //these represent paramaters that are reuired or optional, can be added to/modified
		location_id: cityID, 
		language: 'en_US',
		currency: 'USD',
		offset: '0'
	})
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            //add where the data needs to be displayed here
        })

}

//pulls data about target city. runs getAttractions using ID from target city data
function getCityID(city) {
    var cityID;
    const url = 'https://tourist-attraction.p.rapidapi.com/typeahead';
    const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': '45534c69cfmsh2323382acbfdd65p128493jsnc2a053bfb606',
		'X-RapidAPI-Host': 'tourist-attraction.p.rapidapi.com'
	},
	body: new URLSearchParams({
        //both of these options are required
		q: city,
		language: 'en_US'
	})
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            cityID = data.results.data[0].result_object.location_id;
            getAttractions(cityID);
        })
        
}


$( function() {
    $( "#datepicker" ).datepicker();
  } );

  
