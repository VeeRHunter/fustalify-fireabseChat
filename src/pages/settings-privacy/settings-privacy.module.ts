import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPrivacyPage } from './settings-privacy';

@NgModule({
  declarations: [
    SettingsPrivacyPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPrivacyPage),
  ],
})
export class SettingsPrivacyPageModule {}
