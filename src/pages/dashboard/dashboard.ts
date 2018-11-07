import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,LoadingController,ToastController,App  } from 'ionic-angular';
import { PersistenceService,BEService } from '../../app/services';
import { User } from '../../app/models';
import { FirstTimePage } from '../first-time/first-time';
import { SettingsTabPage } from '../settings-tab/settings-tab';
import { SelectSoccerFieldForEventUsingTabsPage } from '../select-soccer-field-for-event-using-tabs/select-soccer-field-for-event-using-tabs';
import { BasePage } from '../../app/BasePage';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage extends BasePage {

    user:User;

  constructor(public nav: NavController
  , public navParams: NavParams
  ,public events: Events
  ,public persistenceService : PersistenceService
           ,public beService: BEService
                  ,public loadingCtrl: LoadingController
                  ,public toastCtrl: ToastController
                  
                 ,public app: App
          ) {
      
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
       this.user = new User();
       this.events.publish('user:logged');
       this.persistenceService.getLoggedUser(this.existsUser.bind(this),this.notExistsUser.bind(this));
       
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }
  
  existsUser(remote) {
     console.log("siamo sulla dashboard :existsUser") ;
     console.log("qui utente vale") ;
     console.log(remote) ;
    this.user=remote;
    
  }
  notExistsUser() {
      console.log("siamo sulla dashboard :notExistsUser") ;
    this.navigateTo(FirstTimePage,{});
  }
  onAddEvent(){
      this.navigateTo(SelectSoccerFieldForEventUsingTabsPage,{});
  }
  onTrasport(){
      this.navigateTo(SettingsTabPage,{});
  }
  
  onSettings(){
      this.navigateTo(SettingsTabPage,{});
  }
  
  

}
