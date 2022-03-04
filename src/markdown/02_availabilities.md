### Dataset

The dataset for all statistics and visualizations of this application spans a twelve-month period from November 1, 2020 till November 1, 2021 and contains over 2.1 billion data points. Each individual data point contains the timestamp, position, unique identifier, and additional properties (e.g., battery level, gearbox type) of an at that point in time available for rent bicycle.

Subsequently, I group the individual data rows by the unique vehicle identifier to individual availability time frames. For example: Bicycle fN6xl7yj is detected as available once a minute at location A between 15:00 UTC and 15:32 UTC. Thereafter, bicycle fN6xl7yj disappears from the dataset only to get detected again 23 minutes later at a different location B. The described scenario would lead _simplified_ to the following two availability entries for bicycle fN6xl7yj:

| unique_id | time_period    | location |
| --------- | -------------- | -------- |
| fN6xl7yj  | [15:00, 15:32] | A        |
| fN6xl7yj  | [15:55, null]  | B        |

<br>

This transformation greatly eases the handling and compresses the large dataset to just over 6 million individual availability entries. Querying the distribution of features is greatly simplified. For example the subsequent chart visualizes the number of distinct bicycles available during each of the 52 weeks of the specified time period.

<Charts name='DISTINCT_VEHICLE_DISTRIBUTION' />

It appears that the number of bicycles on the road stayed relatively stable at round 4000 with a small drop to around 3600 during the later half of 2021.

### Bicycle Availability

The currently visible scatter plot map visualizes all bicycle availability entries for the May Day time frame of the previous map layer. A first surprise to me was how well the approximately 4000 bicycles are distributed around the city. Clusters of available bikes exist around busy public transport hubs and entries of public parks but by and large the bikes are well spread around the service area.

You might notice individual bicycles not only appearing and disappearing on the map, some bicycles seem to jump around randomly as well. This phenomenon is explained by the not so accurate GPS trackers of the bicycles. Even if the bikes aren't moved at, the shared mobility provider might report them at a marginally different location. The following analyses filter and disregard these glitches.
