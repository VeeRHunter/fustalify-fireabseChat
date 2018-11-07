import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectContactsForBookingPage } from './select-contacts-for-booking';

@NgModule({
  declarations: [
    SelectContactsForBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectContactsForBookingPage),
  ],
})
export class SelectContactsForBookingPageModule {}
