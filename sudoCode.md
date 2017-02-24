## How to Approach Bike Easy?
  --my first thought is that I will have to make this app do what I have to do when I need to combine bus and bike directions...which is query google maps for each instance of bussing, and biking.
  --sounds easy enough....
## Now to get technical...
  what's the best way to convert one user search into multiple queries that will then be optomized against user preferenes to display the best route...
  ....
  ideas:
  -one: query every possible option and then sort first for speed since that's the default.
    --this will then do one google maps search that will compare bus to bike to walking and return the fastest.
    --the problem with this is that it is no different than google maps.
  --two. query route for bus rides. make an object that will hold each.
## okay so...don't want to just be google maps all over again so:
  --first search based off of distance.
    userBusPoint = the point at which the user would rather bus given distance

    if (distanceToTravel < userBusPoint && weather is good)
      {=> bike directions and happy nice weather biking message}

    else if (distance to travel > user bus point) {

      if (busTime < bikeTime && noTransfers) {
        save busTime in an object
        return busTime
      } else if (!noTransfers) {
        query maps again, once for busTime and once for bikeTime
        from the drop off of the first bus to either the next destination or the next transfer.
        store those times in an object.
        compare secondBusTime to bikeTime
        repeat for each transfer--->MVP one transfer.
        => return fastest
      }
    }

    side ideas: when bike path is annoying: query for driving directions and then factor in the extra biking time to it. Then compare 'driving time' to 'bike path time' and return the fastest.
