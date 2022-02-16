import React from 'react'
import { useAtom } from 'jotai'
import { useRafLoop } from 'react-use'
import { Box, Paper, Slider, IconButton } from '@mui/material'
import { PlayArrow, Pause } from '@mui/icons-material'
import { timeAtom, dateAtom, visibleLayerKeyAtom, visibleLayerDataLoadedAtom } from '../state'
import { mapLayers, timeUnit } from '../specs/mapLayers'

/**
 * Use the current time value, time unit and offset to align the current date value to the corresponding date.
 */
function useAlignDateToTimeValue(
  time: number,
  setDate: (update: React.SetStateAction<Date>) => void,
  timeUnit: timeUnit,
  offset: number
) {
  React.useEffect(() => {
    let newDate: Date

    /**
     * The date constructor takes milliseconds since 1 January 1970 UTC as argument. If the specified time
     * unit of the visible layer is 'second' we have to multiply by 1000 to get the required milliseconds. If the
     * specified time unit is 'day' we have to multiply with 24 * 60 * 60 on top of that.
     */
    switch (timeUnit) {
      case 'second':
        newDate = new Date((Math.floor(time) + offset) * 1000)
        break

      case 'hour':
        newDate = new Date((Math.floor(time) * 60 * 60 + offset) * 1000)
        break

      case 'day':
        newDate = new Date((Math.floor(time) * 60 * 60 * 24 + offset) * 1000)
        break
    }

    setDate(newDate)
  }, [time, setDate, timeUnit, offset])
}

/**
 * The TimeSlider component offers the user a slider widget to step/zoom through the currently active layer animation.
 */
export default function TimeSlider() {
  const [visibleLayerName] = useAtom(visibleLayerKeyAtom)
  const [visibleLayerDataLoaded] = useAtom(visibleLayerDataLoadedAtom)

  const {
    timeUnit,
    loopLength,
    timeSliderStepGranularity,
    startTime,
    timestampOffset,
    displayDate,
    displayHours,
    animationRunningTime,
    startAnimationByDefault,
  } = mapLayers[visibleLayerName].timelineProps

  const [time, setTime] = useAtom(timeAtom)
  const [date, setDate] = useAtom(dateAtom)
  useAlignDateToTimeValue(time, setDate, timeUnit, timestampOffset)

  const animationSpeed = loopLength / animationRunningTime

  // Set TimeSlider to the specified layer `startTime` every time the visible layer changes.
  React.useEffect(() => setTime(startTime), [visibleLayerName, startTime, setTime])

  const previousTimeRef = React.useRef(performance.now())
  const [wasRunningBeforeInteraction, setWasRunningBeforeInteraction] = React.useState(startAnimationByDefault)

  /**
   * To reduce unnecessary renders we run the TimeSlider forward inside a `requestAnimationFrame()` loop.
   */
  const [loopStop, loopStart, isActive] = useRafLoop((timestamp) => {
    // how much time has passed since last frame render
    const delta = timestamp - previousTimeRef.current

    // run the timer forward
    setTime((prevTime) => {
      // save the current timestamp as the last occurring timestamp
      previousTimeRef.current = timestamp

      return (prevTime + delta * animationSpeed) % loopLength
    })
  }, startAnimationByDefault)

  /**
   * Set the `previousTimeRef` to the current timestamp to get an accurate delta value (time passed since last render)
   * on the next render and start the TimeSlider again.
   */
  const startTimeSlider = React.useCallback(() => {
    previousTimeRef.current = performance.now()
    loopStart()
  }, [loopStart])

  /**
   * Stop the TimeSlider and `requestAnimationFrame()` loop.
   */
  const stopTimeSlider = React.useCallback(() => {
    loopStop()
  }, [loopStop])

  /**
   * Start the TimeSlider as soon as the source data of the visible layer finished loading and only if the layer
   * specified `initiallyRunning` as true.
   */
  React.useEffect(() => {
    if (visibleLayerDataLoaded && startAnimationByDefault) {
      startTimeSlider()
    } else {
      stopTimeSlider()
    }
  }, [visibleLayerDataLoaded, startAnimationByDefault, startTimeSlider, stopTimeSlider])

  const toggleRunningState = React.useCallback(() => {
    if (isActive()) {
      stopTimeSlider()
      setWasRunningBeforeInteraction(false)
    } else {
      startTimeSlider()
      setWasRunningBeforeInteraction(true)
    }
  }, [isActive, stopTimeSlider, startTimeSlider, setWasRunningBeforeInteraction])

  return (
    <Paper
      sx={{
        alignSelf: 'center',
        width: {
          xs: '100%', // theme.breakpoints.up('xs')
          md: '80%', // theme.breakpoints.up('md')
          lg: '50%', // theme.breakpoints.up('lg')
        },
        display: 'flex',
        alignItems: 'center',
        padding: 0.5,
      }}
    >
      <Box paddingRight={1}>
        <IconButton onClick={toggleRunningState} aria-label="delete">
          {wasRunningBeforeInteraction ? <Pause /> : <PlayArrow />}
        </IconButton>
      </Box>

      <Slider
        size="small"
        step={timeSliderStepGranularity}
        value={time}
        max={loopLength}
        /**
         * The `onChange()` callback fires immediately upon user interaction with the slider. Therefor we stop the
         * automatic running forward of the slider as to not interfere with the user interaction. If the TimeSlider was
         * running before the user interacted with it, we restart the TimeSlider as soon as the user stops interacting by
         * utilizing the `onChangeCommitted()` callback, which fires as soon as the mouse up event occurs.
         */
        onChange={(_, newValue) => {
          stopTimeSlider()
          setTime(newValue as number)
        }}
        onChangeCommitted={() => {
          if (wasRunningBeforeInteraction) startTimeSlider()
        }}
      />

      <Box>
        <TimeStrings date={date} displayDate={displayDate} displayHours={displayHours} />
      </Box>
    </Paper>
  )
}

/**
 * Since some map layers display data spanning either multiple hours or multiple days/months not every layer needs to
 * indicate the full UTC timestamp on the TimeSlider component. Therefore, the TimeStrings component displays either the
 * date only (e.g., 2022-01-01), the time only (e.g., 19:21 UTC) or both (e.g., 2022-01-01 19:21 UTC) above each other.
 */
function TimeStrings({ date, displayDate, displayHours }: { date: Date; displayDate: boolean; displayHours: boolean }) {
  // see: https://mui.com/system/the-sx-prop/#typescript-usage
  const style = {
    textAlign: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    whiteSpace: 'nowrap',
    typography: 'body2',
  } as const

  // only the hh:ss part of the time string
  const timeString = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' }).slice(0, 5) + ' UTC'

  // only the yyyy-mm-dd part of the ISO date time string
  const dateString = date.toISOString().slice(0, 10)

  if (!displayDate) {
    return <Box sx={style}>{timeString}</Box>
  } else if (!displayHours) {
    return <Box sx={style}>{dateString}</Box>
  } else {
    return (
      <React.Fragment>
        <Box sx={style}>{dateString}</Box>
        <Box sx={style}>{timeString}</Box>
      </React.Fragment>
    )
  }
}
