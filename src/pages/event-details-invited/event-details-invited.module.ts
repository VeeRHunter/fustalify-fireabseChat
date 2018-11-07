import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsInvitedPage } from './event-details-invited';

@NgModule({
  declarations: [
    EventDetailsInvitedPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsInvitedPage),
  ],
})
export class EventDetailsInvitedPageModule {}
