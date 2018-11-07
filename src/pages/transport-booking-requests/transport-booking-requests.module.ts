import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportBookingRequestsPage } from './transport-booking-requests';

@NgModule({
  declarations: [
    TransportBookingRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(TransportBookingRequestsPage),
  ],
})
export class TransportBookingRequestsPageModule {}
