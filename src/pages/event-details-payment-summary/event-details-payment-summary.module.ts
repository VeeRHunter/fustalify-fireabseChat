import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsPaymentSummaryPage } from './event-details-payment-summary';

@NgModule({
  declarations: [
    EventDetailsPaymentSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsPaymentSummaryPage),
  ],
})
export class EventDetailsPaymentSummaryPageModule {}
