import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatOneToOnePage } from './chat-one-to-one';
import { Network } from '@ionic-native/network';
@NgModule({
  declarations: [
    ChatOneToOnePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatOneToOnePage),
  ],
  providers: [
      Network
  ]
})
export class ChatOneToOnePageModule {}
