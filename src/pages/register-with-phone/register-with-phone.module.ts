import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterWithPhonePage } from './register-with-phone';

@NgModule({
  declarations: [
    RegisterWithPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterWithPhonePage),
  ],
})
export class RegisterWithPhonePageModule {}
