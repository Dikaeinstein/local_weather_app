/* jshint esversion: 6 */

// Render the Skycons weather icon
let renderIcon = function (icon) {
    let skycons = new Skycons({"color": "white"});
    // on Android, a nasty hack is needed: {"resizeClear": true}

    // you can add a canvas by it's ID...
    skycons.add("weather-icon1", icon);
    // start animation!
    skycons.play();
};

let getWeather = function (position) {
     $.ajax({
        type: "GET",
        url: "https://api.darksky.net/forecast/7da21815540b8eda688c87224d26eb86/" +
            position.coords.latitude + "," + position.coords.longitude + "?exclude=minutely,hourly,daily,alerts&units=auto",
        dataType: "jsonp",
        contentType: "application/json",
        success: function (res) {
            let iconText = res.currently.icon.replace(/\-/g, " ");
            let icon = res.currently.icon.replace(/\-/g, "_");
            let temp = res.currently.temperature + "\u00B0" + "C";

            renderIcon(icon);
            $(".weather-icon-text").css("text-transform", "uppercase").html(iconText);
            $(".weather-temp").html(temp);
        },
        error: function (jqxhr, status, errMsg) {
            $(".weather-icon-text").css("font-style", "italic").text(`status: ${status} - ${errMsg}`);
        },
        timeout: 5000,
        cache: false
    });
};

// show error messages depending on error
let showError = function (error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            $(".weather-icon-text").css({
                "font-style": "italic",
                "font-size": "1rem"
            }).html("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            $(".weather-icon-text").css({
                "font-style": "italic",
                "font-size": "1rem"
            }).html("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            $(".weather-icon-text").css({
                "font-style": "italic",
                "font-size": "1rem"
            }).html("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            $(".weather-icon-text").css({
                "font-style": "italic",
                "font-size": "1rem"
            }).html("An unknown error occurred.");
            break;
    }
};

let getLocation = function (success, error) {
    // check browser support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
         console.log("Geolocation is not supported by this browser.");
    }
};


// on DOM load
$(document).ready(function () {
    // Get weather
    getLocation(getWeather, showError);

    // Toggle temperature unit (Celcius/Fahenreit)
    $(".toggle-temp").click(function () {
        let tempC, 
            tempF,
            tempText = $(".weather-temp").html();
        console.log(tempText);
        // Check if unit is in Celcius
        if (/C$/.test(tempText)) {
            tempC = parseFloat(tempText);
            // Convert to Fahenreit
            tempF = (9 * tempC) / 5;
            $(".weather-temp").html(`${tempF.toFixed(2)}\u00B0F`);
        } else {
            tempF = parseFloat(tempText);
            // Convert to Celcius
            tempC = (5 * tempF) / 9;
            $(".weather-temp").html(`${tempC.toFixed(2)}\u00B0C`);
        }
        // remove outline on button after clicked
        $(this).css("outline", "none");
    });
});

