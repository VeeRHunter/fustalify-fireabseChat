import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,App } from 'ionic-angular';

import { UserTransportBookingModel,User } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService,UtilsService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-transport-booking-requests',
  templateUrl: 'transport-booking-requests.html',
})
export class TransportBookingRequestsPage  extends BasePage {

  items : Array<UserTransportBookingModel> = new Array<UserTransportBookingModel>();
  user : User;
  constructor(
          public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService:PersistenceService
          ,public loadingCtrl: LoadingController
          ,public beService : BEService   
          ,public toastCtrl: ToastController
          ,public utilsService : UtilsService
                    ,public app: App
                  ) {
         super(persistenceService,beService,loadingCtrl,toastCtrl,app);
         this.user = this.persistenceService.user;
         this.loaded=false;
  }

 ionViewDidLoad() {
    this.onLoad();
  }
  
 onLoad() {
    var self = this;
    this.showLoading();
    this.beService.transportsBookingAsCarrierOrPassenger(function(remote){
        self.hideLoading();
        self.items = [];
        console.log("remote");
        console.log(remote);
        var contacts = self.persistenceService.contactsOnDevice;
        for(var i=0;i<remote.length;i++){
            var item  = remote[i];
            var phone = "";
            if(item.uid_carrier==self.user.id){
                phone = item.passenger.phone;
            } else{
                phone = item.carrier.phone;
            }
            item.name = "Sconosciuto";
            for(var j=0;j<contacts.length;j++){
              if(self.utilsService.phoneSanitize(contacts[j].mainPhone)==self.utilsService.phoneSanitize(phone)){
                  item.name = contacts[j].contact.displayName;
                  break;
              }
             }
            self.items.push(item);
            self.loaded=true;
        }
    },function(err){
        self.hideLoading();
        self.showToast("errore");
        self.loaded=true;
    })
    
    
  }
  
  onAccept(item) {
   var self = this;
     self.showLoading();
      this.beService.setAcceptTransportBooking(item.id,function(remote){
          self.hideLoading();
          self.showToast("Hai accettato di dare un passaggio");
          self.onLoad();
          
      },function(err){
          self.hideLoading();
          self.showGenericError();
      });
  }
  onDecline(item){
     var self = this;
     self.showLoading();
      this.beService.setNotAcceptTransportBooking(item.id,function(remote){
          self.hideLoading();
          self.showToast("Hai rifiutato di dare un passaggio");
          self.onLoad();
          
      },function(err){
          self.hideLoading();
          self.showGenericError();
      });
     
    
     
  }
  

}
