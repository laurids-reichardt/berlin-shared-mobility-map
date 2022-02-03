import { VictoryBar, VictoryLabel, VictoryChart, VictoryStack, VictoryAxis, VictoryTheme } from 'victory'

const data = [
  {
    date: '00:00',
    count: 4,
  },
  {
    date: '01:00',
    count: 3,
  },
  {
    date: '02:00',
    count: 1,
  },
  {
    date: '03:00',
    count: 6,
  },
  {
    date: '04:00',
    count: 3,
  },
  {
    date: '05:00',
    count: 7,
  },
  {
    date: '06:00',
    count: 19,
  },
  {
    date: '07:00',
    count: 56,
  },
  {
    date: '08:00',
    count: 49,
  },
  {
    date: '09:00',
    count: 103,
  },
  {
    date: '10:00',
    count: 128,
  },
  {
    date: '11:00',
    count: 144,
  },
  {
    date: '12:00',
    count: 158,
  },
  {
    date: '13:00',
    count: 182,
  },
  {
    date: '14:00',
    count: 152,
  },
  {
    date: '15:00',
    count: 163,
  },
  {
    date: '16:00',
    count: 179,
  },
  {
    date: '17:00',
    count: 143,
  },
  {
    date: '18:00',
    count: 117,
  },
  {
    date: '19:00',
    count: 95,
  },
  {
    date: '20:00',
    count: 81,
  },
  {
    date: '21:00',
    count: 66,
  },
  {
    date: '22:00',
    count: 24,
  },
  {
    date: '23:00',
    count: 7,
  },
]

export function Chart(params: any) {
  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryAxis
        // tickValues={data.map((entry) => entry.date)}
        // tickFormat={(x) => new Date(x * 1000).toLocaleTimeString('de-DE').slice(0, 5)}
        style={{ tickLabels: { angle: 90 } }}
        label="Time of Day"
      />
      <VictoryAxis dependentAxis label="Trips" />
      <VictoryStack colorScale={'cool'}>
        <VictoryBar data={data} x="date" y="count" />
      </VictoryStack>
    </VictoryChart>
  )
}
