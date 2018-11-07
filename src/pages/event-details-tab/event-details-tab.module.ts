import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsTabPage } from './event-details-tab';

@NgModule({
  declarations: [
    EventDetailsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsTabPage),
  ],
})
export class EventDetailsTabPageModule {}
