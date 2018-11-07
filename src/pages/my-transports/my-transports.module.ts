import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTransportsPage } from './my-transports';

@NgModule({
  declarations: [
    MyTransportsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTransportsPage),
  ],
})
export class MyTransportsPageModule {}
