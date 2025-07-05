import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  data,
  userKpi,
  systemKpi,
  Metric,
  responseData,
} from './report-kpi.default';
import { TranslateService } from '@ngx-translate/core';

/* ---------- THÊM IMPORT  ---------- */
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  templateUrl: './report-kpi.component.html',
})
export class ReportKPIComponent implements OnInit {
  formDate = '12/12/2023';
  toDate = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy

  titleTable = data.title;
  userKpi = userKpi;
  systemKpi = systemKpi;

  rowsUserKpiTable: any[] = [];
  rowsSystemKpiTable: any[] = [];
  // Định nghĩa layout tùy chỉnh với padding
  customLayout = {
    paddingLeft: () => 10, // Padding trái
    paddingRight: () => 10, // Padding phải
    paddingTop: () => 5, // Padding trên
    paddingBottom: () => 5, // Padding dưới
  };

  constructor(private translate: TranslateService) {
    // Set the default language
    translate.setDefaultLang('en');

    // Use a language
    translate.use('en');
  }

  ngOnInit(): void {}

  extractValueMetric(metric: Metric) {
    let result = '';
    if (metric.value) {
      result = metric.value;
    }

    if (metric.unit) {
      result = result + ` - ${metric.unit}`;
    }

    return result;
  }

  patchGroupChildren(metricGroup: Metric, target: any[]) {
    if (metricGroup?.children && metricGroup.children.length > 0) {
      metricGroup.children.map((metricChild, index) => {
        if (metricChild?.children && metricChild.children.length > 0) {
          const row = [
            {
              text: `${metricGroup.no}.${index + 1}. ${metricChild.label}`,
              style: 'title',
            },
            {},
            {
              text: this.extractValueMetric(metricChild),
              style: 'value',
            },
          ];
          target.push(row);
          metricChild.children.map((item) => {
            const row = [
              {},
              {
                text: item.label,
              },
              {
                text: this.extractValueMetric(item),
                style: 'value',
              },
            ];
            target.push(row);
          });
        } else {
          const row = [
            {
              text: metricChild.label.startsWith('Nhà mạng')
                ? `${metricGroup.no}.${index + 1}. ${metricChild.label}`
                : metricChild.label,
              style: metricChild.label.startsWith('Nhà mạng') ? 'title' : '',
            },
            {},
            {
              text: this.extractValueMetric(metricChild),
              style: 'value',
            },
          ];
          target.push(row);
        }
      });
    }
  }

  generatePDF() {
    this.userKpi.map((group: Metric) => {
      if (group?.value) {
        const row = [
          { text: `${group.no}. ${group.label}`, style: 'title' },
          {},
          {
            text: group?.unit
              ? `${group.value} - ${group.unit}`
              : this.extractValueMetric(group),
            style: 'value',
          },
        ];
        this.rowsUserKpiTable.push(row);
      } else {
        const row = [
          { text: `${group.no}. ${group.label}`, style: 'title', colSpan: 3 },
          {},
          {},
        ];
        this.rowsUserKpiTable.push(row);
      }
      this.patchGroupChildren(group, this.rowsUserKpiTable);
    });

    this.systemKpi = this.systemKpi.map((group, index) => {
      return {
        ...group,
        no: group.no
          ? group.no + this.userKpi.length
          : index + 1 + this.userKpi.length,
      };
    });

    this.systemKpi.map((group: Metric) => {
      if (group?.value) {
        const row = [
          { text: `${group.no}. ${group.label}`, style: 'title' },
          {},
          {
            text: group?.unit
              ? `${group.value} - ${group.unit}`
              : this.extractValueMetric(group),
            style: 'value',
          },
        ];
        this.rowsSystemKpiTable.push(row);
      } else {
        const row = [
          { text: `${group.no}. ${group.label}`, style: 'title', colSpan: 3 },
          {},
          {},
        ];
        this.rowsSystemKpiTable.push(row);
      }
      this.patchGroupChildren(group, this.rowsSystemKpiTable);
    });

    const documentDefinition = {
      content: [
        {
          text: String(this.translate.instant('report.header')).toUpperCase(),
          style: 'header',
        },
        {
          text: `Từ ngày: ${this.formDate}    Đến ngày: ${this.toDate}`,
          style: 'subheader',
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                'Thời gian tổng hợp dữ liệu gần nhất',
                this.titleTable.thoi_gian_tong_hop_du_lieu_gan_nhat,
              ],
              [
                'Thời gian xuất dữ liệu',
                this.titleTable.thoi_gian_xuat_du_lieu,
              ],
              ['Người xuất', this.titleTable.nguoi_xuat],
            ],
          },
          layout: this.customLayout,
          margin: [0, 20, 0, 20], // margin: [trái, trên, phải, dưới]
        },
        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                {
                  text: 'Chỉ tiêu',
                  fillColor: '#348ae2',
                  colSpan: 2,
                },
                {},
                { text: 'Giá trị', fillColor: '#348ae2' },
              ],
              [{ text: 'A. User KPI', style: 'title', colSpan: 3 }, {}, {}],
              ...this.rowsUserKpiTable,
              [{ text: 'B. System KPI', style: 'title', colSpan: 3 }, {}, {}],
              ...this.rowsSystemKpiTable,
            ],
          },
          layout: this.customLayout,
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          textTransform: 'uppercase',
          alignment: 'center',
        },
        subheader: {
          fontSize: 12,
          italics: true,
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
        title: {
          bold: true,
        },
        value: {
          color: '#e21a1a',
        },
      },
    } as TDocumentDefinitions;

    pdfMake.createPdf(documentDefinition).download('KPI-Report.pdf');
  }

  async generateExcel() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('KPI Report');

    /* ---------- 1) TIÊU ĐỀ & SUBHEADER ---------- */
    ws.mergeCells('A1:C1');
    ws.getCell('A1').value = this.translate.instant('report.header').toUpperCase();
    ws.getCell('A1').font = { size: 16, bold: true };
    ws.getCell('A1').alignment = { horizontal: 'center' };

    ws.mergeCells('A2:C2');
    ws.getCell(
      'A2'
    ).value = `Từ ngày: ${this.formDate}    Đến ngày: ${this.toDate}`;
    ws.getCell('A2').font = { italic: true };
    ws.getCell('A2').alignment = { horizontal: 'center' };

    /* ---------- 2) BẢNG THÔNG TIN XUẤT ---------- */
    ws.addRow([]);
    const infoRows = [
      [
        'Thời gian tổng hợp dữ liệu gần nhất',
        '',
        this.titleTable.thoi_gian_tong_hop_du_lieu_gan_nhat,
      ],
      ['Thời gian xuất dữ liệu', '', this.titleTable.thoi_gian_xuat_du_lieu],
      ['Người xuất', '', this.titleTable.nguoi_xuat],
    ];
    infoRows.forEach((r) => {
      const row = ws.addRow(r);
      row.getCell(1).font = { bold: true }; // in đậm nhãn
      row.getCell(3).font = { bold: true }; // in đậm giá trị (số, text đều OK)
    });

    /* ---------- 3) HEADER KPI ---------- */
    ws.addRow([]);
    const headerRow = ws.addRow(['Chỉ tiêu', '', 'Giá trị']);
    headerRow.eachCell((c) => {
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      c.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF348AE2' },
      };
      c.alignment = { horizontal: 'center' };
    });
    ws.mergeCells(`A${headerRow.number}:B${headerRow.number}`);

    /* ---------- 4) SECTION A. USER KPI ---------- */
    const sectionA = ws.addRow(['A. User KPI']);
    sectionA.font = { bold: true };
    ws.mergeCells(`A${sectionA.number}:C${sectionA.number}`);

    responseData.data.userKpi.forEach((metric) =>
      this.flattenMetricExcelJS(ws, metric)
    );

    /* ---------- 5) SECTION B. SYSTEM KPI ---------- */
    if (this.systemKpi?.length) {
      ws.addRow([]);
      const sectionB = ws.addRow(['B. System KPI']);
      sectionB.font = { bold: true };
      ws.mergeCells(`A${sectionB.number}:C${sectionB.number}`);

      this.systemKpi.forEach((metric) => this.flattenMetricExcelJS(ws, metric));
    }

    /* ---------- 6) CỘT RỘNG + AUTO‑FIT CỘT B ---------- */
    ws.columns = [{ width: 60 }, { width: 5 }, { width: 30 }];
    ws.eachRow((r) => (r.alignment = { vertical: 'middle', wrapText: true }));

    // Auto‑fit cột B (index 2) cho vừa nội dung (nếu muốn)
    const colB = ws.getColumn(2);
    let maxLen = 5;
    colB.eachCell({ includeEmpty: true }, (cell) => {
      const v = cell.value as string | undefined;
      if (v) maxLen = Math.max(maxLen, v.length + 2);
    });
    colB.width = maxLen;

    /* ---------- 7) GHI FILE ---------- */
    const buf = await wb.xlsx.writeBuffer();
    FileSaver.saveAs(
      new Blob([buf]),
      `KPI-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  private flattenMetricExcelJS(
    ws: ExcelJS.Worksheet,
    metric: Metric,
    level = 0
  ) {
    const indent = '  '.repeat(level);
    const label = indent + metric.label;
    const value = metric.value ? this.extractValueMetric(metric) : '';

    const row = ws.addRow([label, '', value]);

    const hasNumberPrefix = /^\d/.test(metric.label.trim());
    if (hasNumberPrefix) {
      row.getCell(1).font = { bold: true };
    }

    if (metric.value) {
      row.getCell(3).font = { color: { argb: 'FFE21A1A' } };
    }

    if (level > 0) {
      row.outlineLevel = level;
    }

    metric.children?.forEach((child) =>
      this.flattenMetricExcelJS(ws, child, level + 1)
    );
  }
}
