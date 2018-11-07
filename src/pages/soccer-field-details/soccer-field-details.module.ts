import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoccerFieldDetailsPage } from './soccer-field-details';

@NgModule({
  declarations: [
    SoccerFieldDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SoccerFieldDetailsPage),
  ],
})
export class SoccerFieldDetailsPageModule {}
