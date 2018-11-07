import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController,ToastController,App   } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
//Pagine
import { BasePage } from '../../app/BasePage';
import { DashboardPage } from '../dashboard/dashboard';
import { ProfilePage } from '../profile/profile';
import { RegisterWithPhonePage } from '../register-with-phone/register-with-phone';

//Altro
import { BEService,PersistenceService } from '../../app/services';
import { User } from '../../app/models';
declare var SMS:any;
/**
 * Generated class for the ActivateByCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activate-by-code',
  templateUrl: 'activate-by-code.html',
})
export class ActivateByCodePage extends BasePage {

  activaction_code:string="";
  watching_for_code:boolean=false;
  constructor(
                public nav: NavController
                ,public navParams: NavParams
                ,public beService: BEService
                ,public persistenceService : PersistenceService
                ,public androidPermissions: AndroidPermissions
                ,public platform:Platform
                ,public loadingCtrl: LoadingController
                ,public toastCtrl: ToastController
                ,public app: App
           ) {
           super(persistenceService,beService,loadingCtrl,toastCtrl,app);
           this.watching_for_code = this.navParams.get("watching_for_code") as boolean;
            
            
  }



    onStartWathcing()
    {
        var self=this;
        console.log('onStartWathcing');
        this.platform.ready().then((readySource) => {
        console.log('onStartWathcing ready');

        if(SMS) SMS.startWatch(()=>{
                   console.log('watching started');
                }, Error=>{
               console.log('failed to start watching');
           });

          document.addEventListener('onSMSArrive', (e:any)=>{
               console.log('onSMSArrive');
               console.log(e);
               console.log(e.data);
               
               var sms = e.data;
               console.log(sms);
               var address = sms.address;
               var body = sms.body;
               if(address=="+393286362847"){
                    self.beService.activate(body
                        ,self.onSuccess.bind(self)
                        ,self.onFailure.bind(self) );

               }
               

               });

            });
    }

    ionViewWillEnter()
    {
        console.log("ionViewWillEnter");
        var self = this;
        if(self.watching_for_code){
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
              success => {
                  
                  self.onStartWathcing();
                  
              },
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
            );

            this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
        
        }

        
    }

  onSubmit() {
    this.beService.activate(this.activaction_code
    ,this.onSuccess.bind(this)
    ,this.onFailure.bind(this) );
  }
  private onSuccess(data){
      console.log("onSuccess");
     console.log(data);
     var self = this;
//     var remoteUser = data;
//     this.user = new User();
//     this.user.id = remoteUser.id;
//     this.user.email = remoteUser.email;
//     this.user.username = remoteUser.username;
//     this.user.loginWith = remoteUser.login_with;
//     this.user.name = remoteUser.name==null ? remoteUser.email : remoteUser.name;
      self.navigateTo(ProfilePage,{});
//     
//     this.persistenceService.saveUser(this.user,function(user){
//         self.navigateTo(ProfilePage,{});
//     },function(err){
//         alert("errore");
//     });
//     
     
    
  }
  private onFailure(err){
      alert("codice non valido");
  }
  
  onBackToRegisterUsingPhone(){
      this.navigateTo(RegisterWithPhonePage,{});
  }
  
  
}
