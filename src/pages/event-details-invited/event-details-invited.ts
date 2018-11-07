import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';


//Pagine
import { BasePage } from '../../app/BasePage';
import { MyEventsPage } from '../my-events/my-events';
import { BuyYourPartPage } from '../buy-your-part/buy-your-part';
import { ContactDetailsWhenInBookingPage } from '../contact-details-when-in-booking/contact-details-when-in-booking';
//Altro
import { SoccerFieldModel,EventModel,IncomingUserInviteModel,SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService,UtilsService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-event-details-invited',
  templateUrl: 'event-details-invited.html',
})
export class EventDetailsInvitedPage  extends BasePage {
  items : Array<IncomingUserInviteModel> = new Array<IncomingUserInviteModel>();
   model : SoccerFieldBookingModel = new SoccerFieldBookingModel();
  buyYourPartButtonEnabled : boolean = false;
  howInvitedButtonEnabled : boolean = false;
  
  constructor(
          public navCtrl: NavController
              , public navParams: NavParams
               ,public beService: BEService
               ,public persistenceService : PersistenceService
               ,public loadingCtrl: LoadingController
               ,public toastCtrl: ToastController
            ,public utilsService:UtilsService
            ,public app: App
                       ) {
                   
                   super(persistenceService,beService,loadingCtrl,toastCtrl,app);
          this.model  = this.navParams.get("model") as SoccerFieldBookingModel;
          
        
         if(this.user.id==this.model.uid){
             this.howInvitedButtonEnabled=true;
         }
  }

  ionViewDidLoad() {
    this.showLoading();
    var self = this;
    
    this.beService.findForBooking(this.model.id,function(data){
        console.log("findForBooking");
        console.log(data);
        var contacts = self.persistenceService.contactsOnDevice;
        self.model.invites = [];
        for(var i=0;i<data.length;i++){
            var item = data[i];
            var invite = self.utilsService.makeIncomingUserInviteModelForFE(item,contacts);
            if(self.user.phone!=invite.invited_from_phone){
                self.items.push(invite);
                
           }
           self.model.invites.push(item);
            
        }
        self.hideLoading();
        //self.model.invites = self.items;
        if(!self.persistenceService.userHasPayedHisQuote(self.model)){
             self.buyYourPartButtonEnabled=true;
        }
        self.persistenceService.updateEvent(self.model,function(savedData){},function(err){});
        
    },function(err){
        self.hideLoading();
        self.showToast("errore");
        
    });
  }


 buyYourPart() {
     this.navigateTo(BuyYourPartPage,{model:this.model});
  }
  
  onSelect(event,item) {
     this.navigateTo(ContactDetailsWhenInBookingPage,{model:item,booking:this.model});
  }
  
}
