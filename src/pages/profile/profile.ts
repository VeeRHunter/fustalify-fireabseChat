import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController,Events } from 'ionic-angular';

import { FirstTimePage } from '../first-time/first-time';


import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage extends BasePage {

  availablePlayerRoles : any [];
  canChangePhone:boolean = true;
  
  constructor(
          public navCtrl: NavController
         ,public navParams: NavParams
         ,public persistenceService : PersistenceService
         ,public beService:BEService
         ,public loadingCtrl: LoadingController
         ,public toastCtrl: ToastController
         ,public app: App
         ,private alertCtrl: AlertController
         ,public events: Events
        ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
       this.availablePlayerRoles = this.persistenceService.playerRoles;
       var user = this.persistenceService.user;
       console.log("utente registrato");
       console.log(user);
       this.canChangePhone= (user.loginWith!='phone' && user.phone=='');
  }

  save() {
    this.showLoading();  
    var self = this;  
    if(self.user.phone==undefined || self.user.phone==null || self.user.phone==""){
        if(self.user.loginWith=='phone'){
            self.user.phone=self.user.username;
        }
    }
    this.beService.updateSetPhoneAndNameAndPlayerRoleURL(
                this.user.id
                ,this.user
                ,function(data){
                        console.log("dati salvati sul server");
                        console.log(data);
                        self.persistenceService.user = data;
						self.persistenceService.saveUser(self.persistenceService.user,function(){
                                                    self.hideLoading();
                                                    self.showToast("Dati salvati");
                                                    self.events.publish('user:logged');
                                                },function(){
							
						self.hideLoading();
						self.showToast("Dati non salvati");						
										
						});
						
                        
                        
                }
                ,function(){
                    console.log("dati non salvati sul server");
                    self.hideLoading();
                    self.showToast("Dati non salvati");
                }
            );  
      
//    this.persistenceService.saveUser(this.user,this.ifUserSaved.bind(this),this.ifErrorOnSaveUser.bind(this));
//    if(this.user.phone!=""){
//        this.beService.saveUser(this.user);
//        alert("Profilo salvato");
//       
//    }
    
    
  }
  
  ifUserSaved(){
    //this.navCtrl.setRoot(DashboardPage);
  }
  ifErrorOnSaveUser(){
       alert("errore");
  }
  
  removeAccount(){
      var self = this;
      let alert = this.alertCtrl.create({
               title: 'Conferma cancellazione account',
               message: "Sei sicuro di volere cancellare il tuo account?",
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
                     self.beService.removeAccount(function(){
                         self.hideLoading();
                         self.persistenceService.removeLoggedUser();
                         self.navigateTo(FirstTimePage,{});
                         
                     },function(){
                         self.hideLoading();
                         self.showGenericError();
                         
                     });
                   }
                 }
               ]
             });
             alert.present();
  }

}
