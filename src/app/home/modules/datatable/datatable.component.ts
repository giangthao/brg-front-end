import { Component } from '@angular/core';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent {
  columns = [
    { name: 'STT', prop: 'stt', width: 50 },
    { prop: 'leaId', name: 'LEA ID', minWidth: 200, flexGrow: 2 },
    { prop: 'countryCode', name: 'Country Code', minWidth: 250, flexGrow: 1 },
    { prop: 'status', name: 'Status', width: 280 },
    { prop: 'createdBy', name: 'Created By', width: 150 },
    { prop: 'createdAt', name: 'Created At', width: 180 },
    { prop: 'updatedBy', name: 'Updated By', width: 150 },
    { prop: 'updatedAt', name: 'Updated At', width: 180 },
    { name: 'Action', prop: 'action', width: 180 },
  ];

  rows = [
    {
      leaId: 'LEA001',
      countryCode: 'VN',
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-12-01',
      updatedBy: 'admin',
      updatedAt: '2024-12-15',
    },
    {
      leaId: 'LEA002',
      countryCode: 'US',
      status: 'inactive',
      createdBy: 'john',
      createdAt: '2024-12-02',
      updatedBy: 'john',
      updatedAt: '2024-12-20',
    },
  ];

  edit(row: any) {
    console.log('Edit:', row);
  }

  delete(row: any) {
    console.log('Delete:', row);
  }
}
