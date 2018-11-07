import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterWithEmailPage } from './register-with-email';

@NgModule({
  declarations: [
    RegisterWithEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterWithEmailPage),
  ],
})
export class RegisterWithEmailPageModule {}
