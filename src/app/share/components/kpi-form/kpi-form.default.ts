export const typesKPI = [
  {
    label: 'Time series',
    value: 'Time series',
  },
  {
    label: 'Transaction',
    value: 'Transaction',
  },
  {
    label: 'Time series 1',
    value: 'Time series 1',
  },
  {
    label: 'Transaction 2',
    value: 'Transaction 2',
  },
  {
    label: 'Time series 3',
    value: 'Time series 3',
  },
  {
    label: 'Transaction 4',
    value: 'Transaction 4',
  },
  {
    label: 'Time series 5',
    value: 'Time series 5',
  },
  {
    label: 'Transaction 6',
    value: 'Transaction 6',
  },
  {
    label: 'Time series 7',
    value: 'Time series 7',
  },
  {
    label: 'Transaction 8',
    value: 'Transaction 9',
  },
  {
    label: 'Time series 10',
    value: 'Time series 10',
  },
  {
    label: '123',
    value: '123',
  },
  {
    label: 'A',
    value: 'A',
  },
  {
    label: '34345346',
    value: '34345346',
  },
  {
    label: 'Carewtwrtrty',
    value: 'Carewtwrtrty',
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
        value: 'USD'
    },
    {
        value: 'VND'
    },
    {
        value: '124'
    }
]

export const operators = [
  {
     label: '+',
     value: 'ADD'
  },
  {
    label: '-',
    value: 'SUB'
  },
  {
    label: 'x',
    value: 'MUL'
  },
  {
    label: '/',
    value: 'DIV'
  }
]

export const expressionFake = [ // ouput: (23143 + 333356) - (23141 / 12)
  {
    groupOperator: null, // + - x / null
    groupItems: [
      {
        itemType: 'TIME_SERRIES',
        itemOperator: null, // + - x / null
        itemValue: 23143
      },
      {
        itemType: 'NUMER',
        itemOperator: 'PLUS', // + - x / null
        itemValue: 333356
      }
    ]
  },
  {
    groupOperator: 'SUB', // + - x / null
    groupItems: [
      {
        itemType: 'TIME_SERRIES',
        itemOperator: null, // + - x / null
        itemValue: 23141
      },
      {
        itemType: 'NUMER',
        itemOperator: 'DIV', // + - x / null
        itemValue: 12
      }
    ]

  }
]
