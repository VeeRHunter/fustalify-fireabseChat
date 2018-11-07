import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNotesForEventPage } from './add-notes-for-event';

@NgModule({
  declarations: [
    AddNotesForEventPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNotesForEventPage),
  ],
})
export class AddNotesForEventPageModule {}
