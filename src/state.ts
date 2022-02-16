import { atom } from 'jotai'
import { LayerKey } from './specs/mapLayers'

/**
 * This application doesn't contain much shared state which is why I decided to use the simple state management library
 * Jotai (https://jotai.org). Any shared state is defined as a simple Jotai atom inside this file. Any component that
 * depends on the shared state can mutate and subscribe via the appropriate Jotai hook.
 */

/**
 * Stores the key of the currently visible map layer. Other map layer become visible by mutating this state.
 */
export const visibleLayerKeyAtom = atom<LayerKey>('Trips Layer')

/**
 * Mainly controls visibility of the loading spinner by storing if the source data of the currently visible map layer
 * is already loaded.
 */
export const visibleLayerDataLoadedAtom = atom(false)

/**
 * The time atom stores the current time/date, selected via the time slider at the bottom of the application. In most
 * cases this will be a UNIX timestamp (number of seconds elapsed since 1 January 1970). Depending on the `timeUnit`
 * of the currently visible layer, the time atom could store other units like 'hour' or 'month' as well.
 */
export const timeAtom = atom(0)

/**
 * The date atom stores the current date time as a JS date object and is therefore directly dependent on the time atom
 * and the `timeUnit` of the currently visible map layer. Any time the time atom changes the date atom gets modified
 * according to the `timeUnit` of the map layer by the `useAlignDateToTimeValue` hook of the time slider component.
 */
export const dateAtom = atom(new Date(0))
