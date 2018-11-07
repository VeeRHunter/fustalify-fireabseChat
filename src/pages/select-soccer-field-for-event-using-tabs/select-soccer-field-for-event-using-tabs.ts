import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';
import { SelectSoccerFieldForEventPage } from '../select-soccer-field-for-event/select-soccer-field-for-event';
import { SelectSoccerFieldForEventUsingMapPage } from '../select-soccer-field-for-event-using-map/select-soccer-field-for-event-using-map';

import { PersistenceService,BEService } from '../../app/services';
import { BasePage } from '../../app/BasePage';

@IonicPage()
@Component({
  selector: 'page-select-soccer-field-for-event-using-tabs',
  templateUrl: 'select-soccer-field-for-event-using-tabs.html',
})
export class SelectSoccerFieldForEventUsingTabsPage  extends BasePage {

  map=SelectSoccerFieldForEventUsingMapPage;
  list=SelectSoccerFieldForEventPage;
  
  constructor(public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService : PersistenceService
           ,public beService : BEService       
            ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController  
                  ,public app: App
          ) {
      super(persistenceService,beService,loadingCtrl,toastCtrl,app);
  }

  ionViewDidLoad() {
    super.searchSoccerFields();
  }


   onTab(){
       console.log("onTab");
        //super.searchSoccerFields();
   }

//   onSearchSoccerFieldsSuccess(data){
//      super.onSearchSoccerFieldsSuccess(data);
//      console.log("onSearchSoccerFieldsSuccess");
//      console.log("soccerFields");
//      console.log(this.soccerFields);
//    }
//    onSearchSoccerFieldsFailure(err){
//      console.log("onSearchSoccerFieldsFailure");  
//    }
    
}
