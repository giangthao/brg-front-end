export const mockData: GroupData[] = [
  {
    groupId: 'g1',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '1',
      liid: '123565465465465123565465465465123565465465465123565465465465',
      targetIdentifier: 'IMSI',
      msisdn: '098866456456540988664564565409886645645654',
      imsi: '1114564564550988664564565409886645645654',
      imei: '23423453440988664564565409886645645654',
      lea: 'MC2',
      updatedTime:
        '10:00:30 23/05/2024 10:00:30 23/05/2024 10:00:30 23/05/2024',
    },
    children: [
      {
        profile: 'SMS',
        endTime: '12:00: 01 12/12/2024',
        checked: false,
      },
      { profile: 'CALL', endTime: '13:00:11 02/04/2026', checked: false },
    ],
  },
  {
    groupId: 'g2',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '2',
      liid: '123656756765',
      targetIdentifier: 'IMSI',
      msisdn: '098865756756',
      imsi: '1116576576577',
      imei: '676577774646',
      lea: 'MC2',
      updatedTime: '10:00:04 12/03/2026',
    },
    children: [
      {
        profile: 'SMS LOCATION',
        endTime: '12:00:00 23/06/2024',
        checked: false,
      },
      { profile: 'CALL IMS', endTime: '13:00:06 22/12/2025', checked: false },
      {
        profile: 'SMS LOCATION',
        endTime: '12:00:00 23/06/2024',
        checked: false,
      },
      { profile: 'CALL IMS', endTime: '13:00:06 22/12/2025', checked: false },
      {
        profile: 'SMS LOCATION',
        endTime: '12:00:00 23/06/2024',
        checked: false,
      },
      { profile: 'CALL IMS', endTime: '13:00:06 22/12/2025', checked: false },
    ],
  },
  {
    groupId: 'g3',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '3',
      liid: '12356546546546546',
      targetIdentifier: 'IMSI',
      msisdn: '09886645645654',
      imsi: '111456456455',
      imei: '2342345344',
      lea: 'MC2',
      updatedTime: '10:00:30 23/05/2024',
    },
    children: [
      { profile: 'SMS', endTime: '12:00: 01 12/12/2024', checked: false },
      { profile: 'CALL', endTime: '13:00:11 02/04/2026', checked: false },
    ],
  },
  {
    groupId: 'g4',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '4',
      liid: '12356546546546546',
      targetIdentifier: 'IMSI',
      msisdn: '09886645645654',
      imsi: '111456456455',
      imei: '2342345344',
      lea: 'MC2',
      updatedTime: '10:00:30 23/05/2024',
    },
    children: [
      { profile: 'SMS', endTime: '12:00: 01 12/12/2024', checked: false },
      { profile: 'CALL', endTime: '13:00:11 02/04/2026', checked: false },
    ],
  },
  {
    groupId: 'g5',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '5',
      liid: '12356546546546546',
      targetIdentifier: 'IMSI',
      msisdn: '09886645645654',
      imsi: '111456456455',
      imei: '2342345344',
      lea: 'MC2',
      updatedTime: '10:00:30 23/05/2024',
    },
    children: [
      { profile: 'SMS', endTime: '12:00: 01 12/12/2024', checked: false },
      { profile: 'CALL', endTime: '13:00:11 02/04/2026', checked: false },
    ],
  },
  {
    groupId: 'g7',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '6',
      liid: '12356546546546546',
      targetIdentifier: 'IMSI',
      msisdn: '09886645645654',
      imsi: '111456456455',
      imei: '2342345344',
      lea: 'MC2',
      updatedTime: '10:00:30 23/05/2024',
    },
    children: [
      { profile: 'SMS', endTime: '12:00: 01 12/12/2024', checked: false },
      { profile: 'CALL', endTime: '13:00:11 02/04/2026', checked: false },
    ],
  },
  {
    groupId: 'g8',
    expanded: true,
    checked: false,
    indeterminate: false,
    parent: {
      id: '7',
      liid: '12356546546546546',
      targetIdentifier: 'IMSI',
      msisdn: '09886645645654',
      imsi: '111456456455',
      imei: '2342345344',
      lea: 'MC2',
      updatedTime: '10:00:30 23/05/2024',
    },
    children: [
      { profile: 'SMS', endTime: '12:00: 01 12/12/2024', checked: false },
      {
        profile: 'SMS LOCATION',
        endTime: '12:00: 01 12/12/2024',
        checked: false,
      },
      { profile: 'CALL', endTime: '13:00:11 02/04/2026', checked: false },
    ],
  },
];

export interface GroupData {
  groupId: string;
  expanded: boolean;
  checked: boolean;
  indeterminate: boolean;
  parent: DeliveryInfor;
  children: DeliveryInforChild[];
}

export interface DeliveryInforChild {
  profile: string;
  endTime: string;
  checked: boolean;
}

export interface DeliveryInfor {
  id: string;
  liid: string;
  targetIdentifier: string;
  msisdn: string;
  imsi: string;
  imei: string;
  lea: string;
  updatedTime: string;
  [key: string]: any;
}

export const GROUP_COLUMNS = [
  { label: 'LIID', key: 'liid' },
  { label: 'Target Identifier', key: 'targetIdentifier' },
  { label: 'MSISDN', key: 'msisdn' },
  { label: 'IMSI', key: 'imsi' },
  { label: 'IMEI', key: 'imei' },
  { label: 'LEA', key: 'lea' },
  { label: 'Updated time', key: 'updatedTime' },
];

export const SUB_COLUMNS = [
  { label: 'profile', key: 'profile' },
  { label: 'end time', key: 'endTime' },
];
