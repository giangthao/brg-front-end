import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';
import { MapOfflineComponent } from './map-offline.component';
import { AntenaControlComponent } from './antena-control/antena-control.component';

@NgModule({
  declarations: [MapOfflineComponent, AntenaControlComponent],
  imports: [ShareModule],
  exports: [MapOfflineComponent, ShareModule],
})
export class MapOfflineModule { }
