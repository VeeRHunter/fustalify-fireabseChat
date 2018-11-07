import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsTabPage } from './events-tab';

@NgModule({
  declarations: [
    EventsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsTabPage),
  ],
})
export class EventsTabPageModule {}
