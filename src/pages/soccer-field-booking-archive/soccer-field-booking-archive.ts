import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController } from 'ionic-angular';


import { FirstTimePage } from '../first-time/first-time';
import { EventDetailsTabPage } from '../event-details-tab/event-details-tab';


import { BasePage } from '../../app/BasePage';
import { SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-soccer-field-booking-archive',
  templateUrl: 'soccer-field-booking-archive.html',
})
export class SoccerFieldBookingArchivePage extends BasePage {

    items : Array<SoccerFieldBookingModel> = new Array<SoccerFieldBookingModel>();
   constructor(
          public navCtrl: NavController
         ,public navParams: NavParams
         ,public persistenceService : PersistenceService
         ,public beService:BEService
         ,public loadingCtrl: LoadingController
         ,public toastCtrl: ToastController
         ,public app: App
         ,private alertCtrl: AlertController
        ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
       this.loaded=false;
   
  }

  ionViewDidLoad() {
    this.showLoading();
    this.beService.getArchivedBooking(this.ifItemsExists.bind(this),this.ifItemsNotExists.bind(this));
  }
  
  private ifItemsExists(items) {
    console.log(items);
    this.showToast("sono arrivati "+ items.length+" elementi");
    this.items = items;
    this.loaded=true;
//    
//    this.items = [];
//    for(var i=0;i<items.length;i++){
//        items[i].booked_at_as_human = this.utilsService.dateTimeToHumanFromDateAndTimeAsString(items[i].booked_at,items[i].from_time);
//         
//        this.items.push(items[i]);
//    }
//    
    
    this.hideLoading();
    
  }
  private ifItemsNotExists() {
    this.hideLoading();
    this.loaded=true;
    
  }
   onSelect(event,model) {
     
      this.navigateTo(EventDetailsTabPage,{model:model});
      
  }

}
