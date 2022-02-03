import { Box } from '@mui/material'
import TimeSlider from './TimeSlider'
import InformationCard from './InformationCard'

/**
 * The Overlay component displays the InformationCard and the TimeSlider each at the top and bottom of the screen.
 */
export default function Overlay() {
  return (
    <Box
      sx={{
        position: 'absolute',
        pointerEvents: 'none',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          '& *': { pointerEvents: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <InformationCard />
        <TimeSlider />
      </Box>
    </Box>
  )
}
