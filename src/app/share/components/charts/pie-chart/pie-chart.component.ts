import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnDestroy {
  @Input() id!: string;
  @Input() chartData: any;
  private chart!: am4charts.PieChart;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      const chart = am4core.create(this.id, am4charts.PieChart);

      // Add data
      chart.data = this.chartData;

      let isEmptyData = true;
      for (let i = 0; i < chart.data.length; i++) {
        if (chart.data[i].litres > 0) {
          isEmptyData = false;
          break;
        }
      }

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'litres';
      pieSeries.dataFields.category = 'country';
      pieSeries.labels.template.disabled = true;

      // Disable click events
      pieSeries.slices.template.events.on("hit", (ev) => {
        ev.target.events.disableType("hit");
      });

      if (isEmptyData) {
        chart.data.push({ country: '', litres: 1 });
        pieSeries.colors.list = [
          am4core.color('#5046e5'),
          am4core.color('#6366f1'),
          am4core.color('#828cf9'),
          am4core.color('#a4b3fd'),
          am4core.color('#c7d2ff'),
          am4core.color('#e1e7ff'),
          am4core.color('#ddd'),
        ];
        if (pieSeries.tooltip) {
          pieSeries.tooltip.disabled = true;
        }
      } else {
        pieSeries.colors.list = [
          am4core.color('#5046e5'),
          am4core.color('#6366f1'),
          am4core.color('#828cf9'),
          am4core.color('#a4b3fd'),
          am4core.color('#c7d2ff'),
          am4core.color('#e1e7ff'),
        ];
      }
      chart.radius = am4core.percent(90);
      pieSeries.innerRadius = am4core.percent(70);
      chart.logo.disabled = true;
      const idLegend = this.id + '-legend';

      //Create custom legend
      chart.events.on('ready', function (event) {
        // Create custom legend
        const legend = document.getElementById(idLegend);
        if (legend instanceof HTMLElement) {
          pieSeries.dataItems.each((row, i) => {
            const color = pieSeries.colors.getIndex(i).hex;
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.style.color = '#201830';

            if (!isEmptyData) {
              legendItem.innerHTML = `
                <div class="legend-marker" style="background-color: ${color};"></div>
                <div class="legend-value">${row.category}</div>
                `;
              legendItem.onclick = () => hoverSlice(i);
              legendItem.onmouseover = () => hoverSlice(i);
              legendItem.onmouseout = () => blurSlice(i);
            } else {
              if (i < pieSeries.dataItems.length - 1) {
                legendItem.innerHTML = `
                    <div class="legend-marker" style="background-color: ${color};"></div>
                    <div class="legend-value">${row.category}</div>
                    `;
              }
            }

            legend.appendChild(legendItem);
          });

          const hoverSlice = (index: number) => {
            const slice = pieSeries.slices.getIndex(index);
            if (slice) {
              slice.isHover = true;
            }
          };

          const blurSlice = (index: number) => {
            const slice = pieSeries.slices.getIndex(index);
            if (slice) {
              slice.isHover = false;
            }
          };
        }
      });
      this.chart = chart;
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
