(function() {
  $(document).ready(function() {

    let map
    let directionsDisplay
    let directionsService = new google.maps.DirectionsService();
    let originAutocomplete
    let originLatitude
    let originLongitude
    let destinationLatitude
    let destinationLongitude
    let address1
    let address2
    let currentTime = new Date();
    let time = currentTime.getTime();
    let hours = currentTime.getHours();
    let date = currentTime.getDate()
    let year = currentTime.getFullYear()
    let month = currentTime.getMonth()
    let allTheTime = 0
    let allTheBikeMiles = 0
    let allTheDistance = 0
    let degreeArray = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]

    function renderDenverWeather(localData) {
      let list = localData.list
      let denverTable = $('#denver-weather tbody')

      for (let i = hours; i < list.length; i += 3) {
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

    function smoothTop(e) {
      // let target = e.target.hash
      $('html, body').animate({
        scrollTop: $('#totals').offset().top
      }, 500);
    }




    // select box initialize
    $('select').material_select()
    // initialize side-nav
    $(".button-collapse").sideNav()

    function GetLatlongOrigin() {
      let geocoder = new google.maps.Geocoder();
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
      let geocoder = new google.maps.Geocoder();
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
      let originInput = document.getElementById('origin-input');
      let destinationInput = document.getElementById('destination-input');

      originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {
          placeIdOnly: false
        });
      let destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {
          placeIdOnly: false
        });

      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    }


    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
      let me = this;
      autocomplete.bindTo('bounds', this.map);
      autocomplete.addListener('place_changed', function() {
        let place = autocomplete.getPlace();
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

      let directionsRenderer3 = new google.maps.DirectionsRenderer({
        directions: result,
        routeIndex: 2,
        suppressMarkers: false,
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

      let placeId = directionsRenderer3.directions.geocoded_waypoints[0].place_id

      function buildDirections(panel, copyrightInfo) {
        $(`${panel} .warning`).html(warning)
        $(`${copyrightInfo}`).html(copyright)
        let row2 = $('<tr>')
        let timeSummary = $('<td>')
        timeSummary.text(totalLegTime)
        timeSummary.addClass('summary')
        row2.append(timeSummary)
        row2.addClass('summary')
        let distanceSummary = $('<td>')
        distanceSummary.text(totalLegDistance)
        distanceSummary.addClass('distance')
        row2.append(distanceSummary)
        $(`${panel} tbody`).append(row2)

        for (let i = 1; i < steps.length; i++) {
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

      if ($('#origin-input').val().includes('Boulder')) {
        if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
          buildDirections('#panelTwo', '#copyright2')
          allTheTime += parseInt(totalLegTime.match(/\d+/g));

          if (allTheTime > 59) {
            let hour = 1
            let minutes = allTheTime - 60

            allTheTime = `${hour}hr ${minutes}`
          }

          let parsedDistance = parseFloat(totalLegDistance.match(/\d+\.?\d+/g))

          allTheDistance += parsedDistance
          $('#totalTime').text(`${allTheTime} min`)
          $('#totalDistance').text(`${allTheDistance.toFixed(1)} mi`)
        }
        else if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {
          buildDirections('#panelThree', '#copyright3')

          allTheTime += parseInt(totalLegTime.match(/\d+/g));
          if (allTheTime > 59) {
            let hour = 1
            let minutes = allTheTime - 60

            allTheTime = `${hour}hr ${minutes}`
          }

          let parsedDistance = parseFloat(totalLegDistance.match(/\d+\.?\d+/g))

          allTheDistance += parsedDistance
          allTheBikeMiles += parsedDistance
          $('#totalTime').text(`${allTheTime} min`)
          $('#totalBikeDistance').text(`${allTheBikeMiles.toFixed(1)} mi`)
          $('#totalDistance').text(`${allTheDistance.toFixed(1)} mi`)
        }
        else {
          buildDirections('#panelOne', '#copyright1')
          allTheTime += parseInt(totalLegTime.match(/\d+/g));

          if (allTheTime > 59) {
            let hour = 1
            let minutes = allTheTime - 60

            allTheTime = `${hour}hr ${minutes}`
          }

          let parsedDistance = parseFloat(totalLegDistance.match(/\d+\.?\d+/g))

          allTheDistance += parsedDistance
          allTheBikeMiles += parsedDistance

          $('#totalTime').text(`${allTheTime} min`)
          $('#totalBikeDistance').text(`${allTheBikeMiles.toFixed(1)} mi`)
          $('#totalDistance').text(`${allTheDistance.toFixed(1)} mi`)
        }
      }
      else if ($('#origin-input').val().includes('Denver')) {
        if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI" || placeId === 'ChIJ-3hMUcJ4bIcRuaidfDaWTnY') {
          buildDirections('#panelTwo', '#copyright2')
          allTheTime += parseInt(totalLegTime.match(/\d+/g));

          if (allTheTime > 59) {
            let hour = 1
            let minutes = allTheTime - 60

            allTheTime = `${hour}hr ${minutes}`
          }

          let parsedDistance = parseFloat(totalLegDistance.match(/\d+\.?\d+/g))

          allTheDistance += parsedDistance
          $('#totalTime').text(`${allTheTime} min`)
          $('#totalDistance').text(`${allTheDistance.toFixed(1)} mi`)
        }
        else if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
          buildDirections('#panelThree', '#copyright3')
          allTheTime += parseInt(totalLegTime.match(/\d+/g));

          if (allTheTime > 59) {
            let hour = 1
            let minutes = allTheTime - 60

            allTheTime = `${hour}hr ${minutes}`
          }

          let parsedDistance = parseFloat(totalLegDistance.match(/\d+\.?\d+/g))

          allTheBikeMiles += parsedDistance
          allTheDistance += parsedDistance
          $('#totalTime').text(`${allTheTime} min`)
          $('#totalBikeDistance').text(`${allTheBikeMiles.toFixed(1)} mi`)
          $('#totalDistance').text(`${allTheDistance.toFixed(1)} mi`)
        }
        else {
          buildDirections('#panelOne', '#copyright1')
          allTheTime += parseInt(totalLegTime.match(/\d+/g));
          console.log(placeId, "placeId");

          if (allTheTime > 59) {
            let hour = 1
            let minutes = allTheTime - 60

            allTheTime = `${hour}hr ${minutes}`
          }

          let parsedDistance = parseFloat(totalLegDistance.match(/\d+\.?\d+/g))

          allTheDistance += parsedDistance
          allTheBikeMiles += parsedDistance
          $('#totalTime').text(`${allTheTime} min`)
          $('#totalBikeDistance').text(`${allTheBikeMiles.toFixed(1)} mi`)
          $('#totalDistance').text(`${allTheDistance.toFixed(1)} mi`)
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
        }
        else {

          // window.alert('Directions request failed due to ' + status);
        }
      })
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
        }
        else {
          window.alert('Directions request failed due to ' + status);
        }
      })
    }

    function initMap() {
      directionsDisplay = new google.maps.DirectionsRenderer()
      directionsDisplay2 = new google.maps.DirectionsRenderer()
      map = new google.maps.Map(
        document.getElementById("map"), {
          center: new google.maps.LatLng(40.016779, -105.276376),
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        })
      directionsDisplay.setMap(map)
      new AutocompleteDirectionsHandler(map)
    }

    initMap()

    $('#submit').click(function(e) {
      e.target = this
      if ($('#origin-input').val() === "" || $('#destination-input').val() === "") {
        Materialize.toast('directions?', 4000, 'toast-class')
      }
      else {
        allTheTime = 0
        allTheBikeMiles = 0
        allTheDistance = 0

        $('#totals').removeClass('hide')
        $('#directions-tables').removeClass('hide')
        smoothTop()

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

          $('#totalTime').text(`${allTheTime} min`)
          $('#totalBikeDistance').text(`${allTheBikeMiles} mi`)
          $('#totalDistance').text(`${allTheDistance} mi`)
        }
        else if ($('#origin-input').val().includes('Boulder') && $('#destination-input').val().includes('Boulder')) {
          calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)

        } else if ($('#origin-input').val().includes('Denver') && $('#destination-input').val().includes('Denver')) {
          calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
        }
      }
    })

    // only do ajax call for boulder weather if local storage isn't set.
    if (localStorage.getItem(`boulder-${year}-${date}-${month}`) === null) {
      $.ajax({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast?lat=40.017512&lon=-105.28561100000002&units=imperial&APPID=b5c3edfb746645ea06c71005fb4e86db',
        dataType: 'json',
        success: function(data) {
          localStorage.setItem(`boulder-${year}-${date}-${month}`, JSON.stringify(data))
          let aValue = JSON.parse(localStorage.getItem(`boulder-${year}-${date}-${month}`));

          renderBoulderWeather(aValue)
        },
        error: function() {
          $.ajax({
            method: 'GET',
            url: 'boulder-weather-data.js',
            dataType: 'json',
            success: function(data) {
              localStorage.setItem(`boulder-${year}-${date}-${month}`, JSON.stringify(data))
              let oldWeather = JSON.parse(localStorage.getItem(`boulder-${year}-${date}-${month}`));

              renderBoulderWeather(oldWeather)
            },
            error: function() {
              console.log('error');
            }
          })
        }
      })
    }
    else {
      let boulderData = JSON.parse(localStorage.getItem(`boulder-${year}-${date}-${month}`))

      renderBoulderWeather(boulderData)
    }

    //  denver weather
    if (localStorage.getItem(`denver-${year}-${date}-${month}`) === null) {
      $.ajax({
        method: 'GET',
        url: `http://api.openweathermap.org/data/2.5/forecast?lat=39.7366466&lon=-104.98454900000002&units=imperial&APPID=b5c3edfb746645ea06c71005fb4e86db`,
        dataType: 'json',
        success: function(data) {
          localStorage.setItem(`denver-${year}-${date}-${month}`, JSON.stringify(data))
          let bValue = JSON.parse(localStorage.getItem(`denver-${year}-${date}-${month}`))

          renderDenverWeather(bValue)
        },
        error: function() {
          $.ajax({
            method: 'GET',
            url: 'denver-weather-data.js',
            dataType: 'json',
            success: function(data) {
              localStorage.setItem(`denver-${year}-${date}-${month}`, JSON.stringify(data))
              let oldDenverWeather = JSON.parse(localStorage.getItem(`denver-${year}-${date}-${month}`))

              renderDenverWeather(oldDenverWeather)
            },
            error: function() {
              console.log('error');
            }
          })
        }
      })
    }
    else {
      let denverData = JSON.parse(localStorage.getItem(`denver-${year}-${date}-${month}`))

      renderDenverWeather(denverData)
    }
  })
})()
