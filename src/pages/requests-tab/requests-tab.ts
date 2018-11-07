import { Component } from '@angular/core';
import { App,IonicPage, NavController, NavParams,LoadingController,ToastController,Tab } from 'ionic-angular';

import { SoccerFieldModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';
import { BasePage } from '../../app/BasePage';

import { InvitedToEventsPage } from '../invited-to-events/invited-to-events';
import { TransportBookingRequestsPage } from '../transport-booking-requests/transport-booking-requests';


@IonicPage()
@Component({
  selector: 'page-requests-tab',
  templateUrl: 'requests-tab.html',
})
export class RequestsTabPage  extends BasePage {

  invitedToEventsTab=InvitedToEventsPage;
  transportsBookingTab=TransportBookingRequestsPage;
  selectedIndex:number=0;
  
  constructor(public navCtrl: NavController
          ,public navParams: NavParams
          ,public persistenceService : PersistenceService
          ,public beService : BEService   
          ,public app: App
          ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
            
          ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
       var selectedIndex    = this.navParams.get("selectedIndex") as number;
       if(selectedIndex!=undefined && selectedIndex!=null){
           this.selectedIndex=selectedIndex;
       }
       
  }
 onTab(tab:Tab) {
    this.selectedIndex = tab.index;
    
  }

}
