import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';


//Pagine
import { BasePage } from '../../app/BasePage';
import { MyEventsPage } from '../my-events/my-events';
import { BuyYourPartPage } from '../buy-your-part/buy-your-part';
//Altro
import { SoccerFieldModel,EventModel,IncomingUserInviteModel,SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService,UtilsService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-event-details-payment-summary',
  templateUrl: 'event-details-payment-summary.html',
})
export class EventDetailsPaymentSummaryPage   extends BasePage {
items : Array<IncomingUserInviteModel> = new Array<IncomingUserInviteModel>();
   model : SoccerFieldBookingModel = new SoccerFieldBookingModel();
  buyYourPartButtonEnabled : boolean = false;
  howInvitedButtonEnabled : boolean = false;
  totalPayed:number=0;
  totalLeft:number=0;
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
         
         if(!this.persistenceService.userHasPayedHisQuote(this.model)){
             this.buyYourPartButtonEnabled=true;
         }
         if(this.user.id==this.model.uid){
             this.howInvitedButtonEnabled=true;
         }
  }
  

   ionViewDidLoad() {
    this.showLoading();
    var self = this;
    
    this.totalPayed =0;
    this.totalLeft =this.model.amount;
    this.beService.findForBooking(this.model.id,function(data){
        console.log("findForBooking");
        console.log(data);
        var contacts = self.persistenceService.contactsOnDevice;
        for(var i=0;i<data.length;i++){
            var item = data[i];
            console.log("item");
            console.log(item);
            if(item.soccer_field_bought_at!=undefined && item.soccer_field_bought_at!=null){
                self.totalPayed+=parseFloat(item.soccer_field_bought_amount);
                self.totalLeft-=parseFloat(item.soccer_field_bought_amount);
                var invite = self.utilsService.makeIncomingUserInviteModelForFE(item,contacts);
                self.items.push(invite);
            }
            
        }
        self.hideLoading();
        
        
    },function(err){
        self.hideLoading();
        self.showToast("errore");
        
    });
  }
  
  buyYourPart() {
     this.navigateTo(BuyYourPartPage,{model:this.model});
  }

}
