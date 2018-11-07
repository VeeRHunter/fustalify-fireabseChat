import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPaypalPage } from './settings-paypal';

@NgModule({
  declarations: [
    SettingsPaypalPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPaypalPage),
  ],
})
export class SettingsPaypalPageModule {}
