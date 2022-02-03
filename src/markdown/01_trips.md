<Profile />

### Introduction

This web application visualizes interesting patterns and trends of the shared mobility traffic in Berlin, Germany. It represents a small excerpt of my exploratory work on shared mobility during my studies at [HTW Berlin](https://www.htw-berlin.de/en/). The project is work in progress and will receive continues updates. The source code is available on [GitHub](https://github.com/laurids-reichardt/berlin-shared-mobility-map).

Discover different map layers by navigating via the buttons on the bottom of this information card. Additional information will show up inside this card. On the bottom of the application you’ll find a timeline player bar that allows you to start, stop and scroll through the map layer animation. You can rotate the viewport by holding cmd or ctrl respectively and dragging the mouse on the map. Scrolling and panning is supported via mouse input as well.

### Data Source

The underlying data for this application is sourced by a custom web crawler which continuously requests and saves all available for rent bicycles of a large shared mobility provider in Berlin. I won't publicly disclose the name of the provider since I'm unsure of the copyright/legal implications. The crawler runs once a minute and all data is stored inside a PostgreSQL database. Routing data is calculated via a [OSRM](http://project-osrm.org/) backend and some Python glue code. All of this is self-hosted and maintained on a personal dedicated server.

### May Day Trips

The currently visible map layer displays an accelerated animation of the 2119 bicycle trips collected in the 24h period starting at 06:00 UTC on May 1, 2021. As you might know, May Day is a public holiday in Germany and celebrated by many by taking to the streets and parks or fleeing into the surrounding green.

If you stop the animation, position the viewport above the city, and slowly scroll the time forward you might catch how many trips in the morning hours seem to end at the lakes around Berlin and ride back into the city in the evening hours. Other trips originate from the densely populated residential areas and end at the many large parks of Berlin.

Press NEXT to discover more about shared mobility in Berlin.