import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteToMyEventPage } from './invite-to-my-event';

@NgModule({
  declarations: [
    InviteToMyEventPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteToMyEventPage),
  ],
})
export class InviteToMyEventPageModule {}
