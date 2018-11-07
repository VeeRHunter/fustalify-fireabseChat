import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,App } from 'ionic-angular';

import { UserTransportBookingModel } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-event-details-transport-booking',
  templateUrl: 'event-details-transport-booking.html',
})
export class EventDetailsTransportBookingPage   extends BasePage {

  constructor(
          public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService:PersistenceService
          ,public loadingCtrl: LoadingController
          ,public beService : BEService   
          ,public toastCtrl: ToastController
        ,public app: App
        ) {
         super(persistenceService,beService,loadingCtrl,toastCtrl,app);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsTransportBookingPage');
  }

}
