import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDisabledPage } from './user-disabled';

@NgModule({
  declarations: [
    UserDisabledPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDisabledPage),
  ],
})
export class UserDisabledPageModule {}
