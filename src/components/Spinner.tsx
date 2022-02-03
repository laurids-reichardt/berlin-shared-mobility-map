import { Box, CircularProgress } from '@mui/material'

/**
 * Continuous spinner indicating loading state. Inspired by MUI customization example:
 * https://mui.com/components/progress/#customization
 */
export default function Spinner() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100px',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[700],
          position: 'absolute',
        }}
        size={40}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: 'primary.main',
          animationDuration: '550ms',
          position: 'absolute',
        }}
        size={40}
        thickness={4}
      />
    </Box>
  )
}
