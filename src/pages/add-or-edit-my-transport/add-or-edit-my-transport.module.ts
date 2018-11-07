import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddOrEditMyTransportPage } from './add-or-edit-my-transport';

@NgModule({
  declarations: [
    AddOrEditMyTransportPage,
  ],
  imports: [
    IonicPageModule.forChild(AddOrEditMyTransportPage),
  ],
})
export class AddOrEditMyTransportPageModule {}
