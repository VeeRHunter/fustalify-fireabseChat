import { Component } from '@angular/core';
import { NavController, LoadingController,ToastController,App } from 'ionic-angular';
import { IonicPage, NavParams } from 'ionic-angular';
import { PersistenceService,BEService,UtilsService } from '../../app/services';
import { EventsModel,EventModel,SoccerFieldBookingModel,SoccerFieldBookingModelExtend,UserInviteModel } from '../../app/models';
import { SelectSoccerFieldForEventPage } from '../select-soccer-field-for-event/select-soccer-field-for-event';
import { SelectSoccerFieldForEventUsingMapPage } from '../select-soccer-field-for-event-using-map/select-soccer-field-for-event-using-map';
import { SelectSoccerFieldForEventUsingTabsPage } from '../select-soccer-field-for-event-using-tabs/select-soccer-field-for-event-using-tabs';
import { ProfilePage } from '../profile/profile';
import { EventDetailsPage } from '../event-details/event-details';
import { BasePage } from '../../app/BasePage';

import { EventDetailsTabPage } from '../event-details-tab/event-details-tab';


@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage extends BasePage {

   items:Array<SoccerFieldBookingModelExtend> = new Array<SoccerFieldBookingModelExtend>();
   incoming:boolean=false;
    loading: any;
  constructor(public nav: NavController
  , public navParams: NavParams
  ,public persistenceService:PersistenceService
          ,public loadingCtrl: LoadingController
        ,public beService : BEService   
          ,public toastCtrl: ToastController     
          ,public app: App
          ,public utilsService: UtilsService
            ) {
      super(persistenceService,beService,loadingCtrl,toastCtrl,app);
      this.incoming  = this.navParams.get("incoming") as boolean;
      if(this.incoming){
          console.log("incoming");
      } else {
          console.log("not incoming");
      }
      
      this.items = new Array<SoccerFieldBookingModelExtend>();
      this.loading = this.loadingCtrl.create();
      
  }


  ionViewDidLoad() {
    this.loading.present();
    if(!this.incoming ){
        this.persistenceService.getMyEvents(this.ifItemsExists.bind(this),this.ifItemsNotExists.bind(this));
    } else {
        this.persistenceService.getInvitedToEvents(this.ifItemsExists.bind(this),this.ifItemsNotExists.bind(this));
    }
    
    
    
  }
  
  ifItemsExists(items) {
     var self = this;
    
        console.log("items prima di ordinamento");
        console.log(items);
    items.sort(function(a, b){
        if(a.booked_at==b.booked_at)return 0;
        return a.booked_at<b.booked_at?-1:1;
    }); 
    console.log("items dopo di ordinamento");
    console.log(items);
    
    this.beService.getOutgoingStatusUserInvites(this.user.id,function(remote){
        console.log("remote");
        console.log(remote);
        var bookingIds = [];
        var bookingRemoteData = [];
        var iof=-1; 
        var key="";
        for(var i=0;i<remote.length;i++){
             console.log("remote[i]");
        console.log(remote[i]);
        
        
              key = remote[i].sfbid + "-" + self.utilsService.phoneSanitize(remote[i].friend_phone);
              
              bookingRemoteData.push(remote[i]);
              bookingIds.push(key);
              
              
              
              
        }
        console.log("bookingRemoteData");
        console.log(bookingRemoteData);
        
        console.log("bookingIds");
        console.log(bookingIds);
        
           self.items = [];
        for(var i=0;i<items.length;i++){
            console.log("items[i]");  
            console.log(items[i]);  
            iof = bookingIds.indexOf(items[i].id);
            
            var newItem :SoccerFieldBookingModelExtend = new SoccerFieldBookingModelExtend();
            newItem.amount=items[i].amount;
            newItem.id=items[i].id;
            newItem.sfid=items[i].sfid;
            newItem.booked_at=items[i].booked_at;
            newItem.from_time=items[i].from_time;
            newItem.to_time=items[i].to_time;
            newItem.uid=items[i].uid;
            newItem.status=items[i].status;
            newItem.name=items[i].name;
            newItem.notes=items[i].notes;
            newItem.invites=items[i].invites;
            newItem.invitesAccepted= new Array<UserInviteModel>();
            newItem.invitesDeclined= new Array<UserInviteModel>();
            newItem.invitesWaiting= new Array<UserInviteModel>();
            
            
            
                for(var x=0;x<items[i].invites.length;x++){
                    var friend_phone = self.utilsService.phoneSanitize(items[i].invites[x].friend_phone);
                    var key =  items[i].id + "-" + friend_phone;
                    var iof1 = bookingIds.indexOf(key);
                    if(iof1!=-1){
                        var update = bookingRemoteData[iof1];
                        items[i].invites[x].friend_is_accepted=update.friend_is_accepted;
                        if(update.friend_is_accepted==0 || update.friend_is_accepted==null){
                            newItem.invitesWaiting.push(items[i].invites[x]);
                        }
                        if(update.friend_is_accepted!=null && update.friend_is_accepted==1){
                             newItem.invitesAccepted.push(items[i].invites[x]);
                        }
                        if(update.friend_is_accepted!=null &&  update.friend_is_accepted==2){
                            newItem.invitesDeclined.push(items[i].invites[x]);
                        }
                        
                    }
                
                }
                
             newItem.countInvitesNotSent =   newItem.invites.length-  newItem.invitesAccepted.length-newItem.invitesDeclined.length-newItem.invitesWaiting.length;
             

           // items[i].booked_at_as_human = this.utilsService.dateTimeToHumanFromDateAndTimeAsString(items[i].booked_at,items[i].from_time);
            newItem.booked_at_as_human = self.utilsService.dateToHuman(items[i].booked_at) + " "+  self.utilsService.timeToHuman(items[i].from_time);
            console.log(newItem);  
            self.items.push(newItem);
            //self.persistenceService.updateEvent(items[i]);
        }
         
        self.persistenceService.updateEvents(items,function(){
            self.loading.dismiss();
        },function(){
            self.loading.dismiss();
        });
    },function(err){
          self.loading.dismiss();
    });  
      
  
    
    
    
    
    
  }
  ifItemsNotExists() {
    this.loading.dismiss();
    
  }
  
  
  /**
   * <p>Naviga verso pagina di aggiunta evento</p>
   */
   doAdd() {
       
      let nav = this.app.getRootNav();
      
      
    //this.nav.push(SelectSoccerFieldForEventPage);
    if(this.persistenceService.userHasNameSurnameAndPlayerRoleAndPhone()){
        nav.setRoot(SelectSoccerFieldForEventUsingTabsPage);
    } else {
        this.showToast("Completa il tuo profilo");
        nav.setRoot(ProfilePage);
        
    }
    
    
  }
  
   onSelect(event,model) {
      let nav = this.app.getRootNav();
      nav.setRoot(EventDetailsTabPage,{model:model});
      
  }
  
}
