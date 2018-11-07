import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyEventsPage } from '../my-events/my-events';
import { EventsModel,EventModel,FriendModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';
@IonicPage()
@Component({
  selector: 'page-invite-to-my-event',
  templateUrl: 'invite-to-my-event.html',
})
export class InviteToMyEventPage {

  model :FriendModel;
  event : EventModel; 
  terminate:boolean = false;
   
  constructor(public navCtrl: NavController
  , public navParams: NavParams
  ,private persistenceService:PersistenceService
          ,private beService:BEService
          ) {
      this.model = new FriendModel();
      this.event = this.navParams.get("event") as EventModel;
      
  }

  inviteAndTerminate() {
    this.terminate=true;
    this.inviteAndAddOrTerminate();
    
  }
  inviteAndAdd() {
    this.terminate=false;
    this.inviteAndAddOrTerminate();
    
  }
  
  inviteAndAddOrTerminate() {
    
    this.event.friends.push(this.model);
    console.log("this.event");
    console.log(this.event);
    this.persistenceService.updateEvent(this.event,this.ifInviteSuccess.bind(this),this.ifInviteFailure.bind(this));
    
  }
  
  ifInviteSuccess() {
    if(this.terminate){
        this.beService.newBooking(this.event,this.onBookingSuccess.bind(this),this.onBookingFailure.bind(this));
          
    }  else {
        this.model = new FriendModel();
        alert("Invito inviato");
    
    }
  }
  
  ifInviteFailure() {
    alert("errore");
  }
  onBookingSuccess() {
        this.navCtrl.push(MyEventsPage); 
  }
  onBookingFailure() {
       alert("errore");
  }
    
}
