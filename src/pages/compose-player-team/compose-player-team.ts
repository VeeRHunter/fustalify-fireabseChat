import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { SelectContactForComposePlayerTeamPage } from '../select-contact-for-compose-player-team/select-contact-for-compose-player-team';
import { EventSummaryPage } from '../event-summary/event-summary';
import { AddNotesForEventPage } from '../add-notes-for-event/add-notes-for-event';

//Altro
import { SoccerFieldModel,EventsModel,EventModel,FriendModel,SoccerFieldBookingModel,UserInviteModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';


/**
 * Generated class for the ComposePlayerTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compose-player-team',
  templateUrl: 'compose-player-team.html',
})
export class ComposePlayerTeamPage  extends BasePage {

  selectedContacts: any = [];
  onSelectButtonEnabled:boolean = false;  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService:PersistenceService
        ,public beService: BEService
        ,public loadingCtrl: LoadingController
        ,public toastCtrl: ToastController
        ,public app: App
                
          ) {
      super(persistenceService,beService,loadingCtrl,toastCtrl,app);
      this.selectedContacts=this.persistenceService.selectedContacts;
      if(this.selectedContacts.length==10){
          this.onSelectButtonEnabled=true;
      }
     
  }

  onSelectPosition(position:number) {
    this.navigateTo(SelectContactForComposePlayerTeamPage,{position:position});  
   
  }

  onForward() {
     this.persistenceService.selectedEvent.invites = new Array<UserInviteModel>();
     
      console.log("this.selectedContacts");
      console.log(this.selectedContacts);
      
     for(var i=0;i<this.selectedContacts.length;i++){
            var newFriend = new UserInviteModel();
            newFriend.friend_phone=this.selectedContacts[i].mainPhone;
            newFriend.friend_is_accepted=0;
            this.persistenceService.selectedEvent.invites.push(newFriend);
     }
        
      console.log("this.persistenceService.selectedEvent");
      console.log(this.persistenceService.selectedEvent);
        
     this.navigateTo(AddNotesForEventPage,{});
 }
 
 onSelectPositionButtonEnabled(position:number) {
     var enabled : boolean = true;
     for(var i=0;i<this.selectedContacts.length;i++){
          if(this.selectedContacts[i].position==position){
              enabled=false;
              break;
          }
      }
      return enabled;
 }
 
}
