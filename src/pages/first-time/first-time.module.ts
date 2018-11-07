import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstTimePage } from './first-time';

@NgModule({
  declarations: [
    FirstTimePage,
  ],
  imports: [
    IonicPageModule.forChild(FirstTimePage),
  ],
})
export class FirstTimePageModule {}
