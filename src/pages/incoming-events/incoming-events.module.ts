import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomingEventsPage } from './incoming-events';

@NgModule({
  declarations: [
    IncomingEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(IncomingEventsPage),
  ],
})
export class IncomingEventsPageModule {}
