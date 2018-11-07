import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivateByCodePage } from './activate-by-code';

@NgModule({
  declarations: [
    ActivateByCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ActivateByCodePage),
  ],
})
export class ActivateByCodePageModule {}
