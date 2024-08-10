export const typesKPI = [
  {
    label: 'Time series',
    value: 'Time series',
  },
  {
    label: 'Transaction',
    value: 'Transaction',
  },
];

export const categories = [
  {
    value: 'Category 1',
  },
  {
    value: 'Category 2',
  },
  {
    value: 'Category 3',
  },
  {
    value: 'Category 4',
  },
  {
    value: 'Category 5',
  },
  {
    value: 'Category 6',
  },
  {
    value: 'Category 7',
  },
  {
    value: 'Category 8',
  },
  {
    value: 'Category 9',
  },
  {
    value: 'Category 10',
  },
  {
    value: 'Category 11',
  },
  {
    value: 'Category 12',
  },
];

export const units = [
  {
    value: 'USD',
  },
  {
    value: 'VND',
  },
  {
    value: '124',
  },
];

export const operators = [
  {
    label: '+',
    value: 'PLUS',
  },
  {
    label: '-',
    value: 'SUB',
  },
  {
    label: 'x',
    value: 'MUL',
  },
  {
    label: '/',
    value: 'DIV',
  },
];

export const itemTypes = [
  {
    label: 'KPI',
    value: 'KPI',
  },
  {
    label: 'Counter',
    value: 'COUNTER',
  },
  {
    label: 'Number',
    value: 'NUMBER',
  },
];

export const listKPITimeSeries = [
  {
    label: 'KPI time 1',
    value: 'KPI time 1',
  },
  {
    label: 'KPI time 2',
    value: 'KPI time 2',
  },
  {
    label: 'KPI time 1',
    value: 'KPI time 1',
  },
  {
    label: 'KPI time 2',
    value: 'KPI time 2',
  },
  {
    label: 'KPI time 1',
    value: 'KPI time 1',
  },
  {
    label: 'KPI time 2',
    value: 'KPI time 2',
  },
  {
    label: 'KPI time 1',
    value: 'KPI time 1',
  },
  {
    label: 'KPI time 2',
    value: 'KPI time 2',
  },
  {
    label: 'KPI time 1',
    value: 'KPI time 1',
  },
  {
    label: 'KPI time 2',
    value: 'KPI time 2',
  },
  {
    label: 'KPI time 1',
    value: 'KPI time 1',
  },
  {
    label: 'KPI time 2',
    value: 'KPI time 2',
  },
];

export const listKPITransaction = [
  {
    label: 'KPI transaction 1',
    value: 'KPI transaction 1',
  },
  {
    label: 'KPI transaction 2',
    value: 'KPI transaction  2',
  },
  {
    label: 'KPI transaction 1',
    value: 'KPI transaction 1',
  },
  {
    label: 'KPI transaction 2',
    value: 'KPI transaction  2',
  },
  {
    label: 'KPI transaction 1',
    value: 'KPI transaction 1',
  },
  {
    label: 'KPI transaction 2',
    value: 'KPI transaction  2',
  },
  {
    label: 'KPI transaction 1',
    value: 'KPI transaction 1',
  },
  {
    label: 'KPI transaction 2',
    value: 'KPI transaction  2',
  },
  {
    label: 'KPI transaction 1',
    value: 'KPI transaction 1',
  },
  {
    label: 'KPI transaction 2',
    value: 'KPI transaction  2',
  },
];

export const counters = [
  {
    label: 'Counter 1',
    value: 'Counter 1',
  },
  {
    label: 'Counter 2',
    value: 'Counter 2',
  },
  {
    label: 'Counter 1',
    value: 'Counter 1',
  },
  {
    label: 'Counter 2',
    value: 'Counter 2',
  },
  {
    label: 'Counter 1',
    value: 'Counter 1',
  },
  {
    label: 'Counter 2',
    value: 'Counter 2',
  },
  {
    label: 'Counter 1',
    value: 'Counter 1',
  },
  {
    label: 'Counter 2',
    value: 'Counter 2',
  },
  {
    label: 'Counter 1',
    value: 'Counter 1',
  },
  {
    label: 'Counter 2',
    value: 'Counter 2',
  },
];

export interface GroupItem {
  item: string;
  itemOperator: string | null;
  itemType: string;
}

export interface Group {
  groupOperator: string | null;
  groupItems: GroupItem[];
}

export const status = [
  {
    label: 'Enable',
    value: true,
  },
  {
    label: 'Disable',
    value: false,
  },
];

export const kpiEdit = {
  name: 'abc',
  belongToCalculation: 11,
  status: true,
  category: {
    label: 'Category 1',
    value: 'Category 1',
  },
  typeKPI: {
    label: 'Transaction',
    value: 'Transaction',
  },
  unit: '1000c',
  percentValue: true,
  description: 'xzccz',
  expression: [
    {
      groupOperator: null,
      groupItems: [
        {
          itemType: 'COUNTER',
          itemOperator: null,
          item: 'Counter 2',
        },
        {
          itemType: 'COUNTER',
          itemOperator: 'PLUS',
          item: 'Counter 2',
        },
      ],
    },
    {
      groupOperator: 'PLUS',
      groupItems: [
        {
          itemType: 'NUMBER',
          itemOperator: null,
          item: 4536,
        },
        {
          itemType: 'COUNTER',
          itemOperator: 'DIV',
          item: 'Counter 1',
        },
      ],
    },
  ],
};
