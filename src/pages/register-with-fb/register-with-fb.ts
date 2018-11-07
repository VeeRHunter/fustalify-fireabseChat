import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController ,App,Events } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { SettingsTabPage } from '../settings-tab/settings-tab';
import { BasePage } from '../../app/BasePage';
import { PersistenceService,FBService,BEService } from '../../app/services';
import { User } from '../../app/models';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
/**
 * Generated class for the RegisterWithFbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-with-fb',
  templateUrl: 'register-with-fb.html',
})
export class RegisterWithFbPage extends BasePage {
   
  
   
  constructor(
            public nav: NavController
            ,public navParams: NavParams
            ,public persistenceService : PersistenceService
            ,private fb: Facebook
            ,private fbService : FBService
            ,public beService : BEService
            ,public loadingCtrl: LoadingController
            ,public toastCtrl: ToastController
            ,public app: App
            ,public events: Events
            ) {
     super(persistenceService,beService,loadingCtrl,toastCtrl,app);
     
     this.user = new User();
     this.user.loginWith= "fb"; 
    
    
  }

  
  onSubmit() {
     
      var self = this;
      
      this.fb.login(['email'])
  .then((res: FacebookLoginResponse) => {
      console.log('Logged into Facebook!', res);
      console.log(res);
      var authResponse = res.authResponse;
      //console.log(res.authResponse);
      //self.user.loginWith= "fb"; 
      self.user.accessToken= authResponse.accessToken;
      self.user.expiresIn= authResponse.expiresIn;
      self.user.fb_id= authResponse.userID;
      self.user.username= authResponse.userID;
     
      console.log("self.user");
    console.log(self.user);
    
       self.fbService.getProfile(authResponse,self.ifProfileExists.bind(self),self.ifProfileNotExists.bind(self));
       //super.register("fb",authResponse.accessToken,authResponse.expiresIn);
       //super.register(user);
       
     
      })
  .catch(e => console.log('Error logging into Facebook', e));


    // this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);

     
  }
  ifProfileExists(profile){
      console.log("ifProfileExists");
      console.log(profile);
     this.user.email= profile.email; 
     this.user.name= profile.name;
     console.log("inizio registrzione");
     console.log(this.user);
     //super.register(this.user,this.ifUserSaved.bind(this),this.ifErrorOnSaveUser.bind(this));
     this.showLoading();
     this.beService.newUser(this.user,this.onBESuccess.bind(this),this.onBEFailure.bind(this));
     
     
    
  }
  ifProfileNotExists(err){
       this.showGenericError();
  }
  ifUserSaved(){
     this.hideLoading();
     var self = this;
     console.log("ifUserSaved");
     console.log("this.user");
     console.log(this.user);
     this.events.publish('user:logged');
     self.navigateTo(SettingsTabPage,{});
       
//      this.beService.newUser(this.user,function(data){
//            console.log("data");
//            console.log(data);
//            self.nav.setRoot(DashboardPage);
//            console.log("navigo verso dash");
////            self.storage.set('user',user);
////            cbOnSuccess();
//        },function(err){
////            cbOnFailure();
//        });
//        
  }
  ifErrorOnSaveUser(){
       this.hideLoading();
       this.showGenericError();
       //Cancellare utente remoto
  }
  
  
  onBESuccess(remote){
     var self = this;
     console.log("onBESuccess");
     console.log("this.user");
     console.log(this.user);
     this.user.id = remote.id;
     super.register(this.user,this.ifUserSaved.bind(this),this.ifErrorOnSaveUser.bind(this));
  }
  
  private onBEFailure(){
     this.hideLoading();
     this.showGenericError();
     
  }
}
