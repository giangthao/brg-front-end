import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  private chart!: am4charts.XYChart;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('line-chart', am4charts.XYChart);
      const title = chart.titles.create();
      title.text = 'Line Chart Demo';

      const data = [
        {
          area: 'Vietnam',
          computers: 199,
          cars: 40,
          boots: 9,
        },
        {
          area: 'China',
          computers: 300,
          cars: 60,
          boots: 78,
        },
        {
          area: 'Korea',
          computers: 200,
          cars: 100,
          boots: 50,
        },
        {
          area: 'Japan',
          computers: 50,
          cars: 34,
          boots: 70,
        },
        {
          area: 'USA',
          computers: 399,
          cars: 70,
          boots: 90,
        },
      ];
      chart.data = data;
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.title.text = "Area";
      categoryAxis.dataFields.category = "area";

      const valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxisY.title.text = "Requirements";
      valueAxisY.renderer.minWidth = 20;

      const seriesNames  = ["computers", "cars", "boots"];
      
      for(let i = 0; i <seriesNames.length; i ++) {
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.categoryX = "area";
        series.dataFields.valueY = seriesNames[i];
        series.name = seriesNames[i];

        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.tooltipText = "Area: {categoryX} \n Requirements: {valueY} {name}"
      }

      chart.legend = new am4charts.Legend();
      this.chart = chart;
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
        if(this.chart) {
            this.chart.dispose()
        }
    })
  }
}
