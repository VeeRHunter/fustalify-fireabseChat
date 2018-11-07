import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController ,App,AlertController} from 'ionic-angular';

import { BasePage } from '../../app/BasePage';
import { DashboardPage } from '../dashboard/dashboard';
import { ActivateByCodePage } from '../activate-by-code/activate-by-code';

import { PersistenceService,BEService,UtilsService } from '../../app/services';
import { User } from '../../app/models';
/**
 * Generated class for the RegisterWithPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-with-phone',
  templateUrl: 'register-with-phone.html',
})
export class RegisterWithPhonePage extends BasePage {
   
  phone:string; 
  constructor(public nav: NavController, public navParams: NavParams
  ,public persistenceService : PersistenceService
   ,public beService: BEService      
           ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
                   ,public app: App
       ,private alertCtrl: AlertController
               ,private utilsService: UtilsService
           ) {
     super(persistenceService,beService,loadingCtrl,toastCtrl,app);
     this.user = new User();
  }

  register() {
    var self            = this;
    this.user.loginWith = "phone"; 
    var phone           = this.phone;
    this.user.phone     = this.user.username = this.utilsService.phoneSanitize(this.phone);
    
    let alert = this.alertCtrl.create({
               title: 'Conferma numero di telefono',
               message: "Il numero digitato è " + phone+", ti vuoi registrare con questo numero?",
               buttons: [
                 {
                   text: 'Annulla',
                   role: 'cancel',
                   handler: () => {

                   }
                 },
                 {
                   text: 'Lo confermo',
                   handler: () => {
                       
                     self.showLoading();
                     
                     self.beService.newUser(self.user,self.ifUserSaved.bind(self),self.ifErrorOnSaveUser.bind(self));

                     //super.register(self.user,self.ifUserSaved.bind(self),self.ifErrorOnSaveUser.bind(self));
                     
                   }
                 }
               ]
             });
             alert.present();
             
             
    
    
    
  }
 ifUserSaved(remote){
     
     console.log("remote");
     console.log(remote);
     
      var self = this;
      self.hideLoading();
      
      
      super.register(remote,function(data){
          console.log("registrato localmente");
           console.log(data);
            self.navigateTo(ActivateByCodePage,{watching_for_code:true});
        },function(err){
            self.showGenericError();
 
        });
      
      
//      this.beService.newUser(this.user,function(data){
//            self.navigateTo(ActivateByCodePage,{watching_for_code:true});
//        },function(err){
//            self.showGenericError();
// 
//        });
        
    //this.nav.setRoot(DashboardPage);
  }
  ifErrorOnSaveUser(){
      this.hideLoading();
      this.showGenericError();
  }
  skip(){
      this.navigateTo(ActivateByCodePage,{watching_for_code:false});
  }
}
