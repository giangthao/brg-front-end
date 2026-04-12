export interface TargetDetection {
  id: number;
  name: string;
  imsi?: string;
  imei?: string;

  timing_advance_start: number; // TA min
  timing_advance_end: number; // TA max

  azimuth: number;
  beamwidth: number;

  atts: number;
  disconected_attts: number;
  number_of_detection: number;
  isNew?: boolean;
  _detectionId?: any;
}

export const fakePreviousDetections: TargetDetection[] = (() => {
  const now = Date.now();

  return [
    // TARGET 1
    {
      id: 1,
      name: 'Device 1',
      timing_advance_start: 1,
      timing_advance_end: 2,
      azimuth: 30,
      beamwidth: 60,
      atts: now - 60000, // 60s trước
      disconected_attts: now - 60000,
      number_of_detection: 3,
    },
    {
      id: 1,
      name: 'Device 1',
      timing_advance_start: 2,
      timing_advance_end: 3,
      azimuth: 40,
      beamwidth: 50,
      atts: now - 20000, // 20s trước
      disconected_attts: now - 20000,
      number_of_detection: 5,
    },

    // TARGET 2 (không active → lấy atts lớn nhất)
    {
      id: 2,
      name: 'Device 2',
      timing_advance_start: 1,
      timing_advance_end: 2,
      azimuth: 120,
      beamwidth: 70,
      atts: now - 70000,
      disconected_attts: now - 70000,
      number_of_detection: 2,
    },
    {
      id: 2,
      name: 'Device 2',
      timing_advance_start: 2,
      timing_advance_end: 4,
      azimuth: 130,
      beamwidth: 60,
      atts: now - 30000, // 👈 mới nhất
      disconected_attts: now - 30000,
      number_of_detection: 4,
    },

    // TARGET 3
    {
      id: 3,
      name: 'Device 3',
      timing_advance_start: 1,
      timing_advance_end: 3,
      azimuth: 200,
      beamwidth: 40,
      atts: now - 10000,
      disconected_attts: now - 10000, // 👈 active
      number_of_detection: 6,
    },

    // TARGET 4
    {
      id: 4,
      name: 'Device 4',
      timing_advance_start: 2,
      timing_advance_end: 5,
      azimuth: 300,
      beamwidth: 80,
      atts: now - 80000,
      disconected_attts: now - 80000,
      number_of_detection: 3,
    },
    {
      id: 4,
      name: 'Device 4',
      timing_advance_start: 3,
      timing_advance_end: 6,
      azimuth: 310,
      beamwidth: 70,
      atts: now - 15000,
      disconected_attts: now - 80000,
      number_of_detection: 7,
    },
  ];
})();
