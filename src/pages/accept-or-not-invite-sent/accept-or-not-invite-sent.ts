import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { SelectContactForComposePlayerTeamPage } from '../select-contact-for-compose-player-team/select-contact-for-compose-player-team';
import { EventSummaryPage } from '../event-summary/event-summary';
import { AddNotesForEventPage } from '../add-notes-for-event/add-notes-for-event';
import { InvitedToEventsPage } from '../invited-to-events/invited-to-events';
import { BuyYourPartPage } from '../buy-your-part/buy-your-part';

//Altro
import { SoccerFieldModel,EventsModel,EventModel,FriendModel,IncomingUserInviteModel,SoccerFieldBookingModel,UserInviteModel } from '../../app/models';
import { PersistenceService,BEService,UtilsService } from '../../app/services';



@IonicPage()
@Component({
  selector: 'page-accept-or-not-invite-sent',
  templateUrl: 'accept-or-not-invite-sent.html',
})
export class AcceptOrNotInviteSentPage  extends BasePage {

  item : IncomingUserInviteModel;
  constructor(public navCtrl: NavController
            , public navParams: NavParams
                     ,public persistenceService:PersistenceService
                  ,public beService: BEService
                  ,public loadingCtrl: LoadingController
                  ,public toastCtrl: ToastController
                  ,public utilsService:UtilsService
                 ,public app: App
                ) {
            super(persistenceService,beService,loadingCtrl,toastCtrl,app);	
            this.item  = this.navParams.get("item") as IncomingUserInviteModel;
  }

  accept() {
    var self = this;  
    this.showLoading();
    var booking = self.item.booking;
    console.log(self.item.booking);
    var eventModel = new SoccerFieldBookingModel();
    eventModel.id=booking.id;
    eventModel.sfid=booking.sfid;
    eventModel.uid=booking.uid;
    eventModel.name=booking.name;
    eventModel.notes=booking.notes;
    //eventModel.event_date = new Date();
//    if(1==1)
//        return;
    this.beService.setAcceptInvite(this.item.id,function(data){
        
        self.beService.findBooking(booking.id,function(bookingData){
            console.log("bookingData");
            console.log(bookingData);
            var localEvent =  new SoccerFieldBookingModel();
            localEvent.id=bookingData.id;
            localEvent.sfid=bookingData.sfid;
            localEvent.uid=bookingData.uid;
            localEvent.name=bookingData.name;
            localEvent.notes=bookingData.notes;
            localEvent.booked_at = new Date(bookingData.booked_at);
            localEvent.amount = bookingData.amount;
            localEvent.from_time = bookingData.from_time;
            localEvent.invites= new Array<UserInviteModel>();
            var invites = bookingData.invites;
            for(var i=0;i<invites.length;i++){
                var invite = invites[i];
                var fm = new UserInviteModel();
                fm.friend_phone=invite.friend_phone;
                fm.friend_is_accepted=invite.friend_is_accepted;
                localEvent.invites.push(fm);
            }
            
             self.persistenceService.saveEvent(localEvent
              ,function(data){
                    self.hideLoading();
                    self.showToast("Hai accettato l'invito");
                    self.navigateTo(BuyYourPartPage,{model:self.item.booking});


              },function(err){
                  
                  self.hideLoading();
                  self.showToast("errore");
                  
              });
              
        },function(err){
             self.hideLoading();
                  self.showToast("errore");
        });
        
        
         
//              
//         self.hideLoading();
//         self.showToast("Hai accettato l'invito");
//          self.navCtrl.setRoot(BuyYourPartPage,{model:this.item.booking});
    },function(err){
        self.hideLoading();
        self.showToast("errore");
        self.navigateTo(InvitedToEventsPage,{});
    });
  }
  notAccept() {
    var self = this;    
    this.showLoading();
     this.beService.setNotAcceptInvite(this.item.id,function(data){
         self.hideLoading();
         self.showToast("Hai rifiutato l'invito");
         self.navigateTo(InvitedToEventsPage,{});
    },function(err){
        self.hideLoading();
        self.showToast("errore");
         self.navigateTo(InvitedToEventsPage,{});
    });
  }
  

}
