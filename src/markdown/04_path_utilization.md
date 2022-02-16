### Routes

To approximate how long a bicycle ride from location A to location B should take I use a self-hosted [OSRM](http://project-osrm.org/) instance to calculate a possible bicycle route. Since I only know the start and destination location of any identified customer trip it's of course impossible to say whether the customer truly took the calculated route or a different route. However, by comparing the calculated route duration to the recorded trip duration, I can deduce with good confidence whether the calculated route must at least be close to the true trip route.

The currently visible map combines all 713,562 calculated customer trip routes into a single layer. The brighter a street section appears, the more routes went through that section at the specified time (independent of the date). As a result the animation visualizes how the city wakes up and appears to bloom over each 24h period. Just as the available bicycles seem to spread well over the city, so do customer trips seem to run through most streets of Berlin.

For an interesting observation stop the time slider at 00:00 UTC. While most streets seem to get less busy during the evening hours, a handful of streets in the eastern district Friedrichshain-Kreuzberg still see a lot of bicycle traffic. This might be explained by the high bar and club density in those areas.

Further visualizations and analysis will follow soon.
