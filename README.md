
## bike easy

 [view it live](http://bike-easy.surge.sh/)
 
## What problem does it solve?

* It gives people who want to commute from boulder/denver or denver/boulder bus and bike directions (and the weather) all in one spot.

## Who has this problem?
	`Cyclists commuting via bus. So me, my friends and many other people in the boulder/denver metro area.`
	
## How my project solves this problem:
	```It gives users access to all three legs of their trip (bike to the bus station, bus between cities, and bike to destination) in once place. It also provides weather information so people can understand what conditions they will be biking in.```
	
## APIs:
	- Google Maps Javascript API
	- Google Maps Directions API
	- Google Places API
	- Google Maps Geocoding API
	- Open Weather API
	
## Technologies used.

	Languages: `html, CSS, JavaScript`
	
	Frameworks: `Materialize and jQuery`

## What was the biggest challenge you had to overcome?

	Making google directions service render three different sets of directions on one map and list those directions all on one page was definitely the hardest. Google designed the service to only display one route at a time unless you’re using waypoints. However, waypoints are not allowed in any form if public transit is a mode of travel. Finding a way around that was very challenging.
