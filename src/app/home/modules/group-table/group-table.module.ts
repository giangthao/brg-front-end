import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';
import { GroupTableComponent } from './group-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [GroupTableComponent],
  imports: [ShareModule, NgxDatatableModule],
  exports: [GroupTableComponent, ShareModule],
})
export class GroupTableModule {}
