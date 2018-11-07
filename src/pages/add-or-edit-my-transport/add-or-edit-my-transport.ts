import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,App } from 'ionic-angular';

import { MyTransportsPage } from '../my-transports/my-transports';

import { UserTransportModel } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-add-or-edit-my-transport',
  templateUrl: 'add-or-edit-my-transport.html',
})
export class AddOrEditMyTransportPage   extends BasePage {

  model: UserTransportModel= new UserTransportModel();
  isNewRecord: boolean = true;
  constructor(
          public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService:PersistenceService
          ,public loadingCtrl: LoadingController
            ,public beService : BEService   
          ,public toastCtrl: ToastController
            ,public app: App
            ) {
         super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.model  = this.navParams.get("model") as UserTransportModel;
        this.model.uid_carrier=this.persistenceService.user.id;
        this.isNewRecord = (this.model.id==0);
  }

  onSubmit() {
    var self = this;
    this.showLoading();  
    this.beService.trasportsInsertOrUpdate(this.model,function(remote){
        self.hideLoading();
        self.showToast("Dati salvati");
        self.navigateTo(MyTransportsPage,{});
        
    },function(err){
        self.hideLoading();
        self.showToast("Errore");

    
    });
  }

}
