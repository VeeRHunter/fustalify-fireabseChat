import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,Tab,App } from 'ionic-angular';

import { SoccerFieldModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';
import { BasePage } from '../../app/BasePage';
import { ProfilePage } from '../profile/profile';
import { SettingsPrivacyPage } from '../settings-privacy/settings-privacy';
import { SettingsPaypalPage } from '../settings-paypal/settings-paypal';

import { MyTransportsPage } from '../my-transports/my-transports';

@IonicPage()
@Component({
  selector: 'page-settings-tab',
  templateUrl: 'settings-tab.html',
})
export class SettingsTabPage  extends BasePage {

  profileTab=ProfilePage;
  transportsTab=MyTransportsPage;
  paymentSettingsTab=SettingsPaypalPage;
  privacySettingsTab=SettingsPrivacyPage;
  selectedIndex:number=0;
  
   constructor(public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService : PersistenceService
           ,public beService : BEService   
           ,public app: App
            ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
          ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
  }

 onTab(tab:Tab) {
    this.selectedIndex = tab.index;
    
  }

}
