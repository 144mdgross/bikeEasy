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
    // console.log(currentTime, "currentTime");
    let time = currentTime.getTime();
    let hours = currentTime.getHours();
    let date = currentTime.getDate()
    let year = currentTime.getFullYear()
    let month = currentTime.getMonth()
    // console.log(date, "date");

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

        let stepDistance = directionsRenderer3.directions.routes[0].legs[0].steps.distance

        let stepDuration = directionsRenderer3.directions.routes[0].legs[0].steps.duration

        let copyright = directionsRenderer3.directions.routes[0].copyrights

        let totalLegTime = directionsRenderer3.directions.routes[0].legs[0].duration.text

        let totalLegDistance = directionsRenderer3.directions.routes[0].legs[0].distance.text

        function buildDirections(panel, copyrightInfo) {
            $(`${panel} .warning`).html(warning)
            $(`${copyrightInfo}`).html(copyright)
            //  add leg time to total time

            let row2 = $('<tr>')
            let timeSummary = $('<td>')
            timeSummary.text(totalLegTime)
            row2.append(timeSummary)
            row2.addClass('summary')


            let distanceSummary = $('<td>')
            distanceSummary.text(totalLegDistance)
            distanceSummary.addClass('distance')
            row2.append(distanceSummary)
            $(`${panel} tbody`).append(row2)

            //  loop through steps
            for (var i = 1; i < steps.length; i++) {
                let instruction = steps[i].instructions

                let stepTime = steps[i].duration.text

                let instructionDistance = steps[i].distance.text

                let row = $('<tr>')
                let colInstruction = $('<td>')
                colInstruction.html(instruction)
                row.append(colInstruction)

                let colDistance = $('<td>')
                colDistance.text(instructionDistance)
                row.append(colDistance)
                $(`${panel} tbody`).append(row)
            }
        }

        let placeId = directionsRenderer3.directions.geocoded_waypoints[0].place_id



        if ($('#origin-input').val().includes('Boulder')) {
            if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {

                buildDirections('#panelTwo', '#copyright2')

                allTheTime += parseInt(totalLegTime.match(/\d+/g));
                console.log('all the time step one?', allTheTime);

            } else if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {
                //  make this a different function
                allTheTime += parseInt(totalLegTime.match(/\d+/g));
                console.log('all the time step two?', allTheTime);

                buildDirections('#panelThree', '#copyright3')

            } else {

                buildDirections('#panelOne', '#copyright1')

                allTheTime += parseInt(totalLegTime.match(/\d+/g));
                console.log(allTheTime, "alltheTime should be totaled?");

                // console.log(parseFloat(totalLegDistance.match(/\d/g)), "parsing distance working?")

            }

        } else if ($('#origin-input').val().includes('Denver')) {
            if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {

                buildDirections('#panelTwo', '#copyright2')

            } else if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {

                buildDirections('#panelThree', '#copyright3')

            } else {
                buildDirections('#panelOne', '#copyright1')
            }
        }
    }

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

    //  work with local storage here?




    $('#submit').click(function(e) {
        e.target = this
        if ($('#origin-input').val() === "" || $('#destination-input').val() === "") {
            Materialize.toast('directions?', 4000, 'toast-class')
        } else {


            // KEEPING TOTALS HIDDEN FOR THURSDAY
            // $('#totals').removeClass('hide')
            $('#directions-tables').removeClass('hide')
            $('#totalTime').text(`${allTheTime} min`)


            $('#panelOne tbody').empty()
            $('#panelTwo tbody').empty()
            $('#panelThree tbody').empty()




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

    // only do ajax call if local storage isn't set.
    if (localStorage.getItem(`boulder-${year}-${date}-${month}`) === null) {
        $.ajax({
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/forecast?lat=40.017512&lon=-105.28561100000002&units=imperial&APPID=db2edac29cd5933073366cfb65c34f05',
            // url: 'boulder-weather-data.js',
            dataType: 'json',
            success: function(data) {
                // console.log("success!", data);

                localStorage.setItem(`boulder-${year}-${date}-${month}`, JSON.stringify(data))

                var aValue = JSON.parse(localStorage.getItem(`boulder-${year}-${date}-${month}`));

                renderBoulderWeather(aValue)
                // console.log('meh', aValue);

                //  okay, so now that local storage is being set...
                //  now I need to move these tables outside the ajax call because otherwise they will only work once...

                // let list = data.list
                // // console.log(list, "list");
                // let boulderTable = $('#boulder-weather tbody')
                //
                //
                // for (var i = hours; i < list.length; i += 3) {
                //     let snow = list[i].snow
                //     let temperature = Math.round(list[i].main.temp) + 'º'
                //     // console.log('boulder Temp', temperature);
                //     let description = list[i].weather[0].description
                //     let windDegree = degreeArray[Math.round(((list[i].wind.deg % 360) / 45))]
                //
                //     let windSpeed = Math.round(list[i].wind.speed) + "mph"
                //
                //     let row2 = $('<tr>')
                //     let column4 = $('<td>')
                //     let column1 = $('<td>')
                //     let column2 = $('<td>')
                //     let column3 = $('<td>')
                //
                //     if (i < 24) {
                //         column4.text(`${i}:00`)
                //     } else {
                //         let convertTime = i - 24
                //         column4.text(`${convertTime}:00`)
                //     }
                //
                //     column1.text(temperature)
                //     column2.text(`${windSpeed} ${windDegree}`)
                //     row2.append(column4)
                //     row2.append(column1)
                //     row2.append(column2)
                //     boulderTable.append(row2)
                //
                // }
                //
                //

            },
            error: function() {
                // console.log('error');
            }
        })
    } // end of ajax if for boulder
    else {
        let boulderData = JSON.parse(localStorage.getItem(`boulder-${year}-${date}-${month}`))

        renderBoulderWeather(boulderData)
    }
    //
    // call ajax for Denver (id "denver-weather")
    if (localStorage.getItem(`denver-${year}-${date}-${month}`) === null) {
        $.ajax({
            method: 'GET',
            url: `http://api.openweathermap.org/data/2.5/forecast?lat=39.7366466&lon=-104.98454900000002&units=imperial&APPID=db2edac29cd5933073366cfb65c34f05`,
            // url: 'denver-weather-data.js',
            dataType: 'json',
            success: function(data) {
                // console.log("success!", data.list);

                localStorage.setItem(`denver-${year}-${date}-${month}`, JSON.stringify(data))

                var bValue = JSON.parse(localStorage.getItem(`denver-${year}-${date}-${month}`))

                renderDenverWeather(bValue)



            },
            error: function() {
                // console.log('error');
            }
        })
    } else {
        let denverData = JSON.parse(localStorage.getItem(`denver-${year}-${date}-${month}`))

        renderDenverWeather(denverData)
    }
    // refactor to not have hoisting?
    function renderDenverWeather(localData) {
        let list = localData.list
        let denverTable = $('#denver-weather tbody')

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

    }

    function renderBoulderWeather(localData) {
        let list = localData.list
        let boulderTable = $('#boulder-weather tbody')

        for (let i = hours; i < list.length; i += 3) {
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




    } // end of boulder Weather function

    console.log(allTheTime, "All The Time totaled after route input?? pleeease?");

})





// WIND DEGREE FUNCTION AND DATA
let degreeArray = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]

// need to divide degree % 360
// divide and round degree by 22.5 to correspond to the 16 values in the array
// ((windDegree % 360)/ 22.5) will give array index corresponding to

// Get the ball rolling and trigger our init() on 'load'
//  google.maps.event.addDomListener(window, 'load', init);
