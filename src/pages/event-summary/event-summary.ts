import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController  } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { EventsTabPage } from '../events-tab/events-tab';
import { CreateTeamsCompositionPage } from '../create-teams-composition/create-teams-composition';
//Altro
import { SoccerFieldModel,EventModel,SoccerFieldBookingModel,MyContact } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-event-summary',
  templateUrl: 'event-summary.html',
})
export class EventSummaryPage  extends BasePage {

  selectedEvent :SoccerFieldBookingModel = new SoccerFieldBookingModel();
  ignoreSoccerFieldAmount:boolean=false;
  constructor(  
                public navCtrl: NavController
              , public navParams: NavParams
               ,public beService: BEService
               ,public persistenceService : PersistenceService
               ,public loadingCtrl: LoadingController
               ,public toastCtrl: ToastController
            ,public app: App
                    ,private alertCtrl: AlertController
                ) {
            super(persistenceService,beService,loadingCtrl,toastCtrl,app);
            this.selectedEvent=this.persistenceService.selectedEvent;
            console.log("this.selectedEvent");
            console.log(this.selectedEvent);
            this.ignoreSoccerFieldAmount=false;
  }

  onConfirm() {
     
     var self = this;
     self.persistenceService.selectedEvent.uid = self.user.id;
     self.persistenceService.selectedEvent.sfid = self.persistenceService.selectedSoccerField.id;
     var isUnmanaged = self.selectedSoccerField.uid==undefined || self.selectedSoccerField.uid==null || self.selectedSoccerField.uid==0;
     
     
     if(isUnmanaged){
         //campo non gestito
         if(!self.ignoreSoccerFieldAmount){

            //Qui l'utente hai indicato che conosce ed ha indicato il costo del campo 
            let alert = this.alertCtrl.create({
               title: 'Conferma prezzo del campo',
               message: 'Confermi l\'importo di '+self.selectedEvent.amount+' euro; come costo del campo?',
               buttons: [
                 {
                   text: 'Annulla',
                   role: 'cancel',
                   handler: () => {
                        self.hideLoading();
                   }
                 },
                 {
                   text: 'Lo confermo',
                   handler: () => {

                     self.showLoading();
                     self.beService.newBooking(self.persistenceService.selectedEvent,self.onBookingSuccess.bind(self),self.onBookingFailure.bind(self));
                   }
                 }
               ]
             });
             alert.present();
             return;
         } else {
             
            //Qui l'utente hai indicato che non sa il costo del campo 
            self.selectedEvent.amount=0;
            self.beService.newBooking(self.persistenceService.selectedEvent,self.onBookingSuccess.bind(self),self.onBookingFailure.bind(self));
             return;
         }
         
     }
	 
        
     
     self.beService.newBooking(self.persistenceService.selectedEvent,self.onBookingSuccess.bind(self),self.onBookingFailure.bind(self));
        
    
  }
  
  onUnConfirm() {
  
    this.showToast("Prenotazione annullata");
    this.navigateTo(EventsTabPage,{}); 
    
  }
  
  onBookingSuccess(remote) {
      console.log("remote");
      console.log(remote);
      var self = this;
      var userPhone = this.user.phone;
      this.persistenceService.selectedEvent.id=remote.id;
      this.persistenceService.selectedEvent.uid=remote.uid;
      this.persistenceService.selectedEvent.amount=remote.amount;
      console.log(this.persistenceService.selectedEvent);
      console.log(this.persistenceService.selectedEvent);
      this.persistenceService.saveEvent(this.persistenceService.selectedEvent
              ,function(data){
                  var model = self.persistenceService.selectedEvent;
                  
                  //self.navigateTo(CreateTeamsCompositionPage,{model:remote.id}); 
                  //Salvo in locale gli amici
                  var mycontacts : Array<MyContact> = new Array<MyContact>();
                  for(var i=0;i<self.persistenceService.selectedContacts.length;i++){
                      var mycontact = new MyContact();
                      mycontact.name=self.persistenceService.selectedContacts[i].contact.displayName;
                      mycontact.phone=self.persistenceService.selectedContacts[i].mainPhone;
                      if(mycontact.phone!=userPhone){
                          mycontacts.push(mycontact);
                      }
                      
                  }
                  self.persistenceService.insertOrUpdateMyContacts(mycontacts,function(local){
                      self.persistenceService.clearAddEventSession();
                      self.hideLoading();
                      self.showToast("Evento creato");
                      self.navigateTo(EventsTabPage,{}); 
                  },function(){
                      self.persistenceService.clearAddEventSession();
                      self.hideLoading();
                      self.showGenericError();
                      self.navigateTo(EventsTabPage,{}); 
                  });
                  
                  

              },function(err){
                  
                  
                  self.persistenceService.clearAddEventSession();
                  self.hideLoading();
                  self.showToast("Si è verificato un errore");
                  self.navigateTo(EventsTabPage,{}); 
                  
              });
      
  }
  onBookingFailure() {
      this.persistenceService.clearAddEventSession();
       this.hideLoading();
       
       this.showToast("Si è verificato un errore");
  }
  
  
}
