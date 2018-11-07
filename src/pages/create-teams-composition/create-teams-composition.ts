import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController } from 'ionic-angular';
import { TeamsCompositionPage } from '../teams-composition/teams-composition';

import { SoccerFieldModel,EventModel,SoccerFieldBookingModel } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-create-teams-composition',
  templateUrl: 'create-teams-composition.html',
})
export class CreateTeamsCompositionPage extends BasePage {

    model : SoccerFieldBookingModel = new SoccerFieldBookingModel();
    id:number;
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
       this.id  = this.navParams.get("model") as number;
       this.model.id=this.id;
       console.log(this.model);
      
  }

  onComposeRandom() {
    this.showLoading();  
    var self = this;  
    this.beService.composeTeamsRandom(this.model,function(remote){
        self.hideLoading();
        self.showToast("Dati salvati");
         self.navigateTo(TeamsCompositionPage,{model:remote.id});
    },function(err){
        self.hideLoading();
        self.showGenericError();
    });
    
  }
}
