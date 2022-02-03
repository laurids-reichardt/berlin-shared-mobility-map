import React from 'react'
import { useAtom } from 'jotai'
import Spinner from './components/Spinner'
import Overlay from './components/Overlay'
import Map from './components/Map'
import { visibleLayerDataLoadedAtom } from './state'

export default function App() {
  //  Display a loading spinner while the source data of the currently visible layer is not yet loaded.
  const [visibleLayerDataLoaded] = useAtom(visibleLayerDataLoadedAtom)

  return (
    <React.Fragment>
      <Map />
      {!visibleLayerDataLoaded && <Spinner />}
      <Overlay />
    </React.Fragment>
  )
}
