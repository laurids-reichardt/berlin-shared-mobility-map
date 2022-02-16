// @ts-ignore
import { scaleLinear } from 'd3-scale'
import { RGBAColor } from '@deck.gl/core/utils/color'

/**
 * Some animations and viewport changes should only run with explicit user interaction on small screen devices like
 * phones to ensure better performance. We try to detect this by matching the device screen size. Not perfect but ok
 * for the indented purpose.
 */
export const IS_LARGE_SCREEN_DEVICE = window.matchMedia('(min-width: 560px)').matches

/**
 * Color pallets for individual map layers.
 */
export const TRIP_SEGMENT_COLORS = ['#0072ed', '#2994f2', '#32b7f7', '#2cdbfb', '#00ffff']
export const PATH_COLOR_SCALE = scaleLinear().domain([0, 1500]).range([2, 255])

/**
 * Convert color hex codes (e.g., #FF0000) to array of RGB color values (e.g., [255, 0, 0]).
 */
export function hexToRgb(hex: string): RGBAColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [255, 0, 0]
}
