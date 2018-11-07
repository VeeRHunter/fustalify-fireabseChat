import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App  } from 'ionic-angular';
//Pagine
import { DashboardPage } from '../dashboard/dashboard';
import { ActivateByCodePage } from '../activate-by-code/activate-by-code';
import { RegisterWithFbPage } from '../register-with-fb/register-with-fb';
import { RegisterWithPhonePage } from '../register-with-phone/register-with-phone';


//altro
import { PersistenceService,BEService } from '../../app/services';
import { BasePage } from '../../app/BasePage';
import { User } from '../../app/models';
/**
 * Generated class for the RegisterWithEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-with-email',
  templateUrl: 'register-with-email.html',
})
export class RegisterWithEmailPage extends BasePage {

  
  constructor(public nav: NavController
  , public navParams: NavParams
  ,public persistenceService : PersistenceService
          ,public beService: BEService
          ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
                  ,public app: App
          ) {
      super(persistenceService,beService,loadingCtrl,toastCtrl,app);
      this.user = new User();
  }

  register() {
    this.user.loginWith= "email"; 
    this.user.email= this.user.username;
    
    this.beService.newUser(this.user,this.onBESuccess.bind(this),this.onBEFailure.bind(this));
    
    //super.register(this.user,this.ifUserSaved.bind(this),this.ifErrorOnSaveUser.bind(this));
    
     
  }
  private onBESuccess(remote){
      console.log("onBESuccess");
      console.log(remote);
      this.user.id = remote.id;
      
      super.register(this.user,this.ifUserSaved.bind(this),this.ifErrorOnSaveUser.bind(this));
  }
  private onBEFailure(){
      alert("errore");
  }
  
  ifUserSaved(){
      var self = this;
       self.navigateTo(ActivateByCodePage,{watching_for_code:false});
  }
  ifErrorOnSaveUser(){
       alert("errore");
  }
  skip(){
      this.navigateTo(ActivateByCodePage,{watching_for_code:false});
  }
  
  registerWithFB(){
      this.navigateTo(RegisterWithFbPage,{});
  }
  
  registerWithPhone(){
      this.navigateTo(RegisterWithPhonePage,{watching_for_code:false});
  }
}
