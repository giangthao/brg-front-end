import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';
import { MapOfflineComponent } from './map-offline.component';

@NgModule({
  declarations: [MapOfflineComponent],
  imports: [ShareModule],
  exports: [MapOfflineComponent, ShareModule],
})
export class MapOfflineModule {}
