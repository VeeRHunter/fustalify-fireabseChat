import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptOrNotInviteSentPage } from './accept-or-not-invite-sent';

@NgModule({
  declarations: [
    AcceptOrNotInviteSentPage,
  ],
  imports: [
    IonicPageModule.forChild(AcceptOrNotInviteSentPage),
  ],
})
export class AcceptOrNotInviteSentPageModule {}
