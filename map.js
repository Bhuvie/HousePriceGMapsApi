// Put your zillow.com API key here
var zwsid = "X1-ZWz18ytgsn0ikr_at3ig";
var map;
var request = new XMLHttpRequest();
var marker;
var rgLat, rgLong;
var geocoder;
//Bhuvanesh
function initialize() {
    initMap();
}

function resetform() {
    document.getElementById("form1").reset();
}

function zestim(address, city, state, zipcode,fulladdress) {
    request.onreadystatechange = function(){displayResult(fulladdress);};
    request.open("GET", "proxy.php?zws-id=" + zwsid + "&address=" + encodeURI(address) + "&citystatezip=" + city + "+" + state + "+" + zipcode);
    request.withCredentials = "true";
    request.send(null);
}

function displayResult(fulladdress) {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value;
        value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
        if (value) 
        {
            
            document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + fulladdress + " Estimate: $";    
            document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + value + "<br/>";
            marker.setLabel({ text: fulladdress+"; Estimate: $"+value, color: "#381f15", fontSize: "15px", fontWeight: "bold" });
        }
        else {
            //Nothing if no zestimate
            marker.setLabel(" ");
        }
        
    }
}

function sendRequest() {
    var fulladdress = document.getElementById("address").value;

    var address = fulladdress.split(",")[0];
    var city = fulladdress.split(",")[1];
    var state = fulladdress.split(",")[2].trim().split(" ")[0];
    var zipcode = fulladdress.split(",")[2].trim().split(" ")[1];
    zestim(address, city, state, zipcode, fulladdress);
    geocodeAddress(geocoder, map, address, city, state, zipcode);
}


function coordinates_to_address(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    marker.setPosition(latlng);
    marker.setLabel(" ");
    var fulladdr;
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                fulladdr = results[0].formatted_address;
                
                var address = fulladdr.split(",")[0];
                var city = fulladdr.split(",")[1];
                var state = fulladdr.split(",")[2].trim().split(" ")[0];
                var zipcode = fulladdr.split(",")[2].trim().split(" ")[1];
                zestim(address, city, state, zipcode,fulladdr);
            } else {
                alert('No results found');
            }
        } else {
            var error = {
                'ZERO_RESULTS': 'Some network error'
            }

            // alert('Geocoder failed due to: ' + status);
            // alert('Geocode failed due to:  ' + error[status]);
        }
    });

}

function initMap() {
    geocoder = new google.maps.Geocoder();
    var mylatlng = new google.maps.LatLng(32.75, -97.13);
    map = new google.maps.Map(document.getElementById("mapsee"), {
        zoom: 17,
        center: mylatlng
    });
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: mylatlng,
        label: { text: "O", color: "#381f15", fontSize: "15px", fontWeight: "bold" }
    });
    marker.setPosition(mylatlng);
    google.maps.event.addListener(map, 'click', function (e) {
        rgLat = e.latLng.lat();
        rgLong = e.latLng.lng();
        coordinates_to_address(rgLat, rgLong);


        // alert("Latitude: " + rgLat + "\r\nLongitude: " + rgLong);
    });

}

function geocodeAddress(geocoder, resultsMap, address, city, state, zipcode) {

    geocoder.geocode({ 'address': address + "," + city + "," + state + "," + zipcode }, function (results, status) {
        if (status === 'OK') {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var latlng = new google.maps.LatLng(latitude, longitude);
            resultsMap.setCenter(new google.maps.LatLng(latitude, longitude));
            marker.setPosition(latlng);
            marker.setLabel(" ");
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


//   References:
//   https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
// https://developers.google.com/maps/documentation/javascript/markers
// https://gis.stackexchange.com/questions/33238/how-do-you-get-the-coordinates-from-a-click-or-drag-event-in-the-google-maps-api
// https://www.aspsnippets.com/Articles/Get-Latitude-and-Longitude-Location-Coordinates-using-Google-Maps-OnClick-event.aspx
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
// https://stackoverflow.com/questions/26387713/get-the-full-formatted-address-from-reverse-geocoding   
// https://stackoverflow.com/questions/40490129/set-label-size-in-google-maps-api
// https://stackoverflow.com/questions/33455257/google-maps-api-v3-label-and-color-for-marker
// https://stackoverflow.com/questions/41478502/google-map-marker-label-text-color-change