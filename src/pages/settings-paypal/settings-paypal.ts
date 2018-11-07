import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController } from 'ionic-angular';


import { FirstTimePage } from '../first-time/first-time';


import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-settings-paypal',
  templateUrl: 'settings-paypal.html',
})
export class SettingsPaypalPage extends BasePage {

    constructor(
          public navCtrl: NavController
         ,public navParams: NavParams
         ,public persistenceService : PersistenceService
         ,public beService:BEService
         ,public loadingCtrl: LoadingController
         ,public toastCtrl: ToastController
         ,public app: App
         ,private alertCtrl: AlertController
        ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
       
  }


  save() {
    var self = this;  
    this.showLoading();
    this.beService.updatePaypalEmail(
                this.user.id
                ,this.user
                ,function(data){
                        self.persistenceService.user = data;
						self.persistenceService.saveUser(self.persistenceService.user,function(){
						
										self.hideLoading();
										self.showToast("Dati salvati");						
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
    
    
    
    
  }


}
