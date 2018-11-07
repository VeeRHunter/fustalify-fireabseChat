import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController ,App } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { SelectContactForComposePlayerTeamPage } from '../select-contact-for-compose-player-team/select-contact-for-compose-player-team';
import { EventSummaryPage } from '../event-summary/event-summary';
import { AddNotesForEventPage } from '../add-notes-for-event/add-notes-for-event';
import { AcceptOrNotInviteSentPage } from '../accept-or-not-invite-sent/accept-or-not-invite-sent';
import { EventDetailsPage } from '../event-details/event-details';
import { BuyYourPartPage } from '../buy-your-part/buy-your-part';

//Altro
import { SoccerFieldModel,EventsModel,EventModel,FriendModel,IncomingUserInviteModel,SoccerFieldBookingModel,UserInviteModel } from '../../app/models';
import { PersistenceService,BEService,UtilsService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-invited-to-events',
  templateUrl: 'invited-to-events.html',
})
export class InvitedToEventsPage  extends BasePage {

  items : Array<IncomingUserInviteModel> = new Array<IncomingUserInviteModel>();
 
  constructor(public navCtrl: NavController, public navParams: NavParams
   ,public persistenceService:PersistenceService
        ,public beService: BEService
        ,public loadingCtrl: LoadingController
        ,public toastCtrl: ToastController
        ,public utilsService:UtilsService
                ,public app: App
		) {
        super(persistenceService,beService,loadingCtrl,toastCtrl,app);	
       this.loaded=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitedToEventsPage');
    this.showLoading();
    var uid = this.persistenceService.user.id;
    this.beService.beGetIncomingRequestsUserInvites(uid,this.getIncomingUserInvitesOnSuccess.bind(this),this.getIncomingUserInvitesOnFailure.bind(this));
  }
  
  getIncomingUserInvitesOnSuccess(data) {
      this.hideLoading();
      console.log(data);
      var contacts = this.persistenceService.contactsOnDevice;
      for(var i=0;i<data.length;i++){
          var item = data[i];
          if(item.friend_phone!=this.user.phone){
            var invite = new IncomingUserInviteModel();
            invite.id = item.id;
            invite.invited_from_phone = item.friend_phone;
            invite.soccerField = item.soccerField;
            invite.playerRole = item.playerRole;
            invite.booking = item.booking;
            invite.friend_is_accepted = item.friend_is_accepted;
            invite.invited_from_name="Sconosciuto";
            for(var j=0;j<contacts.length;j++){
                if(this.utilsService.phoneSanitize(contacts[j].mainPhone)==this.utilsService.phoneSanitize(invite.invited_from_phone)){
                    invite.invited_from_name = contacts[j].contact.displayName;
                    break;
                }
            }

            this.items.push(invite);
          }
      }
      this.loaded=true;
      
  }
  
  getIncomingUserInvitesOnFailure() {
      this.hideLoading();
      this.showGenericError();
      this.loaded=true;
      
  }
  onSelect(event,model){
      if(model.friend_is_accepted==1){
          this.showToast("hai già accettato questo invito");
          this.navigateTo(EventDetailsPage,{item:model.booking});
          return;
      }
      if(model.friend_is_accepted==2){
          this.showToast("hai rifiutato questo invito");
          return;
      }
      
      this.navigateTo(AcceptOrNotInviteSentPage,{item:model});
  }
  
  
  onAccept(event,model) {
    var self = this;  
    this.showLoading();
    var booking = model.booking;
    var eventModel = new SoccerFieldBookingModel();
    eventModel.id=booking.id;
    eventModel.sfid=booking.sfid;
    eventModel.uid=booking.uid;
    eventModel.name=booking.name;
    eventModel.notes=booking.notes;

    this.beService.setAcceptInvite(model.id,function(data){
        
        self.beService.findBooking(booking.id,function(bookingData){
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
                    self.navigateTo(BuyYourPartPage,{model:model.booking});


              },function(err){
                  
                  self.hideLoading();
                  self.showGenericError();
                  
              });
              
        },function(err){
             self.hideLoading();
             self.showGenericError();
        });
        
        
         

    },function(err){
        self.hideLoading();
        self.showGenericError();
        self.navigateTo(InvitedToEventsPage,{});
    });
  }
  onDecline(event,model) {
    var self = this;    
    this.showLoading();
     this.beService.setNotAcceptInvite(model.id,function(data){
         self.hideLoading();
         self.showToast("Hai rifiutato l'invito");
         self.navigateTo(InvitedToEventsPage,{});
    },function(err){
        self.hideLoading();
        self.showGenericError();
        self.navigateTo(InvitedToEventsPage,{});
    });
  }
  
  
  

}
