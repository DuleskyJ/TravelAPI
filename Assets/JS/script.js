var teleportButton = $("#teleportButton");
var submitBox = $("#submitBox");
var submitButton = $('#submitButton');
var goButton = $('#go');
var RandomButton = $('#Random');
var datepicker = $('#datepicker');
var userCity = $('#usercity');
var attractions = $('#attractions');
var itineraryWrapper = $('#itineraryWrapper');
var itineraryButton = $('#itineraryButton');
var cityList = ['Tokyo', 'Rome', 'Paris', 'London', 'New York', 'Istanbul', 'Barcelona', 
'Amsterdam', 'Dubai', 'Singapore', 'Bangkok', 'Berlin', 'Cape Town', 'Seoul', 'Hong Kong', 
'Marrakech', 'Mumbai', 'Prague', 'Madrid', 'Vancouver', 'Sydney', 'Taipei', 'Copenhagen', 'Edinburgh'];

//displays modal and removes teleport button
teleportButton.click(function (event) {
    event.preventDefault();
    $('.modal').attr('class', 'modal is-active');
    $('#teleportBox').attr('style', 'display: none');
}); 


itineraryButton.click(function (event) {
    event.preventDefault();
    var itinerarySchedule = {};
    var counter = 0;
    var saveDate = $('#saveDate').text();
    $('.timeBlock').each(function(){
        if (counter<10) {
            itinerarySchedule[counter] = $('#0'+counter).val();
        } else {
            itinerarySchedule[counter] = $('#'+counter).val();
        }
        counter++;
    })
    localStorage.setItem(saveDate, itinerarySchedule);
})

//changes response screen based on new user input
submitButton.click(function (event) {
    event.preventDefault();
    attractions.html('')
    $('#attractionDisplay').attr('style', 'display: none');
    $('#loadingDiv').attr('class','loading');
    $('#loadingDiv').attr('style', 'display: block');
    var cityName = submitBox.val();
    if (cityName) {
        getCityID(cityName)
        getCoordinates(cityName)
    } else {
        alert("We know you're excited but you need to enter a city first!");
    }
})

//submits input and removes modal
goButton.click(function(event) {
    event.preventDefault();
    var cityName = userCity.val();
    $('#itinerary').children('h2').text(datepicker.val());
    if(cityName){
        makeLoadAnimation()
        getCityID(cityName)
        getCoordinates(cityName)
    } else {
        alert("We know you're excited but you need to enter a city first!\nOr press 'Take Me Somewhere!' for a random adventure!");
    }
})

setInterval(function(){
    var saveDate = $('#saveDate').text();
    var itinerarySchedule = localStorage.getItem(saveDate);
    var counter = 0;
    $('.timeBlock').each(function(){
        if (counter<10) {
            $('#0'+counter).val(itinerarySchedule[counter]);
        } else {
            $('#'+counter).val(itinerarySchedule[counter]);
        }
        counter++
    })
}, 1000)

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
            $('#loadingDiv').attr('class','notloading');
            $('.modal').attr('class', 'modal');
            $('#attractionDisplay').attr('style', 'display: block');
            $('#teleportSearch').attr('style', 'display: block');
            //add where the data needs to be displayed here
            for (var i = 0; i < 23; i++){
                var timeDiv = $('<div>');
                var timeP = $('<p>');
                var timeText = $('<textarea>');
                if (i==0) {
                    timeP.text('12AM')
                } else if (i > 0 && i < 12) {
                    timeP.text(i+'AM')
                } else if (i==12){
                    timeP.text('12PM')
                }else if (i > 12) {
                    timeP.text((i-12)+'PM')
                }
                timeText.attr('placeholder', 'Enter What You Want To Do Here!');
                timeDiv.attr('class', 'timeBlock');
                if (i<10) {
                    timeText.attr('id', '0'+i);
                } else {
                    timeText.attr('id', i);
                }
                timeDiv.append(timeText, timeP);
                itineraryWrapper.append(timeDiv);

            }
            var responseData = data.results.data;
            var counter = 0;
                for (key in responseData){
                var div = $('<div>');
                var h3 = $('<h3>');
                var addressP = $('<p>');
                var ratingP = $('<p>');
                var Img = $('<img>');
                h3.text('"'+data.results.data[counter].name+'"');
                addressP.text('Address: '+data.results.data[counter].address);
                ratingP.text('Rating: '+data.results.data[counter].raw_ranking.substr(0, 3)+'/5');
                Img.attr('src', data.results.data[counter].photo.images.small.url);
                div.append(Img, h3, addressP, ratingP);
                attractions.append(div);
                counter++
            }
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

function makeLoadAnimation () {
    $('#modalContent').html('');
    var loading = $('<div>');
    $('#modalContent').append(loading);
    loading.attr('class', 'loading');
    loading.attr('style', 'display: block');
}
$( function() {
    $( "#datepicker" ).datepicker();
  } );

  
