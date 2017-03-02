$(document).ready(function() {

    let map
    let directionsDisplay
    let directionsService = new google.maps.DirectionsService();
    var originAutocomplete
    var originLatitude
    var originLongitude
    let destinationLatitude
    let destinationLongitude
    var address1
    var address2
    let currentTime = new Date();
    console.log(currentTime, "currentTime");
    let time = currentTime.getTime();
    let hours = currentTime.getHours();
    let date = currentTime.getDate()
    console.log(date, "date");

    let allTheTime = 0
    let allTheBikeMiles = 0
    let allTheDistance = 0
    // select box initialize
    $('select').material_select()
    // initialize side-nav
    $(".button-collapse").sideNav()

    function GetLatlongOrigin() {
        var geocoder = new google.maps.Geocoder();
        address1 = document.getElementById('origin-input').value;


        geocoder.geocode({
            'address': address1
        }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                originLatitude = results[0].geometry.location.lat();
                // console.log(originLatitude, "latitude origin")
                originLongitude = results[0].geometry.location.lng();
                // console.log(originLongitude, "longitude origin")

            }
        });
    }

    function GetLatlongDestination() {
        var geocoder = new google.maps.Geocoder();
        address2 = document.getElementById('destination-input').value;

        geocoder.geocode({
            'address': address2
        }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                destinationLatitude = results[0].geometry.location.lat();
                // console.log(destinationLatitude, "latitude destination")
                destinationLongitude = results[0].geometry.location.lng();
                // console.log(destinationLongitude, "longitude destination")

            }
        });
    }

    /**
     * @constructor
     */
    function AutocompleteDirectionsHandler(map) {
        //  necessary
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');

        originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {
                placeIdOnly: false
            });
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {
                placeIdOnly: false
            });

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    }


    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }
            if (mode === 'ORIG') {
                me.originPlaceId = place.place_id;
                GetLatlongOrigin()
            } else {
                me.destinationPlaceId = place.place_id;
                GetLatlongDestination()
            }

        });

    };


    // make an event listener so that when the button is clicked it will fun functions to re-render routes


    // manage location in render array


    function renderDirections(result, map) {

        var directionsRenderer3 = new google.maps.DirectionsRenderer({
            directions: result,
            routeIndex: 2,
            suppressMarkers: true,
            map: map,
            polylineOptions: {
                strokeColor: "purple"
            }
        });

        let warning = directionsRenderer3.directions.routes[0].warnings[0]
        let steps = directionsRenderer3.directions.routes[0].legs[0].steps
        console.log(steps, "steps");

        let stepDistance = directionsRenderer3.directions.routes[0].legs[0].steps.distance
        console.log(stepDistance, stepDistance);

        let stepDuration = directionsRenderer3.directions.routes[0].legs[0].steps.duration
        console.log(stepDuration, stepDuration);

        let copyright = directionsRenderer3.directions.routes[0].copyrights

        let totalLegTime = directionsRenderer3.directions.routes[0].legs[0].duration.text

        let totalLegDistance = directionsRenderer3.directions.routes[0].legs[0].distance.text

        //  ward place-id:[0] "EiY3My03NSBDb2x1bWJpYSBTdCwgV2FyZCwgQ08gODA0ODEsIFVTQQ"

        // Boulder Transit Center place-id:
        // "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E"
        // "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E"

        // Union Station place id
        // "ChIJ58F9ysN4bIcRm4CacOXarfI
        // "ChIJ58F9ysN4bIcRm4CacOXarfI"
        //  CREATE CONTROL FLOW SO EACH TABLE GOES TO APPROPRIATE SPOT
        //  REMEMBER TO DISPLAY WARNING
        let placeId = directionsRenderer3.directions.geocoded_waypoints[0].place_id
        // console.log(placeId, "placeId");


        if ($('#origin-input').val().includes('Boulder')) {
            if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
                $('#panelTwo .warning').html(warning)
                $('#copyright2').html(copyright)
                //  add leg time to total time
                allTheTime += parseInt(totalLegTime.match(/\d+/g));
                console.log('all the time step one?', allTheTime);

                let row2 = $('<tr>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                row2.append(timeSummary)
                row2.addClass('summary')


                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row2.append(distanceSummary)
                $('#panelTwo tbody').append(row2)

                //  loop through steps
                for (var i = 1; i < steps.length; i++) {
                    let instruction = steps[i].instructions

                    let stepTime = steps[i].duration.text

                    // this is writing over global varaiable
                    let stepDistance = steps[i].distance.text

                    let row = $('<tr>')
                    let colInstruction = $('<td>')
                    colInstruction.html(instruction)
                    row.append(colInstruction)


                    let colDistance = $('<td>')
                    colDistance.text(stepDistance)
                    row.append(colDistance)
                    $('#panelTwo tbody').append(row)

                    // append each instruction to the table

                    //ChIJp5XYCMN4bIcRN1lYVWhNxcM placeId

                    //ChIJ58F9ysN4bIcRm4CacOXarfI placeId
                    // ChIJZTYRctV-bIcRb74MCUMHUzQ
                    // ChIJ-3hMUcJ4bIcRuaidfDaWTnY

                }
            } else if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {

                $('#panelThree .warning').text(warning)
                $('#copyright3').text(copyright)

                allTheTime += parseInt(totalLegTime.match(/\d+/g));
                console.log('all the time step two?', allTheTime);

                let row3 = $('<tr>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')
                row3.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row3.append(distanceSummary)
                $('#panelThree tbody').append(row3)


                for (var i = 0; i < steps.length; i++) {
                    let instruction = steps[i].instructions

                    let stepTime = steps[i].duration.text

                    // this is writing over global varaiable
                    let stepDistance = steps[i].distance.text

                    let row = $('<tr>')
                    let colInstruction = $('<td>')
                    colInstruction.html(instruction)
                    row.append(colInstruction)


                    let colDistance = $('<td>')
                    colDistance.text(stepDistance)
                    row.append(colDistance)
                    $('#panelThree tbody').append(row)
                    // append each instruction to the table

                }

            } else {
                // console.log(placeId, "place going through else");
                $('#panelOne .warning').text(warning)
                $('#copyright1').text(copyright)

                allTheTime += parseInt(totalLegTime.match(/\d+/g));
                console.log(allTheTime, "alltheTime should be totaled?");

                console.log(parseFloat(totalLegDistance.match(/\d/g)), "parsing distance working?")

                let row1 = $('<tr>')
                let timeSummary = $('<td>')
                row1.append(timeSummary)
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row1.append(distanceSummary)
                $('#panelOne tbody').append(row1)


                for (var i = 0; i < steps.length; i++) {
                    let instruction = steps[i].instructions

                    let stepTime = steps[i].duration.text

                    // this is writing over global varaiable
                    let stepDistance = steps[i].distance.text

                    let row = $('<tr>')
                    let colInstruction = $('<td>')
                    colInstruction.html(instruction)
                    row.append(colInstruction)


                    let colDistance = $('<td>')
                    colDistance.text(stepDistance)
                    row.append(colDistance)
                    $('#panelOne tbody').append(row)
                    // append each instruction to the table

                }
            }

        } else if ($('#origin-input').val().includes('Denver')) {
            if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {
                // log(placeId, "is anything getting through?")
                // ChIJZTYRctV-bIcRb74MCUMHUzQ
                // ChIJ-3hMUcJ4bIcRuaidfDaWTnY
                $('#panelTwo .warning').html(warning)
                $('#copyright2').html(copyright)


                let row2 = $('<tr>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime, "Leg")
                timeSummary.addClass('summary')
                row2.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row2.append(distanceSummary)
                $('#panelTwo tbody').append(row2)


                //  loop through steps
                for (var i = 1; i < steps.length; i++) {
                    let instruction = steps[i].instructions

                    let stepTime = steps[i].duration.text

                    // this is writing over global varaiable
                    let stepDistance = steps[i].distance.text

                    let row = $('<tr>')
                    let colInstruction = $('<td>')
                    colInstruction.html(instruction)
                    row.append(colInstruction)


                    let colDistance = $('<td>')
                    colDistance.text(stepDistance)
                    row.append(colDistance)
                    $('#panelTwo tbody').append(row)
                    // append each instruction to the table

                }
            } else if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
                $('#panelThree .warning').text(warning)
                $('#copyright3').text(copyright)

                let row3 = $('<td>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')
                row3.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row3.append(distanceSummary)
                $('#panelThree tbody').append(row3)

                for (var i = 0; i < steps.length; i++) {
                    let instruction = steps[i].instructions

                    let stepTime = steps[i].duration.text

                    // this is writing over global varaiable
                    let stepDistance = steps[i].distance.text

                    let row = $('<tr>')
                    let colInstruction = $('<td>')
                    colInstruction.html(instruction)
                    row.append(colInstruction)


                    let colDistance = $('<td>')
                    colDistance.text(stepDistance)
                    row.append(colDistance)
                    $('#panelThree tbody').append(row)
                    // append each instruction to the table


                    // append each instruction to the table

                }
            } else {
                $('#panelOne .warning').text(warning)
                $('#copyright1').text(copyright)

                let row1 = $('<tr>')
                let timeSummary = $('<td>')
                row1.append(timeSummary)
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row1.append(distanceSummary)
                $('#panelOne tbody').append(row1)

                for (var i = 0; i < steps.length; i++) {
                    let instruction = steps[i].instructions

                    let stepTime = steps[i].duration.text

                    // this is writing over global varaiable
                    let stepDistance = steps[i].distance.text

                    let row = $('<tr>')
                    let colInstruction = $('<td>')
                    colInstruction.html(instruction)
                    row.append(colInstruction)


                    let colDistance = $('<td>')
                    colDistance.text(stepDistance)
                    row.append(colDistance)
                    $('#panelOne tbody').append(row)
                    // append each instruction to the table


                }
            }
        } // end of else if

    } // end of render directions function

    function calculateAndDisplayRoute(origin, destination, directionService, directionDisplay, map) {
        directionService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.BICYCLING,
            provideRouteAlternatives: false
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                renderDirections(response, map);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function calculateAndDisplayBusRoute(origin, destination, directionService, directionDisplay, map) {
        directionService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.TRANSIT,
            provideRouteAlternatives: false
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                renderDirections(response, map);
                // let busDisplay = directionsDisplay.setDirections(response)
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }


    function initMap() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay2 = new google.maps.DirectionsRenderer()
        map = new google.maps.Map(
            document.getElementById("map"), {
                center: new google.maps.LatLng(40.016779, -105.276376),
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        directionsDisplay.setMap(map);
        new AutocompleteDirectionsHandler(map);

        // call first route


    }

    //   SET bounds


    initMap()

    $('#submit').click(function(e) {
        e.target = this
        if ($('#origin-input').val() === "" || $('#destination-input').val() === "") {
            Materialize.toast('directions?', 4000, 'toast-class')
        } else {

            // KEEPING TOTALS HIDDEN FOR THURSDAY
            // $('#totals').removeClass('hide')
            $('#directions-tables').removeClass('hide')

            $('tbody').empty()

            if ($('#origin-input').val().includes('Boulder') && $('#destination-input').val().includes('Denver')) {
                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

                calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

                calculateAndDisplayRoute(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)


            } else if ($('#origin-input').val().includes('Denver') && $('#destination-input').val().includes('Boulder')) {

                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

                calculateAndDisplayBusRoute(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

                calculateAndDisplayRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
            } else if ($('#origin-input').val().includes('Boulder') && $('#destination-input').val().includes('Boulder')) {
                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
            } else if ($('#origin-input').val().includes('Denver') && $('#destination-input').val().includes('Denver')) {
                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
            }

        }
    }) // end of click

    // call ajax for Boulder (id "boulder-weather")
    $.ajax({
        method: 'GET',
        // url: 'http://api.openweathermap.org/data/2.5/forecast?lat=40.017512&lon=-105.28561100000002&units=imperial&APPID=db2edac29cd5933073366cfb65c34f05',
        url: 'boulder-weather-data.js',
        dataType: 'json',
        success: function(data) {
            console.log("success!", data);

            localStorage.setItem(`boulder-2017-${date}-03`, JSON.stringify(data))

            var aValue = JSON.parse(localStorage.getItem(`boulder-2017-${date}-03`));
            console.log('meh', aValue);

            //  okay, so now that local storage is being set...
            //  now I need to move these tables outside the ajax call because otherwise they will only work once...

            let list = data.list
            console.log(list, "list");
            let boulderTable = $('#boulder-weather tbody')


            for (var i = hours; i < list.length; i += 3) {
                let snow = list[i].snow
                let temperature = Math.round(list[i].main.temp) + 'º'
                // console.log('boulder Temp', temperature);
                let description = list[i].weather[0].description
                let windDegree = degreeArray[Math.round(((list[i].wind.deg % 360) / 45))]

                let windSpeed = Math.round(list[i].wind.speed) + "mph"

                let row2 = $('<tr>')
                let column4 = $('<td>')
                let column1 = $('<td>')
                let column2 = $('<td>')
                let column3 = $('<td>')

                if (i < 24) {
                    column4.text(`${i}:00`)
                } else {
                    let convertTime = i - 24
                    column4.text(`${convertTime}:00`)
                }

                column1.text(temperature)
                column2.text(`${windSpeed} ${windDegree}`)
                row2.append(column4)
                row2.append(column1)
                row2.append(column2)
                boulderTable.append(row2)

            }



        },
        error: function() {
            console.log('error');
        }
    })
    //
    // call ajax for Denver (id "denver-weather")
    $.ajax({
        method: 'GET',
        // url: `http://api.openweathermap.org/data/2.5/forecast?lat=39.7366466&lon=-104.98454900000002&units=imperial&APPID=db2edac29cd5933073366cfb65c34f05`,
        url: 'denver-weather-data.js',
        dataType: 'json',
        success: function(data) {
            // console.log("success!", data.list);

            let list = data.list
            let denverTable = $('#denver-weather tbody')

            //  SO HERE...HOW COULD I MAKE THIS A FUNCTION WHEN IT NEEDS TO APPEND TO TWO DIFFERENT TABLE PARENTS?
            for (var i = hours; i < list.length; i += 3) {
                let snow = list[i].snow
                let temperature = Math.round(list[i].main.temp) + 'º'
                let description = list[i].weather[0].description
                let windDegree = degreeArray[Math.round(((list[i].wind.deg % 360) / 45))]

                let windSpeed = Math.round(list[i].wind.speed) + "mph"

                let row2 = $('<tr>')
                let column4 = $('<td>')
                let column1 = $('<td>')
                let column2 = $('<td>')
                let column3 = $('<td>')

                if (i < 24) {
                    column4.text(`${i}:00`)
                } else {
                    let convertTime = i - 24
                    column4.text(`${convertTime}:00`)
                }

                column1.text(temperature)
                column2.text(`${windSpeed} ${windDegree}`)
                row2.append(column4)
                row2.append(column1)
                row2.append(column2)
                denverTable.append(row2)

            }



        },
        error: function() {
            console.log('error');
        }
    })


})


// WIND DEGREE FUNCTION AND DATA
let degreeArray = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]

// need to divide degree % 360
// divide and round degree by 22.5 to correspond to the 16 values in the array
// ((windDegree % 360)/ 22.5) will give array index corresponding to

// Get the ball rolling and trigger our init() on 'load'
//  google.maps.event.addDomListener(window, 'load', init);
