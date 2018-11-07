import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FatalErrorUnknownPage } from './fatal-error-unknown';

@NgModule({
  declarations: [
    FatalErrorUnknownPage,
  ],
  imports: [
    IonicPageModule.forChild(FatalErrorUnknownPage),
  ],
})
export class FatalErrorUnknownPageModule {}
