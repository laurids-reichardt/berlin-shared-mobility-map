import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryVoronoiContainer } from 'victory'
import { chartData, ChartName } from '../specs/chartData'

/**
 * The TS compiler wouldn't let me override the default theme values via the spread operator. Don't know why. This is
 * ok for now.
 */
const theme = VictoryTheme.material
// @ts-ignore
theme.axis.style.grid.stroke = 'none'
// @ts-ignore
theme.axis.style.tickLabels.fill = '#cfd8dc'
// @ts-ignore
theme.axis.style.tickLabels.fontSize = 10
// @ts-ignore
theme.bar.style.data.fill = '#0097a7'

function CustomVictoryChart({
  titleText,
  padding,
  children,
}: {
  titleText?: string
  padding?: object
  children: React.ReactNode
}) {
  return (
    <VictoryChart
      theme={theme}
      height={180}
      padding={{ top: 40, bottom: 40, left: 40, right: 40, ...padding }}
      containerComponent={<VictoryVoronoiContainer style={{ touchAction: 'auto' }} />}
    >
      {titleText && (
        <VictoryLabel
          text={titleText}
          x={160}
          y={4}
          textAnchor="middle"
          verticalAnchor="start"
          style={{ fill: '#cfd8dc', fontSize: 14 }}
        />
      )}
      {children}
    </VictoryChart>
  )
}

/**
 * The Charts component displays supplemental bar charts inside the InformationCard markdown.
 */
export function Charts({ name }: { name: ChartName }) {
  switch (name) {
    case 'MAYDAY_TRIPS':
      return (
        <CustomVictoryChart titleText="Trips per Hour">
          <VictoryBar data={chartData.MAYDAY_TRIPS} x={(d) => d.date.substring(11)} y="trips" />
          <VictoryAxis
            style={{ tickLabels: { angle: 45 } }}
            fixLabelOverlap={true}
            tickLabelComponent={<VictoryLabel verticalAnchor="middle" textAnchor="start" />}
          />
          <VictoryAxis dependentAxis />
        </CustomVictoryChart>
      )

    case 'DISTINCT_VEHICLE_DISTRIBUTION':
      return (
        <CustomVictoryChart padding={{ bottom: 64 }} titleText="Distinct Bicycle Count per Week">
          <VictoryBar data={chartData.DISTINCT_VEHICLE_DISTRIBUTION} x="week" y="unique_vehicle_count" />
          <VictoryAxis
            style={{ tickLabels: { angle: 45 } }}
            fixLabelOverlap={true}
            tickLabelComponent={<VictoryLabel verticalAnchor="middle" textAnchor="start" />}
          />
          <VictoryAxis dependentAxis />
        </CustomVictoryChart>
      )

    case 'JULY_14_TRIPS':
      return (
        <CustomVictoryChart padding={{ bottom: 60 }} titleText="Trips per Hour on July 14">
          <VictoryBar data={chartData.JULY_14_TRIPS} x={(d) => d.date.substring(11)} y="trips" />
          <VictoryAxis
            style={{ tickLabels: { angle: 45 } }}
            fixLabelOverlap={true}
            tickLabelComponent={<VictoryLabel verticalAnchor="middle" textAnchor="start" />}
          />
          <VictoryAxis dependentAxis />
        </CustomVictoryChart>
      )

    default:
      return <div>Could not find specified chart: {name}</div>
  }
}
