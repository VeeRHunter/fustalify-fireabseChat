import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';
//Pagine
import { BasePage } from '../../app/BasePage';
import { EventSummaryPage } from '../event-summary/event-summary';

//Altro
import { SoccerFieldModel,EventsModel,EventModel,SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-add-notes-for-event',
  templateUrl: 'add-notes-for-event.html',
})
export class AddNotesForEventPage   extends BasePage {

  selectedEvent : SoccerFieldBookingModel = new SoccerFieldBookingModel();
  constructor(
                public navCtrl: NavController
                ,public navParams: NavParams
                ,public persistenceService:PersistenceService
                ,public beService: BEService
                ,public loadingCtrl: LoadingController
                ,public toastCtrl: ToastController
                ,public app: App

          ) {
      
        super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.selectedEvent = this.persistenceService.selectedEvent;
        
        console.log("this.persistenceService.selectedEvent");
      console.log(this.persistenceService.selectedEvent);
      
      
  }

  onForward() {
      this.persistenceService.selectedEvent=this.selectedEvent;
      console.log("this.persistenceService.selectedEvent");
      console.log(this.persistenceService.selectedEvent);
      this.navigateTo(EventSummaryPage,{});
  }

}
