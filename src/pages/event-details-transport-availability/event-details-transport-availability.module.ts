import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsTransportAvailabilityPage } from './event-details-transport-availability';

@NgModule({
  declarations: [
    EventDetailsTransportAvailabilityPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsTransportAvailabilityPage),
  ],
})
export class EventDetailsTransportAvailabilityPageModule {}
