import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamsCompositionPage } from './teams-composition';

@NgModule({
  declarations: [
    TeamsCompositionPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamsCompositionPage),
  ],
})
export class TeamsCompositionPageModule {}
