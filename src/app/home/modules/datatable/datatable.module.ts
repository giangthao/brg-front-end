import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share/share.module';
import { DatatableComponent } from './datatable.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [DatatableComponent],
  imports: [ShareModule, RouterModule, NgxDatatableModule],
  exports: [ShareModule, RouterModule],
})
export class DatatableModule {}
