import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

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

  // danh sách target (khoảng cách tới trạm - mét)
  targets = [
    { distance: 50 },
    { distance: 80 },
    { distance: 120 },
    { distance: 150 },
    { distance: 170 },
    { distance: 190 },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Khởi tạo bản đồ
   */
  initMap() {
    this.map = new maplibregl.Map({
      container: 'map',

      // sử dụng basemap từ carto (OpenStreetMap style)
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',

      // center map tại trạm
      center: [this.station.lng, this.station.lat],

      zoom: 16,
    });

    this.map.on('load', () => {
      // hiển thị marker trạm
      this.addStationMarker();

      // vẽ vòng phủ sóng 200m
      this.drawCoverageCircle();

      // hiển thị heatmap target
      this.addHeatmap();
    });
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

  /**
   * Tạo GeoJSON cho heatmap
   *
   * Lưu ý:
   * - Mỗi target chỉ tạo 1 điểm
   * - Không random thêm points
   * - Tọa độ được tính từ distance tới trạm
   * - gs góc sector của angten có hướng là 45 độ
   */
  // generateHeatmapPoints() {
  //   const features: any[] = [];

  //   // hướng giả định của sector (45°)
  //   const direction = (45 * Math.PI) / 180;

  //   this.targets.forEach((t) => {
  //     const d = t.distance;

  //     const dx = d * Math.cos(direction);
  //     const dy = d * Math.sin(direction);

  //     const lat = this.station.lat + dy / 111320;

  //     const lng =
  //       this.station.lng +
  //       dx / (111320 * Math.cos((this.station.lat * Math.PI) / 180));

  //     features.push({
  //       type: 'Feature',

  //       properties: {
  //         intensity: 1,
  //       },

  //       geometry: {
  //         type: 'Point',
  //         coordinates: [lng, lat],
  //       },
  //     });
  //   });

  //   return {
  //     type: 'FeatureCollection',
  //     features,
  //   };
  // }

  // giả sử ko có angten có hướng
  generateHeatmapPoints() {
    const features: any[] = [];

    this.targets.forEach((t) => {
      const angle = Math.random() * 2 * Math.PI;

      const d = t.distance;

      const dx = d * Math.cos(angle);
      const dy = d * Math.sin(angle);

      const lat = this.station.lat + dy / 111320;

      const lng =
        this.station.lng +
        dx / (111320 * Math.cos((this.station.lat * Math.PI) / 180));

      features.push({
        type: 'Feature',
        properties: { intensity: 1 },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      });
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  /**
   * Thêm layer heatmap
   */
  addHeatmap() {
    this.map.addSource('devices', {
      type: 'geojson',
      data: this.generateHeatmapPoints(),
    });

    this.map.addLayer({
      id: 'devices-heat',

      type: 'heatmap',

      source: 'devices',

      paint: {
        'heatmap-weight': 3,

        'heatmap-intensity': 0.8,

        'heatmap-radius': 35,

        'heatmap-opacity': 0.6,

        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],

          0,
          'rgba(0,0,0,0)',

          0.3,
          'blue',

          0.5,
          'cyan',

          0.7,
          'yellow',

          0.9,
          'orange',

          1,
          'red',
        ],
      },
    });

    // this.map.addLayer({
    //   id: 'devices-point',
    //   type: 'circle',
    //   source: 'devices',
    //   paint: {
    //     'circle-radius': 6,
    //     'circle-color': '#000',
    //   },
    // });
  }
}
