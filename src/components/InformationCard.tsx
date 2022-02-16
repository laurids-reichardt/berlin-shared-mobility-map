import React from 'react'
import { useAtom } from 'jotai'
import {
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MobileStepper,
  Button,
  Typography,
} from '@mui/material'
import { ExpandMore, KeyboardArrowLeft, KeyboardArrowRight, Info } from '@mui/icons-material'
import Markdown from './Markdown'
import { mapLayers, layerOrder } from '../specs/mapLayers'
import { visibleLayerKeyAtom } from '../state'

/**
 * The InformationCard component displays supplemental description text and charts for the currently visible map layer
 * and provides navigation controls to switch between the different map layers.
 */
export default function InformationCard() {
  const [visibleLayerKey, setVisibleLayerKey] = useAtom(visibleLayerKeyAtom)

  const [accordionExpanded, setAccordionExpanded] = React.useState(false)
  const handleAccordionExpansion = () => setAccordionExpanded((prevExpanded) => !prevExpanded)

  const [visibleLayerIndex, setVisibleLayerIndex] = React.useState(layerOrder.indexOf(visibleLayerKey))
  const handleNext = () => {
    // setAccordionExpanded(false)
    setVisibleLayerIndex((prevVisibleLayerIndex) => prevVisibleLayerIndex + 1)
  }
  const handleBack = () => setVisibleLayerIndex((prevVisibleLayerIndex) => prevVisibleLayerIndex - 1)

  /**
   * Ensure markdown box is scrolled to the top on each map layer change.
   */
  React.useEffect(() => {
    // @ts-ignore
    MarkdownBoxRef.current?.scrollTo(0, 0)
  }, [visibleLayerIndex])

  const MarkdownBoxRef = React.useRef(null)

  /**
   * Switch to the next map layer if the user navigates via the back or next button at the bottom of the card.
   */
  React.useEffect(() => {
    const nextVisibleLayerKey = layerOrder[visibleLayerIndex]
    setVisibleLayerKey(nextVisibleLayerKey)

    /**
     * Track each layer navigation event.
     */
    // @ts-ignore
    window?.umami?.trackEvent(nextVisibleLayerKey, 'navigation')
  }, [visibleLayerIndex, setVisibleLayerKey])

  return (
    <Accordion
      sx={{
        alignSelf: 'flex-end',
        borderRadius: 1,
        width: {
          xs: '100%', // theme.breakpoints.up('xs')
          md: '60%', // theme.breakpoints.up('md')
          lg: '40%', // theme.breakpoints.up('lg')
          xl: '30%', // theme.breakpoints.up('xl')
        },
      }}
      disableGutters={true}
      square={true}
      expanded={accordionExpanded}
      onChange={handleAccordionExpansion}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Info />
        <Typography sx={{ marginLeft: 1.5, fontWeight: 'fontWeightBold' }}>Information</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ flexDirection: 'column', paddingBottom: 1 }}>
        <Box
          ref={MarkdownBoxRef}
          component="div"
          /**
           * Ensures the InformationCard scrollbar looks somewhat ok and consistent across most web browsers.
           */
          sx={(theme) => ({
            overflow: 'auto',
            height: '55vh',
            paddingRight: 1,
            scrollbarColor: `${theme.palette.background.default} rgba(0,0,0,0) `,
            '&::-webkit-scrollbar': { width: theme.spacing(1) },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.background.default,
              borderRadius: theme.spacing(1),
            },
          })}
        >
          <Markdown>{mapLayers[visibleLayerKey].descriptionMarkdown}</Markdown>
        </Box>

        <Divider sx={{ margin: '8px 0' }} />

        <MobileStepper
          sx={{ padding: 0, backgroundColor: 'transparent' }}
          steps={layerOrder.length}
          position="static"
          variant="dots"
          activeStep={visibleLayerIndex}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={visibleLayerIndex === layerOrder.length - 1}>
              Next <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={visibleLayerIndex === 0}>
              <KeyboardArrowLeft /> Back
            </Button>
          }
        />
      </AccordionDetails>
    </Accordion>
  )
}
