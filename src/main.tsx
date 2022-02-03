import React from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { blue } from '@mui/material/colors'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import App from './App'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: blue,
    secondary: blue,
    background: { paper: '#282828' },
    GitHub: { main: '#f5f5f5', light: '', dark: '', contrastText: '' },
    LinkedIn: { main: '#0a66c2', light: '', dark: '', contrastText: '' },
    Twitter: { main: '#1da1f2', light: '', dark: '', contrastText: '' },
  },
  /**
   * Reducing the shortest transition duration to 0 theme wide is a dirty hack to make sure the slider component
   * doesn't lag while wrapping around from max to min value. Room for implementation improvement.
   * See: https://github.com/mui-org/material-ui/blob/171942ce6e9f242900928620610a794daf8e559c/packages/mui-material/src/Slider/Slider.js#L182
   */
  transitions: { duration: { shortest: 0 } },
})

/**
 * Module augmentation is needed to add custom colors to MUI theme.
 * See: https://mui.com/customization/theming/#custom-variables
 */
declare module '@mui/material/styles' {
  interface Palette {
    GitHub: Palette['primary']
    LinkedIn: Palette['primary']
    Twitter: Palette['primary']
  }

  interface PaletteOptions {
    GitHub: Palette['primary']
    LinkedIn: Palette['primary']
    Twitter: Palette['primary']
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
