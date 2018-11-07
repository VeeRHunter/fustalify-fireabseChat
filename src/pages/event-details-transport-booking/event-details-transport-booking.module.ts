import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsTransportBookingPage } from './event-details-transport-booking';

@NgModule({
  declarations: [
    EventDetailsTransportBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsTransportBookingPage),
  ],
})
export class EventDetailsTransportBookingPageModule {}
