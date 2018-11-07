import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportBookingRequestAcceptOrDeclinePage } from './transport-booking-request-accept-or-decline';

@NgModule({
  declarations: [
    TransportBookingRequestAcceptOrDeclinePage,
  ],
  imports: [
    IonicPageModule.forChild(TransportBookingRequestAcceptOrDeclinePage),
  ],
})
export class TransportBookingRequestAcceptOrDeclinePageModule {}
