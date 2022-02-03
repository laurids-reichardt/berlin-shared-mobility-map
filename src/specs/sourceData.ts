import bicycle_trip_routes_for_2021_05_01_url from '../../static_assets/bicycle_trip_routes_for_2021_05_01.tsv?url'
import bicycle_availability_for_2021_05_01_url from '../../static_assets/bicycle_availability_for_2021_05_01.tsv?url'
import bicycle_trips_for_2021_07_14_url from '../../static_assets/bicycle_trips_for_2021_07_14.tsv?url'
import bicycle_trips_for_2021_05_01_url from '../../static_assets/bicycle_trips_for_2021_05_01.tsv?url'
import path_utilization_by_hour_of_day_url from '../../static_assets/path_utilization_by_hour_of_day.tsv?url'

/**
 * The download order of the source data files should match the order in which they are needed by the individual map
 * layers. Else the user will experience unnecessary load times.
 */
export const SourceDataDownloadOrder = [
  'bicycle_trip_routes_for_2021_05_01.tsv',
  'bicycle_availability_for_2021_05_01.tsv',
  'bicycle_trips_for_2021_07_14.tsv',
  'bicycle_trips_for_2021_05_01.tsv',
  'path_utilization_by_hour_of_day.tsv',
] as const

/**
 * Each source data object is identified by its unique filename.
 */
export type SourceDataKey = typeof SourceDataDownloadOrder[number]

/**
 * The source data specifications tell the application how and in which order to asynchronously fetch the underlying
 * data for the map layers. Since the individual files can be quite large we don't want to include them at compile
 * time. Instead, they'll get fetched one by one after the application code finishes to load. If the source data for
 * a visible layer didn't finish to load in time, a small loading indicator will appear in the middle of the screen.
 */
interface SourceData {
  /**
   * The URL specifies from where to fetch the source data file.
   */
  url: string

  /**
   * Source data files my either be stored as JSON or TSV files. In case of TSV file the application needs additional
   * options on how to parse the TSV file to a JavaScript array. If no loaderOptions are specified the application
   * assumes that the underlying file format is JSON.
   */
  loaderOptions?: any

  /**
   * Once the source data file is properly parsed the rawData array stores the resulting data. This array should not
   * get modified after initialization.
   */
  rawData: any[]

  /**
   * Many map layers need to apply filters before displaying their underlying source data (e.g., only displaying data
   * points at specific time). The filteredData array therefore may get modified by the currently visible map layer to
   * store the filtered source data.
   */
  filteredData: any[]
}

/**
 * The genericCSVLoaderOptions tell the loaders.gl/csv module how to parse the columns of the TSV source files.
 * See: https://loaders.gl/modules/csv/docs/api-reference/csv-loader
 */
const genericCSVLoaderOptions = {
  csv: {
    delimiter: '\t',
    transform: (value: any, column: any) => {
      switch (column) {
        case 'unique_id':
          return value
        case 'start_time' || 'end_time':
          return parseInt(value)
        case 'lng' || 'lat' || 'start_pos_lng' || 'start_pos_lat' || 'end_pos_lng' || 'end_pos_lat':
          return parseFloat(value)
        default:
          return JSON.parse(value) ?? value
      }
    },
  },
}

export const sourceData: Record<SourceDataKey, SourceData> = {
  'bicycle_trip_routes_for_2021_05_01.tsv': {
    url: bicycle_trip_routes_for_2021_05_01_url,
    loaderOptions: genericCSVLoaderOptions,
    rawData: [],
    filteredData: [],
  },
  'bicycle_availability_for_2021_05_01.tsv': {
    url: bicycle_availability_for_2021_05_01_url,
    loaderOptions: genericCSVLoaderOptions,
    rawData: [],
    filteredData: [],
  },
  'bicycle_trips_for_2021_05_01.tsv': {
    url: bicycle_trips_for_2021_05_01_url,
    loaderOptions: genericCSVLoaderOptions,
    rawData: [],
    filteredData: [],
  },
  'bicycle_trips_for_2021_07_14.tsv': {
    url: bicycle_trips_for_2021_07_14_url,
    loaderOptions: genericCSVLoaderOptions,
    rawData: [],
    filteredData: [],
  },
  'path_utilization_by_hour_of_day.tsv': {
    url: path_utilization_by_hour_of_day_url,
    loaderOptions: genericCSVLoaderOptions,
    rawData: [],
    filteredData: [],
  },
}
