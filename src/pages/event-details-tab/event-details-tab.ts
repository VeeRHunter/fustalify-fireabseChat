import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { MyEventsPage } from '../my-events/my-events';
import { BuyYourPartPage } from '../buy-your-part/buy-your-part';
import { EventDetailsPage } from '../event-details/event-details';
import { EventDetailsInvitedPage } from '../event-details-invited/event-details-invited';
import { EventDetailsPaymentSummaryPage } from '../event-details-payment-summary/event-details-payment-summary';


//Altro
import { SoccerFieldModel,EventModel,SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-event-details-tab',
  templateUrl: 'event-details-tab.html',
})
export class EventDetailsTabPage extends BasePage {
  model : SoccerFieldBookingModel = new SoccerFieldBookingModel();
  tabPayVisible:boolean = false;
  
  details=EventDetailsPage;
  invited=EventDetailsInvitedPage;
  pay=EventDetailsPaymentSummaryPage;
  
  
  constructor(
          public navCtrl: NavController
              , public navParams: NavParams
               ,public beService: BEService
               ,public persistenceService : PersistenceService
               ,public loadingCtrl: LoadingController
               ,public toastCtrl: ToastController
                ,public app: App                       
                       ) {
              super(persistenceService,beService,loadingCtrl,toastCtrl,app);
              this.model  = this.navParams.get("model") as SoccerFieldBookingModel;
          if(this.user.id!=this.model.uid){
             this.tabPayVisible=true;
         }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsTabPage');
  }
  onTab(){
       console.log("onTab");
        //super.searchSoccerFields();
   }
}
