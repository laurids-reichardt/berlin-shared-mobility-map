<Profile />

**_Disclaimer:_** I'm currently completing my master’s degree at HTW Berlin and would like to collaborate with an innovative company on an exciting problem or business case for my master thesis. If you could imagine providing an exciting opportunity in the fields of data engineering or data analytics I'd love to get in touch with you via any of the contacts linked above.

### Introduction

This web application visualizes interesting patterns and trends of the shared mobility traffic in Berlin, Germany. It represents a small excerpt of my exploratory work on shared mobility during my studies at [HTW Berlin](https://www.htw-berlin.de/en/). The project is work in progress and will receive continues updates. The source code and a short demo video is available on [GitHub](https://github.com/laurids-reichardt/berlin-shared-mobility-map).

Discover different map layers by navigating via the buttons on the bottom of the information card. Additional information will show up inside the card. On the bottom of the application you’ll find a timeline player bar that allows you to start, stop and scroll through the map layer animation.

You can rotate the viewport by holding cmd or ctrl respectively and dragging the mouse on the map. Scrolling and panning is supported via mouse input as well.

### Data Source

The underlying data for the application is sourced by a custom web crawler which continuously requests and saves all available for rent bicycles of a large shared mobility provider in Berlin. I won't publicly disclose the name of the provider since I'm unsure of the copyright/legal implications.

The crawler sends requests once a minute and stores all data inside a [PostgreSQL](https://www.postgresql.org/) database. All routing data is calculated via a [OSRM](http://project-osrm.org/) backend and some Python glue code. All of this is self-hosted and maintained on a personal bare-metal server.

### May Day Trips

The currently visible map layer displays an accelerated animation of the 2119 bicycle trips collected in the 24h period starting at 06:00 UTC on May 1, 2021. As you might know, May Day is a public holiday in Germany and celebrated by many by taking to the streets and parks or fleeing into the surrounding green. The chart below visualizes how the distribution of trips over the 24h period centers around early afternoon.

<Charts name='MAYDAY_TRIPS' />

If you stop the animation, position the viewport above the city, and slowly scroll the time forward you might catch how many trips in the morning hours seem to end at the lakes around Berlin and ride back into the city in the evening hours. Other trips originate from the densely populated residential areas and end at the many large parks of Berlin.

Press **NEXT** to discover more about shared mobility in Berlin.
