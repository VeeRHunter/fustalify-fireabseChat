import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController ,App} from 'ionic-angular';

import { AddOrEditMyTransportPage } from '../add-or-edit-my-transport/add-or-edit-my-transport';


import { UserTransportModel } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-my-transports',
  templateUrl: 'my-transports.html',
})
export class MyTransportsPage  extends BasePage {

  items : Array<UserTransportModel> = new Array<UserTransportModel>(); 
  
  constructor(public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService:PersistenceService
          ,public loadingCtrl: LoadingController
        ,public beService : BEService   
          ,public toastCtrl: ToastController
            ,public app: App) {
         super(persistenceService,beService,loadingCtrl,toastCtrl,app);
  }

  /**
   * 
   */
  ionViewDidLoad() {
    var self = this; 
    this.showLoading();
    this.beService.trasportsFindAll(function(remote){
        self.hideLoading();
        self.items = remote;
    },function(err){
        self.hideLoading();
        self.showToast("errore");
    });
    
    
  }
  
  onSelect(event,model){
      this.navigateTo(AddOrEditMyTransportPage,{model:model});
  }
  onAdd(){
      var model = new UserTransportModel();
      model.id=0;
      this.navigateToPreserveBack(AddOrEditMyTransportPage,{model:model});
  }

}
