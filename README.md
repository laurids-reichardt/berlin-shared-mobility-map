<br />
<div align="center">
  <img src="favicon.svg" alt="Logo" width="80" height="80" />
  <h1 align="center">Berlin Shared Mobility Map</h1>
  <h4>An Interactive 3D Visualization of the Shared Mobility Traffic in Berlin, Germany.</h4>
  <h4><a href="https://www.lau-rei.de/proj/berlin-shared-mobility-map/">Live Version</a></h4>
</div>

## About

This web application visualizes interesting patterns and trends of the shared mobility traffic in Berlin, Germany. It represents a small excerpt of my exploratory work on shared mobility during my studies at [HTW Berlin](https://www.htw-berlin.de/en/). The project is work in progress and will receive continues updates. A live version of the web application is linked in the header above.

Discover different map layers by navigating via the buttons on the bottom of the information card. Additional information will show up inside the card. On the bottom of the application you’ll find a timeline player bar that allows you to start, stop and scroll through the map layer animation. You can rotate the viewport by holding cmd or ctrl respectively and dragging the mouse on the map. Scrolling and panning is supported via mouse input as well.

## Data Source

The underlying data for the application is sourced by a custom web crawler which continuously requests and saves all available for rent bicycles of a large shared mobility provider in Berlin. I won't publicly disclose the name of the provider since I'm unsure of the copyright/legal implications. The crawler sends requests once a minute and stores all data inside a [PostgreSQL](https://www.postgresql.org/) database. All routing data is calculated via a [OSRM](http://project-osrm.org/) backend and some Python glue code. All of this is self-hosted and maintained on a personal dedicated server.

## Demo

https://user-images.githubusercontent.com/25111686/153723949-c414e8ef-40d2-4f0d-ab50-5ac78efb0f33.mp4

## Development

The web application was bootstrapped with [Vite](https://vitejs.dev/). Follow the subsequent steps to set up a local development environment.

1. Clone this repository:
   ```sh
   git clone https://github.com/laurids-reichardt/berlin-shared-mobility-map.git
   ```
2. Install NPM packages:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Built With

This section lists major frameworks/libraries used by this project. A comprehensive list of dependencies is stored inside the `package-lock.json` file.

- [React.js](https://reactjs.org/)
- [deck.gl](https://deck.gl/)
- [MUI](https://mui.com/)
- [MapLibre](https://maplibre.org/)

## Contact

Twitter: [https://twitter.com/laureichardt](https://twitter.com/laureichardt)

GitHub: [https://github.com/laurids-reichardt](https://github.com/laurids-reichardt)

LinkedIn: [https://www.linkedin.com/in/laurids-reichardt](https://www.linkedin.com/in/laurids-reichardt)
