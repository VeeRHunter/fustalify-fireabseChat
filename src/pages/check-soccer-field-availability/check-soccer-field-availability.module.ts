import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckSoccerFieldAvailabilityPage } from './check-soccer-field-availability';

@NgModule({
  declarations: [
    CheckSoccerFieldAvailabilityPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckSoccerFieldAvailabilityPage),
  ],
})
export class CheckSoccerFieldAvailabilityPageModule {}
