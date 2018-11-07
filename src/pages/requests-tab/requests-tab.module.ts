import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestsTabPage } from './requests-tab';

@NgModule({
  declarations: [
    RequestsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestsTabPage),
  ],
})
export class RequestsTabPageModule {}
