import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactDetailsWhenInBookingPage } from './contact-details-when-in-booking';

@NgModule({
  declarations: [
    ContactDetailsWhenInBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactDetailsWhenInBookingPage),
  ],
})
export class ContactDetailsWhenInBookingPageModule {}
