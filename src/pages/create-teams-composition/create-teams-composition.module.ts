import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateTeamsCompositionPage } from './create-teams-composition';

@NgModule({
  declarations: [
    CreateTeamsCompositionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateTeamsCompositionPage),
  ],
})
export class CreateTeamsCompositionPageModule {}
