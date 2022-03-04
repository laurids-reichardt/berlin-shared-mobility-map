import React from 'react'
import { useAtom } from 'jotai'
import { format, startOfISOWeek } from 'date-fns'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import DeckGL from '@deck.gl/react'
import ReactMapGL from 'react-map-gl'
import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import MAPSTYLE from '../../assets/mapstyle.json?url'
import { LayerKey, LayerViewportTransition, mapLayers, layerOrder } from '../specs/mapLayers'
import { sourceData, SourceDataDownloadOrder, SourceDataKey } from '../specs/sourceData'
import { timeAtom, dateAtom, visibleLayerKeyAtom, visibleLayerDataLoadedAtom } from '../state'

/**
 * Sequentially fetch all source data needed by the map layers and set `visibleLayerDataLoadedAtom` state accordingly.
 */
function useFetchSourceData(visibleLayerSourceDataKey: SourceDataKey) {
  /**
   * Holds keys of all source data entries that are already loaded and available to the application.
   */
  const [loadedSourceDataKeys, setLoadedSourceDataKeys] = React.useState<Array<SourceDataKey>>([])

  /**
   * This effect runs once and kicks off fetching of all source data.
   */
  React.useEffect(() => {
    /**
     * Tries to asynchronously fetch the JSON data located at the provided url.
     */
    async function asyncFetchJSONData(url: string) {
      try {
        const response = await fetch(url)
        return await response.json()
      } catch (error) {
        console.error(`Encountered error while fetching ${url}: \n ${error}`)
        return null
      }
    }

    /**
     * Tries to asynchronously fetch the CSV file located at the provided url and parse the data via the provided
     * loader options.
     */
    async function asyncLoadCSVData(url: string, loaderOptions: any) {
      try {
        return await load(url, CSVLoader, loaderOptions)
      } catch (error) {
        console.error(`Encountered error while loading or parsing ${url}: \n ${error}`)
        return null
      }
    }

    /**
     * Passing an async function to a useEffect hook directly is not allowed. Instead, we'll make due with this async
     * immediately-invoked function expression.
     */
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      for (const sourceDataKey of SourceDataDownloadOrder) {
        const sourceDataEntry = sourceData[sourceDataKey]

        // wait till source data is fetched before kicking off another fetch
        const fetchedData = sourceDataEntry.loaderOptions
          ? // load via CSV loader if `loaderOptions` is specified
            await asyncLoadCSVData(sourceDataEntry.url, sourceDataEntry.loaderOptions)
          : // load via fetch api if NO `loaderOptions` is specified
            await asyncFetchJSONData(sourceDataEntry.url)

        // skip current iteration if data fetching was unsuccessful
        if (fetchedData === null) continue

        setLoadedSourceDataKeys((prevLoadedSourceDataKeys) => {
          // add the loaded source data to the source data object
          sourceDataEntry.rawData = fetchedData

          // and add the corresponding key to the loaded source data state array
          return [...prevLoadedSourceDataKeys, sourceDataKey]
        })
      }
    })()
  }, [])

  /**
   * Stores information on whether the source data of the currently visible layer is already loaded and available.
   */
  const [visibleLayerDataLoaded, setVisibleLayerDataLoaded] = useAtom(visibleLayerDataLoadedAtom)

  /**
   * Recomputes the visibleLayerDataLoaded state every time new data is fetched of the visible layer changes.
   */
  React.useEffect(() => {
    // Check if loadedSourceDataKeys includes the key of the source data for the currently visible layer.
    setVisibleLayerDataLoaded(loadedSourceDataKeys.includes(visibleLayerSourceDataKey))
  }, [visibleLayerSourceDataKey, loadedSourceDataKeys, setVisibleLayerDataLoaded])

  return visibleLayerDataLoaded
}

/**
 * Sequentially executes any viewport transitions (flying to a specific location/rotating around a center point)
 * specified by the currently visible map layer.
 */
function useViewportTransitions(
  visibleLayerKey: LayerKey,
  deckglLoaded: boolean,
  visibleLayerDataLoaded: boolean
): [LayerViewportTransition, React.MutableRefObject<LayerViewportTransition>] {
  /**
   * To prevent any viewport yanking during startup the target view state of the first viewport transition of the first
   * layer shall also be the initial view state of the application.
   */
  const defaultViewstate: LayerViewportTransition = {
    longitude: 13.389815,
    latitude: 52.511385,
    zoom: 14,
    pitch: 60,
    bearing: 0,
  }

  const firstLayerTransitions = mapLayers[layerOrder[0]]?.viewportTransitions

  const initialViewstate: LayerViewportTransition =
    typeof firstLayerTransitions !== 'undefined' ? firstLayerTransitions[0] : defaultViewstate

  const [transitionTargetViewState, setTransitionTargetViewState] = React.useState(initialViewstate)

  const viewStateRef = React.useRef(transitionTargetViewState)

  const visibleLayer = mapLayers[visibleLayerKey]

  React.useEffect(() => {
    /**
     * Abort any attempts at transitioning if deck.gl isn't loaded yet, the source data of the visible layer isn't
     * loaded yet or the layer doesn't have any transitions specified.
     */
    if (!deckglLoaded || !visibleLayerDataLoaded || !visibleLayer.viewportTransitions) return

    /**
     * Since we'll mutate this array, get a copy of specified viewport transitions of the visible layer.
     */
    const viewportTransitions = Array.from(visibleLayer.viewportTransitions)

    /**
     * Checks whether the meaningful properties of two view states are the same and will therefore NOT trigger a
     * transition by deck.gl.
     */
    function sameViewStates(firstViewState: LayerViewportTransition, secondViewState: LayerViewportTransition) {
      return firstViewState.longitude === secondViewState.longitude &&
        firstViewState.latitude === secondViewState.latitude &&
        firstViewState.zoom === secondViewState.zoom &&
        firstViewState.pitch === secondViewState.pitch &&
        firstViewState.bearing === secondViewState.bearing
        ? true
        : false
    }

    function scheduleTransition(remainingViewportTransitions: Array<LayerViewportTransition>) {
      // get the first remaining transition
      const scheduledViewportTransition = remainingViewportTransitions.shift()

      // abort if no viewport transition remains
      if (typeof scheduledViewportTransition === 'undefined') return

      function getNextViewportTransition() {
        if (scheduledViewportTransition?.repeat) {
          return () => scheduleTransition([scheduledViewportTransition])
        } else if (remainingViewportTransitions.length > 0) {
          return () => scheduleTransition(remainingViewportTransitions)
        } else {
          return () => "I'm just here so the linter won't complain."
        }
      }

      /**
       * The future view state is derived from the current view state. This ensures that any user interactions
       * with the viewport between transitions are not ignored.
       */
      const nextViewState = {
        ...viewStateRef.current,
        ...scheduledViewportTransition,
        onTransitionEnd: getNextViewportTransition(),
        onTransitionInterrupt: () => console.log('Viewport transition was interrupted.'),
      }

      /**
       * `bearingChange` is a custom property that indicates by how much the bearing should change on each transition
       * iteration.
       */
      if (scheduledViewportTransition?.bearingChange) {
        nextViewState.bearing = viewStateRef.current.bearing
          ? viewStateRef.current.bearing + scheduledViewportTransition.bearingChange
          : 0 + scheduledViewportTransition.bearingChange
      }

      /**
       * If the next target view state doesn't meaningful differ from the current view state, there is no point in
       * executing it. Therefore, the next target view state is skipped, and the remaining view states are instead
       * scheduled.
       */
      if (sameViewStates(viewStateRef.current, nextViewState)) {
        // console.log('No meaningful difference between current and next scheduled view state.')
        scheduleTransition(remainingViewportTransitions)
      } else {
        console.log('Setting next target view state: ', nextViewState)
        setTransitionTargetViewState(nextViewState)
      }
    }

    // recursively schedule any viewport transitions of the visible layer
    scheduleTransition(viewportTransitions)
  }, [deckglLoaded, visibleLayerDataLoaded, visibleLayer, viewStateRef, setTransitionTargetViewState])

  return [transitionTargetViewState, viewStateRef]
}

/**
 * Transforms the applicable source data for the currently visible deck.gl layer. This mainly entails filtering data
 * entries for the currently selected time frame.
 */
function useTransformSourceData(
  time: number,
  hour: number,
  week: string,
  visibleLayerKey: LayerKey,
  visibleLayerDataLoaded: boolean
) {
  React.useEffect(() => {
    for (const layerKey of layerOrder) {
      if (visibleLayerKey === layerKey) {
        const layer = mapLayers[layerKey]
        if (typeof layer.transformSourceData === 'function') {
          layer.transformSourceData(mapLayers[layerKey], visibleLayerKey, time, hour, week)
        }
      }
    }
  }, [time, hour, week, visibleLayerKey, visibleLayerDataLoaded])
}

/**
 * Converts the currently selected time (UNIX timestamp) to the corresponding hour number (0-23) and nearest week.
 */
function use24HourTimeAndWeekNumber(time: number, date: Date): [hour: number, week: string] {
  const [hour, setHour] = React.useState(0)
  const [week, setWeek] = React.useState('2020-01-01')

  React.useEffect(() => {
    const _hour = Math.floor((time / 3600) % 24)
    setHour((prevHour) => (prevHour !== _hour ? _hour : prevHour))

    const _week = format(startOfISOWeek(date), 'yyyy-MM-dd')
    setWeek((prevWeek) => (prevWeek !== _week ? _week : prevWeek))
  }, [time, date])

  return [hour, week]
}

/**
 * The Map component renders a styled 3D base map of Berlin and the currently visible Deck.gl layer.
 */
export default function Map() {
  const [visibleLayerKey] = useAtom(visibleLayerKeyAtom)
  const visibleLayerDataLoaded = useFetchSourceData(mapLayers[visibleLayerKey].sourceDataKey)
  const [time] = useAtom(timeAtom)
  const [date] = useAtom(dateAtom)
  const [hour, week] = use24HourTimeAndWeekNumber(time, date)

  useTransformSourceData(time, hour, week, visibleLayerKey, visibleLayerDataLoaded)

  /**
   * Array of all map layers to be rendered by deck.gl.
   */
  const deckglLayers = layerOrder.map((layerKey) =>
    mapLayers[layerKey].getDeckGlLayer(mapLayers[layerKey], visibleLayerKey, time, hour, week)
  )

  /**
   * Schedule viewport transitions.
   */
  const [deckglLoaded, setDeckglLoaded] = React.useState(false)
  const [targetViewState, viewStateRef] = useViewportTransitions(visibleLayerKey, deckglLoaded, visibleLayerDataLoaded)

  return (
    <DeckGL
      initialViewState={targetViewState}
      onViewStateChange={({ viewState }: { viewState: LayerViewportTransition }) => (viewStateRef.current = viewState)}
      controller={{ touchRotate: true }}
      layers={deckglLayers}
      onLoad={() => setDeckglLoaded(true)}
    >
      <ReactMapGL mapLib={maplibregl} mapStyle={MAPSTYLE} RTLTextPlugin={''} />
    </DeckGL>
  )
}
