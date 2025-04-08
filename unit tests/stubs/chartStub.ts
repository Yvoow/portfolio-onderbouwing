type SerieDataRow = {
  belongsToMonitoringPoint?: string;
  datetime: number;
  value: number;
  periodYear?: number;
  periodSequence?: number;
  manualMeasurement?: boolean;
  condition?: string;
  quantity?: string;
};

export const chartStub: SerieDataRow[] = [
  {
    belongsToMonitoringPoint: '1',
    datetime: 1612137600000,
    value: 100,
    periodYear: 2021,
    periodSequence: 1,
    manualMeasurement: false,
    condition: 'condition1',
    quantity: 'quantity1',
  },
  {
    belongsToMonitoringPoint: '1',
    datetime: 1612224000000,
    value: 200,
    periodYear: 2021,
    periodSequence: 2,
    manualMeasurement: true,
    condition: 'condition2',
    quantity: 'quantity1',
  },
  {
    belongsToMonitoringPoint: '1',
    datetime: 1612310400000,
    value: 300,
    periodYear: 2021,
    periodSequence: 3,
    manualMeasurement: false,
    condition: 'condition1',
    quantity: 'quantity2',
  },
  {
    belongsToMonitoringPoint: '2',
    datetime: 1612396800000,
    value: 400,
    periodYear: 2021,
    periodSequence: 4,
    manualMeasurement: false,
    condition: 'condition2',
    quantity: 'quantity2',
  },
];
