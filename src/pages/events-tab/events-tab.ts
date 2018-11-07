import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,Tab,App  } from 'ionic-angular';
//Pagine

import { MyEventsPage } from '../my-events/my-events';
import { IncomingEventsPage } from '../incoming-events/incoming-events';

//Altro
import { UserTransportModel } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';
/**
 * Generated class for the EventsTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events-tab',
  templateUrl: 'events-tab.html',
})
export class EventsTabPage  extends BasePage {
  outgoingTab=MyEventsPage;
  incomingTab=IncomingEventsPage;
  selectedIndex:number=0;
  incoming:boolean=false;
  
  constructor(
        public navCtrl: NavController, public navParams: NavParams
        ,public persistenceService:PersistenceService
        ,public loadingCtrl: LoadingController
        ,public beService : BEService   
        ,public toastCtrl: ToastController
,public app: App) 
 {
         super(persistenceService,beService,loadingCtrl,toastCtrl,app);
         this.selectedIndex  = this.navParams.get("selectedIndex") as number;
         if(this.selectedIndex==null) {
             this.selectedIndex=0;
         }
         this.incoming = (this.selectedIndex!=0);
             
  }

  onTab(tab:Tab) {
    console.log("onTab()");
    
    this.selectedIndex = tab.index;
    console.log("tab.index==>"+tab.index);
    this.incoming = (this.selectedIndex!=0);
  }

}
