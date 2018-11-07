import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComposePlayerTeamPage } from './compose-player-team';

@NgModule({
  declarations: [
    ComposePlayerTeamPage,
  ],
  imports: [
    IonicPageModule.forChild(ComposePlayerTeamPage),
  ],
})
export class ComposePlayerTeamPageModule {}
