import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterWithFbPage } from './register-with-fb';

@NgModule({
  declarations: [
    RegisterWithFbPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterWithFbPage),
  ],
})
export class RegisterWithFbPageModule {}
