import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,App } from 'ionic-angular';

//Pagine
import { RequestsTabPage } from '../requests-tab/requests-tab';
import { AddContactPage } from '../add-contact/add-contact';
import { ChatOneToOnePage } from '../chat-one-to-one/chat-one-to-one';

import { IncomingUserInviteModel,SoccerFieldBookingModel,UserTransportBookingModel,UserTransportModel,SelectedContactForEvent,MyContact } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService,UtilsService } from '../../app/services';





/**
 * Generated class for the ContactDetailsWhenInBookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-details-when-in-booking',
  templateUrl: 'contact-details-when-in-booking.html',
})
export class ContactDetailsWhenInBookingPage  extends BasePage {

   model:   IncomingUserInviteModel = new IncomingUserInviteModel();
   booking: SoccerFieldBookingModel = new SoccerFieldBookingModel();
   transports : Array<UserTransportModel> = new Array<UserTransportModel>();
   buttonsEnabled = {chat: true,phone:true,request:false,vote:true};
   request: UserTransportBookingModel = new UserTransportBookingModel();
   selectedUserId:number;
   
   constructor(
            public navCtrl: NavController, public navParams: NavParams
            ,public persistenceService:PersistenceService
            ,public loadingCtrl: LoadingController
            ,public beService : BEService   
            ,public toastCtrl: ToastController
            ,public app: App
            ,public utilsService: UtilsService
           ) {
         super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.model    = this.navParams.get("model") as IncomingUserInviteModel;
        this.booking  = this.navParams.get("booking") as SoccerFieldBookingModel;
        console.log("this.booking");
        console.log(this.booking);
        var booked_at_as_yyyymmdd = utilsService.dateOrStringToYYYYMMDD(this.booking.booked_at);
        var now_as_yyyymmdd = utilsService.dateOrStringToYYYYMMDD(new Date());
        console.log("booked_at_as_yyyymmdd");
        console.log(booked_at_as_yyyymmdd);
        console.log(now_as_yyyymmdd);
        
        if(parseInt(now_as_yyyymmdd)>parseInt(booked_at_as_yyyymmdd)){
            this.buttonsEnabled.vote=true;
            this.buttonsEnabled.request=false;
        } else {
            
            this.buttonsEnabled.vote=false;
            this.buttonsEnabled.request=true;
            
        }
        
        
        
         
  }


  ionViewDidLoad() {
   this.selectedUserId = this.user.id!=this.model.friend_uid ? this.model.friend_uid : this.model.uid_from;
   var self = this;
   self.showLoading();
   this.beService.trasportsOfUserFindAll(this.selectedUserId,function(remote){
       console.log(remote);
       self.transports = remote;
       //self.buttonsEnabled.request=true;
       self.hideLoading();
       
   },function(err){
       self.hideLoading();
       self.showGenericError();
   });
  }
  

  onChat() {
    var myContact = new  MyContact();
    myContact.phone=this.model.friend_phone;
    var contact = this.persistenceService.getContactByPhone(this.model.friend_phone);
    this.navigateToPreserveBack(ChatOneToOnePage,{model:contact});
  }
  onPhoneCall() {
    
  }
 
  onRequestTransport() {
    var self = this;
    this.showLoading();
    this.request.sfbid=this.booking.id;
    this.request.uid_carrier=this.selectedUserId;
    this.request.uid_passenger=this.persistenceService.user.id;
    this.beService.trasportsBookingInsertOrUpdate(this.request,function(remote){
        self.hideLoading();
        self.showToast("richiesta inviata");
        self.navigateTo(RequestsTabPage,{selectedIndex:1});
    },function(err){
        
        self.hideLoading();
        self.showGenericError();
        
    });
  }
  
  
  onVote() {
    var self = this;
    this.showLoading();
    this.beService.inviteSetVote(this.model,function(remote){
        self.hideLoading();
        self.showToast("Voto registrato");
        //self.navigateTo(RequestsTabPage,{selectedIndex:0});
    },function(err){
        
        self.hideLoading();
        self.showGenericError();
        
    });
  }
  
  doAdd(){
       
       this.navigateToPreserveBack(AddContactPage,{model:this.model});
  }
  
  
}
