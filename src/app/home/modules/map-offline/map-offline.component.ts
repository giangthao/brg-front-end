import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { fakePreviousDetections, TargetDetection } from './map-offline.default';

@Component({
  selector: 'app-map',
  templateUrl: './map-offline.component.html',
  styleUrls: ['./map-offline.component.scss'],
})
export class MapOfflineComponent implements AfterViewInit, OnInit {
  map: any;

  // vị trí trạm phát sóng (Hà Nội)
  station = {
    lat: 21.0355,
    lng: 105.8,
  };

  pinnedTargets = [
    { id: 1, name: 'Device A', imsi: '111', imei: 'AAA' },
    { id: 2, name: 'Device B', imsi: '222', imei: 'BBB' },
    { id: 3, name: 'Device C', imsi: '333', imei: 'CCC' },
    { id: 4, name: 'Device D', imsi: '444', imei: 'DDD' },
  ];
  detections: TargetDetection[] = [];
  selectedId: number | null = null;
  isRunning = false;
  intervalId: any = null;
  fakePreviousDetections = fakePreviousDetections;
  popup: maplibregl.Popup | null = null;
  lineSourceId = 'popup-line';

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [this.station.lng, this.station.lat],
      zoom: 17,
    });

    this.map.on('load', () => {
      this.addStationMarker();
      this.drawCoverageCircle();
      this.addSectorsLayer();
      this.addMapClickOutsideHandler();
      if (!this.isRunning) {
        this.loadPreviousSession();
      }
    });
  }

  addMapClickOutsideHandler() {
    this.map.on('click', (e: any) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['sector-fill'],
      });

      if (!features.length) {
        this.removePopupAndLine();
        this.selectedId = null;
        this.map.setFilter('sector-border', [
          '==',
          ['get', 'detectionId'],
          '',
        ]);
      }
    });
  }

  loadPreviousSession() {
    this.preparePreviousDetections();
    this.updateMapData();
  }

  preparePreviousDetections() {
    const grouped = new Map<number, TargetDetection[]>();

    this.fakePreviousDetections.forEach((d) => {
      if (!grouped.has(d.id)) {
        grouped.set(d.id, []);
      }
      grouped.get(d.id)!.push(d);
    });

    const result: any[] = [];

    grouped.forEach((list) => {
      // 👇 record mới nhất = atts lớn nhất
      const latest = list.reduce((a, b) => (a.atts > b.atts ? a : b));

      list.forEach((d) => {
        result.push({
          ...d,
          isNew: d === latest,
          _detectionId: this.generateUUID(),
        });
      });
    });
    this.detections = result;
  }

  updateMapData() {
    const features = this.detections.map((t) => this.generateRingSector(t));
    const source = this.map.getSource('sectors');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features,
      });
    }
  }

  resetUI() {
    this.removePopupAndLine();
    this.selectedId = null;

    if (this.map.getLayer('sector-border')) {
      this.map.setFilter('sector-border', [
        '==',
        ['get', 'detectionId'],
        '',
      ]);
    }
  }

  startNewSession() {
    this.resetUI();
    this.detections = [];
    this.updateMapData();
    this.startFakeSocket(); // listen socket SOCKET_TYPE.TARGET
  }

  startFakeSocket() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      const newData = this.generateFakeTarget();

      // reset vùng cũ của cùng target
      this.detections.forEach((d) => {
        if (d.id === newData.id) {
          d.isNew = false;
        }
      });

      // push vùng mới
      this.detections.push({
        ...newData,
        isNew: true,
        _detectionId: this.generateUUID(),
      });

      // limit history
      const MAX_HISTORY = 100;
      if (this.detections.length > MAX_HISTORY) {
        this.detections.shift();
      }
      console.log(this.detections);

      this.updateMapData();
    }, 1000);
  }

  stopFakeSocket() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.resetUI();
  }

  toggleRealtime() {
    this.isRunning = !this.isRunning;
    console.log('toggle run/stop: ', this.isRunning);

    if (this.isRunning) {
      this.startNewSession();
    } else {
      this.stopFakeSocket();
    }
  }

  addSectorsLayer() {
    this.map.addSource('sectors', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    // 🔴 fill
    this.map.addLayer({
      id: 'sector-fill',
      type: 'fill',
      source: 'sectors',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['get', 'isNew'], false],
          '#ff0000',
          '#999999',
        ],
        'fill-opacity': 0.3,
      },
    });

    // border
    this.map.addLayer({
      id: 'sector-border',
      type: 'line',
      source: 'sectors',
      paint: {
        'line-color': ['get', 'color'], // 👈 luôn lấy màu từ feature
        'line-width': 2,
      },
      filter: ['==', ['get', 'detectionId'], ''], // 👈 mặc định ẩn
    });


    // on click
    this.map.on('click', 'sector-fill', (e: any) => {
      const feature = e.features[0];

      this.selectedId = feature.properties.detectionId;

      this.map.setFilter('sector-border', [
        '==',
        ['get', 'detectionId'],
        this.selectedId,
      ]);

      const data = this.detections.find(
        (d) => d._detectionId === this.selectedId,
      );

      this.showPopupWithLine(e.lngLat, data);
    });
  }

  showPopupWithLine(origin: any, data: any) {
    this.removePopupAndLine();

    if (!data) return;

    const popupLng = origin.lng + 0.0006;
    const popupLat = origin.lat + 0.0004;

    const midLng = origin.lng + 0.0003;
    const midLat = origin.lat;

    this.drawMultiSegmentLine([
      [origin.lng, origin.lat],
      [midLng, midLat],
      [popupLng, popupLat],
    ]);

    const html = `
    <div class="custom-popup">
      <div><b>${data.name}</b></div>
      <div>IMSI: ${data.imsi || '-'}</div>
      <div>IMEI: ${data.imei || '-'}</div>
      <div>Start: ${this.formatTime(data.atts)}</div>
      <div>End: ${this.formatTime(data.disconected_attts)}</div>
    </div>
  `;

    this.popup = new maplibregl.Popup({
      className: 'custom-wide-popup',
      closeButton: true,
      closeOnClick: false,
    })
      .setLngLat([popupLng, popupLat])
      .setHTML(html)
      .addTo(this.map);

    this.popup.on('close', () => {
      this.removePopupAndLine(false);
    });
  }

  drawMultiSegmentLine(coords: number[][]) {
    const data = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    };

    if (this.map.getSource(this.lineSourceId)) {
      this.map.getSource(this.lineSourceId).setData(data);
    } else {
      this.map.addSource(this.lineSourceId, {
        type: 'geojson',
        data,
      });

      this.map.addLayer({
        id: this.lineSourceId,
        type: 'line',
        source: this.lineSourceId,
        paint: {
          'line-color': '#000',
          'line-width': 2,
        },
      });
    }
  }

  removePopupAndLine(removePopup = true) {
    if (removePopup && this.popup) {
      this.popup.remove();
      this.popup = null;
    }

    if (this.map.getLayer(this.lineSourceId)) {
      this.map.removeLayer(this.lineSourceId);
    }

    if (this.map.getSource(this.lineSourceId)) {
      this.map.removeSource(this.lineSourceId);
    }
  }

  generateRingSector(target: TargetDetection) {
    const coords: any[] = [];

    const TA_TO_METER = 78;

    const r1 = target.timing_advance_start * TA_TO_METER;
    const r2 = target.timing_advance_end * TA_TO_METER;

    const startAngle =
      ((target.azimuth - target.beamwidth / 2) * Math.PI) / 180;
    const endAngle =
      ((target.azimuth + target.beamwidth / 2) * Math.PI) / 180;

    const steps = 40;

    // outer arc
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (i / steps) * (endAngle - startAngle);

      const dx = r2 * Math.cos(angle);
      const dy = r2 * Math.sin(angle);

      const lat = this.station.lat + dy / 111320;
      const lng =
        this.station.lng +
        dx / (111320 * Math.cos((this.station.lat * Math.PI) / 180));

      coords.push([lng, lat]);
    }

    // inner arc
    for (let i = steps; i >= 0; i--) {
      const angle = startAngle + (i / steps) * (endAngle - startAngle);

      const dx = r1 * Math.cos(angle);
      const dy = r1 * Math.sin(angle);

      const lat = this.station.lat + dy / 111320;
      const lng =
        this.station.lng +
        dx / (111320 * Math.cos((this.station.lat * Math.PI) / 180));

      coords.push([lng, lat]);
    }

    coords.push(coords[0]);

    const color = target.isNew ? '#ff0000' : '#999999';

    return {
      type: 'Feature',
      properties: {
        detectionId: target._detectionId,
        targetId: target.id,
        isNew: target.isNew ?? false,
        color,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coords],
      },
    };
  }

  /**
   * Thêm marker trạm phát sóng
   */
  addStationMarker() {
    new maplibregl.Marker({ color: 'red' })
      .setLngLat([this.station.lng, this.station.lat])
      .addTo(this.map);
  }

  /**
   * Vẽ vòng phủ sóng bán kính 200m
   */
  drawCoverageCircle() {
    const radius = 200; // mét

    const coords: any[] = [];

    // tạo polygon tròn bằng cách tính 360 điểm
    for (let i = 0; i <= 360; i++) {
      const angle = (i * Math.PI) / 180;

      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);

      const lat = this.station.lat + dy / 111320;

      const lng =
        this.station.lng +
        dx / (111320 * Math.cos((this.station.lat * Math.PI) / 180));

      coords.push([lng, lat]);
    }

    this.map.addSource('coverage', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
      },
    });

    /**
     * Lấy layer label cuối cùng
     * để vẽ layer bên dưới label (giữ chữ đường hiển thị rõ)
     */
    const layers = this.map.getStyle().layers;

    const labelLayerId = layers.find(
      (l: any) => l.type === 'symbol' && l.layout && l.layout['text-field'],
    )?.id;

    // vùng phủ sóng
    this.map.addLayer(
      {
        id: 'coverage-fill',
        type: 'fill',
        source: 'coverage',
        paint: {
          'fill-color': '#00ffff',
          'fill-opacity': 0.05,
        },
      },
      labelLayerId,
    );

    // viền vòng phủ sóng
    this.map.addLayer(
      {
        id: 'coverage-border',
        type: 'line',
        source: 'coverage',
        paint: {
          'line-color': '#00ffff',
          'line-width': 2,
        },
      },
      labelLayerId,
    );
  }

  generateFakeTarget(): TargetDetection {
    const now = Date.now();

    const target =
      this.pinnedTargets[
      Math.floor(Math.random() * this.pinnedTargets.length)
      ];

    // 👇 random start (1 → 5)
    const taStart = Math.floor(Math.random() * 5) + 1;

    // 👇 end luôn > start (cách 1–3 step)
    const taEnd = taStart + Math.random() * 3;

    return {
      id: target.id,
      name: target.name,
      imsi: target.imsi,
      imei: target.imei,

      timing_advance_start: taStart,
      timing_advance_end: taEnd,

      azimuth: Math.random() * 360,
      beamwidth: 40 + Math.random() * 40,

      atts: now,
      disconected_attts: now,

      number_of_detection: Math.floor(Math.random() * 10),
    };
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  formatTime(ts: number) {
    if (!ts) return '-';
    return new Date(ts).toLocaleTimeString();
  }
}
