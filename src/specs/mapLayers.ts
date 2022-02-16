import { FlyToInterpolator, LinearInterpolator } from 'deck.gl'
import { ScatterplotLayer, ArcLayer, PathLayer } from '@deck.gl/layers'
import { TripsLayer } from '@deck.gl/geo-layers'
import { Layer } from 'react-map-gl'
import { sourceData, SourceDataKey } from './sourceData'
import { TripsLayerMarkdown, AvailabilitiesMarkdown, TripArcsMarkdown, PathUtilizationMarkdown } from '../markdown'
import { IS_LARGE_SCREEN_DEVICE, TRIP_SEGMENT_COLORS, PATH_COLOR_SCALE, hexToRgb } from '../utilities'

/**
 * The order in which the map layers are presented.
 */
export const layerOrder = ['Trips Layer', 'Availabilities Layer', 'Trip Arcs Layer', 'Path Utilization Layer'] as const

/**
 * Each map layer is identified by a unique key.
 */
export type LayerKey = typeof layerOrder[number]

/**
 * The map layer specifications hold any information needed to render the map layer via the deck.gl framework.
 */
interface Layer {
  /**
   * The sourceDataKey specifies which underlying date the map layer needs to render. Each layer can only depend on one
   * source data object, but each source data object can get utilized by multiple map layers.
   */
  sourceDataKey: SourceDataKey

  /**
   * Stores the markdown string that get displayed inside the InformationCard component.
   */
  descriptionMarkdown: string

  /**
   * See LayerTimelineProps definition.
   */
  timelineProps: LayerTimelineProps

  /**
   * Some map layers need to filter/transform their underlying data before rendering. For example the Trip Arcs layer
   * should only display the trip arcs of the currently selected time. The transformSourceData function therefore
   * filters/transforms the underlying raw source data based on the current time/date.
   */
  transformSourceData?: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) => any

  /**
   * The getDeckGlLayer function returns the appropriate deck.gl map layer.
   */
  getDeckGlLayer: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) => any

  /**
   * See LayerViewportTransition definition.
   */
  viewportTransitions?: Readonly<LayerViewportTransition[]>
}

export type timeUnit = 'second' | 'hour' | 'day'

/**
 * The LayerTimelineProps specify all properties of the layer regarding animation playback and underlying source data
 * time units.
 */
export interface LayerTimelineProps {
  /**
   * The time unit of the underlying layer source data. Most layer will display their source data with a granularity of
   * one second. However, other layers might display source data spanning multiple days or months and therefore use a
   * coarser time unit like hour or day.
   */
  timeUnit: timeUnit

  /**
   * The total length of the underlying layer source data time span in multiples of the layer time unit. For example
   * the Trips layer time unit is second and the source data spans between 2020-05-01 08:00 UTC and 2020-05-01 22:00
   * UTC. Therefore, the loop length is 14 hours/50400 seconds and therefore 50400.
   */
  loopLength: number

  /**
   * The user can drag the TimeSlider component at the bottom of the screen to step/zoom through the layer animation
   * similar to a video playback. This value specifies step width of the TimeSlider component in multiples of the layer
   * time unit. For example the Trips layer time unit is one second and the step width is 60. Therefore, the user can
   * step through the Trips layer animation with a granularity of 60 seconds.
   */
  timeSliderStepGranularity: number

  /**
   * The default time in multiples of the layer time unit at which the layer animation should start playing upon
   * loading. Most layers animations should play from the beginning after loading but others, like the Trips layer
   * might choose to start the animation closer to the middle for aesthetic reasons.
   */
  startTime: number

  /**
   * Some layers underlying source data has a fixed offset deducted of their timestamps to improve animation
   * performance. This offset needs to get added back before the TimeSlider component displays the corresponding date
   * and time strings of the layer.
   */
  timestampOffset: number

  /**
   * Whether to display the date on the TimeSlider component (e.g., 2022-01-01).
   */
  displayDate: boolean

  /**
   * Whether to display the time/hours on the TimeSlider component (e.g., 19:21 UTC).
   */
  displayHours: boolean

  /**
   * Number of milliseconds of how long the layer animation should play in real time.
   */
  animationRunningTime: number

  /**
   * Whether the layer animation should start playing automatically as soon as the underlying source data finished loading.
   */
  startAnimationByDefault: boolean
}

/**
 * A single or multiple LayerViewportTransition define how the viewport should change on entry of a new map layer.
 */
export interface LayerViewportTransition {
  longitude?: number
  latitude?: number
  zoom?: number
  pitch?: number
  bearing?: number
  transitionDuration?: number
  transitionInterpolator?: any
  repeat?: boolean
  bearingChange?: number
}

/**
 * The LAYERS object holds all map layer specifications for the application.
 */
export const mapLayers: Record<LayerKey, Layer> = {
  /**
   * Trips Layer
   */
  'Trips Layer': {
    sourceDataKey: 'bicycle_trip_routes_for_2021_05_01.tsv',
    descriptionMarkdown: TripsLayerMarkdown,

    timelineProps: {
      timeUnit: 'second',
      loopLength: 60 * 60 * 24, // 24 hours (60s * 60m * 24h)
      timeSliderStepGranularity: 60, // 60 seconds per step
      startTime: 60 * 60 * 3, // 09:00h UTC (timestampOffset + 3h)
      timestampOffset: 1619848800, // Sat May 01 2021 06:00 UTC
      displayDate: true,
      displayHours: true,
      animationRunningTime: 2 * 60 * 1000, // 2 minutes
      startAnimationByDefault: IS_LARGE_SCREEN_DEVICE ? true : false, // don't automatically start the animation on mobile devices
    },

    /**
     * To improve performance don't rotate the view around the scene on mobile devices.
     */
    viewportTransitions: IS_LARGE_SCREEN_DEVICE
      ? [
          {
            longitude: 13.389815,
            latitude: 52.511386,
            zoom: 14,
            pitch: 60,
            bearing: 0,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator(),
          },
          {
            bearingChange: 30,
            transitionDuration: 10 * 1000,
            transitionInterpolator: new LinearInterpolator(['bearing']),
            repeat: true,
          },
        ]
      : [
          {
            longitude: 13.39463,
            latitude: 52.51206,
            zoom: 13,
            pitch: 60,
            bearing: 24,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator(),
          },
        ],

    getDeckGlLayer: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) =>
      new TripsLayer({
        id: 'Trips Layer',
        visible: visibleLayerKey === 'Trips Layer',
        data: sourceData[self.sourceDataKey]?.rawData,
        getPath: (trip: any) => trip.coordinates,
        // deduct start timestamp from each data point to avoid overflow
        getTimestamps: (trip: any) =>
          trip.unix_timestamps.map((timestamp: number) => timestamp - self.timelineProps.timestampOffset),
        // each trip path gets a random color from the specified color pallet
        getColor: () => hexToRgb(TRIP_SEGMENT_COLORS[Math.floor(Math.random() * TRIP_SEGMENT_COLORS.length)]),
        widthScale: 2,
        widthMinPixels: 2.4,
        widthMaxPixels: 18,
        capRounded: true,
        jointRounded: true,
        billboard: true,
        trailLength: 3200,
        currentTime: time,
        parameters: { depthTest: false },
      }),
  },

  /**
   * Availabilities Layer
   */
  'Availabilities Layer': {
    sourceDataKey: 'bicycle_availability_for_2021_05_01.tsv',
    descriptionMarkdown: AvailabilitiesMarkdown,

    timelineProps: {
      timeUnit: 'second',
      loopLength: 60 * 60 * 24, // 24 hours (60s * 60m * 24h)
      timeSliderStepGranularity: 60, // 60 seconds per step
      startTime: 60 * 60 * 3, // 09:00h UTC (timestampOffset + 3h)
      timestampOffset: 1619848800, // Sat May 01 2021 06:00 UTC
      displayDate: true,
      displayHours: true,
      animationRunningTime: 2 * 60 * 1000, // 2 minutes
      startAnimationByDefault: IS_LARGE_SCREEN_DEVICE ? true : false, // don't automatically start the animation on mobile devices
    },

    viewportTransitions: [
      {
        longitude: 13.39815,
        latitude: 52.511385,
        zoom: 12,
        pitch: 45,
        bearing: 0,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
      },
    ],

    transformSourceData: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) => {
      // get all availability entries that fall into the current time frame
      const filterFn = (entry: any) =>
        entry.start_time - self.timelineProps.timestampOffset < time &&
        entry.end_time - self.timelineProps.timestampOffset > time

      // add the filtered availabilities to the source data object
      const filteredAvails = sourceData[self.sourceDataKey].rawData.filter(filterFn)
      sourceData[self.sourceDataKey].filteredData = filteredAvails
    },

    getDeckGlLayer: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) =>
      new ScatterplotLayer({
        id: 'Availabilities Layer',
        visible: visibleLayerKey === 'Availabilities Layer',
        data: sourceData[self.sourceDataKey]?.filteredData,
        getPosition: (entry: any) => [entry.lng, entry.lat],
        radiusUnits: 'meters',
        getRadius: 10,
        getFillColor: [118, 255, 3],
        updateTriggers: { getPosition: time },
        parameters: { depthTest: false },
      }),
  },

  /**
   * Trip Arcs Layer
   */
  'Trip Arcs Layer': {
    sourceDataKey: 'bicycle_trips_for_2021_07_14.tsv',
    descriptionMarkdown: TripArcsMarkdown,

    timelineProps: {
      timeUnit: 'second',
      loopLength: 60 * 60 * 24, // 24 hours (60s * 60m * 24h)
      timeSliderStepGranularity: 60, // 60 seconds per step
      startTime: 60 * 60 * 5, // 05:00h UTC (timestampOffset + 5h)
      timestampOffset: 1626220800, //  Jul 14, 2021, 3:08:00 PM
      displayDate: true,
      displayHours: true,
      animationRunningTime: 2 * 60 * 1000, // 2 minutes
      startAnimationByDefault: IS_LARGE_SCREEN_DEVICE ? true : false, // don't automatically start the animation on mobile devices
    },

    viewportTransitions: [
      {
        longitude: 13.39815,
        latitude: 52.511384,
        zoom: 12,
        pitch: 45,
        bearing: 0,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
      },
      {
        bearingChange: 30,
        transitionDuration: 10 * 1000,
        transitionInterpolator: new LinearInterpolator(['bearing']),
        repeat: true,
      },
    ],

    transformSourceData: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) => {
      // get all availability entries that fall into the current time frame
      const filterFn = (entry: any) =>
        entry.start_time - self.timelineProps.timestampOffset < time &&
        entry.end_time - self.timelineProps.timestampOffset > time

      // add the filtered availabilities to the source data object
      const filteredAvails = sourceData[self.sourceDataKey].rawData.filter(filterFn)
      sourceData[self.sourceDataKey].filteredData = filteredAvails
    },

    getDeckGlLayer: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) =>
      new ArcLayer({
        id: 'Trip Arcs Layer',
        visible: visibleLayerKey === 'Trip Arcs Layer',
        data: sourceData[self.sourceDataKey]?.filteredData,
        widthScale: 4,
        widthMinPixels: 3,
        widthMaxPixels: 18,
        widthUnits: 'meters',
        getSourcePosition: (entry: any) => [entry.start_pos_lng, entry.start_pos_lat],
        getTargetPosition: (entry: any) => [entry.end_pos_lng, entry.end_pos_lat],
        getSourceColor: [255, 61, 0],
        getTargetColor: [0, 184, 212],
        updateTriggers: { getSourcePosition: time, getTargetPosition: time },
        parameters: { depthTest: false },
      }),
  },

  /**
   * Path Utilization Layer
   */
  'Path Utilization Layer': {
    sourceDataKey: 'path_utilization_by_hour_of_day.tsv',
    descriptionMarkdown: PathUtilizationMarkdown,

    timelineProps: {
      timeUnit: 'second',
      loopLength: 60 * 60 * 24 - 1, // 24 hours (60s * 60m * 24h) - 1 second to avoid glitch
      timeSliderStepGranularity: 60 * 60, // 1 hour per step
      startTime: 0,
      timestampOffset: 0, // no offset
      displayDate: false,
      displayHours: true,
      animationRunningTime: 12 * 1000, // 12 seconds
      startAnimationByDefault: IS_LARGE_SCREEN_DEVICE ? true : false, // don't automatically start the animation on mobile devices
    },

    viewportTransitions: [
      {
        longitude: 13.389815,
        latitude: 52.511385,
        zoom: IS_LARGE_SCREEN_DEVICE ? 12 : 11,
        pitch: 35,
        bearing: 0,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
      },
    ],

    getDeckGlLayer: (self: Layer, visibleLayerKey: LayerKey, time: number, hour: number, week: string) =>
      new PathLayer({
        visible: visibleLayerKey === 'Path Utilization Layer',
        data: sourceData[self.sourceDataKey]?.rawData,
        getPath: (d: any) => d.path,
        getColor: (d: any) => {
          const path_util = d.utilization.find(([util_hour]: [util_hour: number]) => util_hour === hour) ?? [null, 0]
          const count = path_util[1]
          return [255, 0, 255, PATH_COLOR_SCALE(count)]
        },
        widthScale: 12,
        widthMinPixels: 1.4,
        widthMaxPixels: 18,
        capRounded: true,
        billboard: true,
        parameters: { depthTest: false },
        updateTriggers: { getColor: hour },
        transitions: { getColor: { type: 'interpolation', duration: 450 } },
      }),
  },
} as const
