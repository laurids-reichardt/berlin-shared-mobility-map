### Customer Trips

Based on the dataset of availability timeframes for each bicycle I can approximately deduce at what point in time and from where to where any bicycle was rented by a customer for a trip.

If a bicycle disappears for a set amount of time and reappears at a different location and the time span roughly matches the average time it takes to cover the distance from one location to the other, I assume that a real trip by a customer occurred.

If on the other hand the time span of disappearance is too short or too long, I assume the bicycle didn't complete a valid trip but instead was deactivated for maintenance or due to a glitch.

### Typical Workday

The currently visible map layer visualizes the identified customer trips on Wednesday, July 14, 2021, a typical Berlin work day with 2985 recorded trips. The following chart shows the distribution of trips over the day. Two peaks during the morning and evening commute times are noticeable, with the latter being particularly pronounced.

<Charts name='JULY_14_TRIPS' />

Each arc on the map represents one trip with the orange and cyan end of the arc marking the start and destination location respectively. A notable observation is the flow in and out of the city center during the morning and evening commutes.

Stop the time slider at 07:00 UTC (08:00 Berlin local time) and you'll notice many trips starting from outskirts of Berlin and ending inside the city center where many office buildings are located. The opposite trend can be observed at 16:00 UTC (17:00 Berlin local time).
