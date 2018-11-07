import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvitedToEventsPage } from './invited-to-events';

@NgModule({
  declarations: [
    InvitedToEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(InvitedToEventsPage),
  ],
})
export class InvitedToEventsPageModule {}
