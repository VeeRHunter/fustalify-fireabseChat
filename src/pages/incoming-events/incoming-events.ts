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
  selector: 'page-incoming-events',
  templateUrl: 'incoming-events.html',
})
export class IncomingEventsPage extends BasePage {

   //items:Array<SoccerFieldBookingModel> = new Array<SoccerFieldBookingModel>();
   items:Array<SoccerFieldBookingModelExtend> = new Array<SoccerFieldBookingModelExtend>();
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
    //  this.items = new Array<SoccerFieldBookingModel>();
      this.items = new Array<SoccerFieldBookingModelExtend>();
      
  }


  ionViewDidLoad() {
    var self = this;  
    this.showLoading();
    //this.persistenceService.getInvitedToEvents(this.ifItemsExists.bind(this),this.ifItemsNotExists.bind(this));
    this.beService.getIncomingUserInvites(this.user.id,this.ifItemsExists.bind(this),this.ifItemsNotExists.bind(this));
//    this.beService.getIncomingUserInvites(this.user.id
//    ,function(remote){
//         self.ifItemsExists(remote);
//         self.hideLoading();
//    },function(err){
//         self.hideLoading();
//    });
//    
//    
    
  }
  
  ifItemsExists(items) {
    console.log("ifItemsExists");
    console.log( "items");
    console.log( items.length);
    
    this.items = [];
    for(var i=0;i<items.length;i++){
        var item = items[i].booking;
        item.invites = items[i].invites;
        item.booked_at_as_human = this.utilsService.dateTimeToHumanFromDateAndTimeAsString(item.booked_at,item.from_time);
       item.invitesAccepted= new Array<UserInviteModel>();
       item.invitesDeclined= new Array<UserInviteModel>();
       item.invitesWaiting= new Array<UserInviteModel>();
       item.countInvitesNotSent=0;
            
        this.items.push(item);
    }
    
    console.log( this.items);
    
    this.hideLoading();
    
  }
  
  ifItemsExistsOld(items) {
    console.log("ifItemsExists");
    console.log( "items");
    console.log( items.length);
    
    this.items = [];
    for(var i=0;i<items.length;i++){
        items[i].booked_at_as_human = this.utilsService.dateTimeToHumanFromDateAndTimeAsString(items[i].booked_at,items[i].from_time);
         
        this.items.push(items[i]);
    }
    
    console.log( this.items);
    
    this.hideLoading();
    
  }
  
  ifItemsNotExists() {
    this.hideLoading();
    //this.doAdd();
  }
  
   doAdd() {
    //this.nav.push(SelectSoccerFieldForEventPage);
    if(this.persistenceService.userHasNameSurnameAndPlayerRoleAndPhone()){
        this.nav.push(SelectSoccerFieldForEventUsingTabsPage);
    } else {
        this.showToast("Completa il tuo profilo");
        this.nav.push(ProfilePage);
        
    }
    
    
  }
  
   onSelect(event,model) {
       
      this.navigateTo(EventDetailsTabPage,{model:model});
      
  }
  
}
