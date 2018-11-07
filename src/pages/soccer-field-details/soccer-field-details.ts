import { Component } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App  } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//Pagine
import { BasePage } from '../../app/BasePage';
import { CheckSoccerFieldAvailabilityPage } from '../check-soccer-field-availability/check-soccer-field-availability';
//Altro
import { SoccerFieldModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';

@IonicPage()
@Component({
  selector: 'page-soccer-field-details',
  templateUrl: 'soccer-field-details.html',
})
export class SoccerFieldDetailsPage  extends BasePage {
  buttonsEnabled = {callPhone: false,openWebsite:false,sendEmail:false};
  constructor(
            public navCtrl: NavController
          , public navParams: NavParams
           ,public beService: BEService
           ,public persistenceService : PersistenceService
            ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
        ,public app: App
        ,private emailComposer: EmailComposer
         ,private callNumber: CallNumber
        ,public inAppBrowser: InAppBrowser
          ) {
      super(persistenceService,beService,loadingCtrl,toastCtrl,app);
      this.persistenceService.selectedSoccerField = this.selectedSoccerField  = this.navParams.get("soccerFieldModel") as SoccerFieldModel;
      var phone = this.persistenceService.selectedSoccerField.phone;
      var website = this.persistenceService.selectedSoccerField.website;
      var email = this.persistenceService.selectedSoccerField.email;
      this.buttonsEnabled.callPhone = phone!=undefined && phone!="";
      this.buttonsEnabled.openWebsite = website!=undefined && website!="";
      this.buttonsEnabled.sendEmail = email!=undefined && email!="";
      
      
  }

  onSubmit() {
    this.navigateTo(CheckSoccerFieldAvailabilityPage,{});
    
  }
  openInAppBrowser(){
   var  website: string = this.persistenceService.selectedSoccerField.website;
    this.inAppBrowser.create(website, '_blank', "location=yes");
  }
  
   sendMail(){
     var to:string = this.persistenceService.selectedSoccerField.email; 
    //for more option please go here: http://ionicframework.com/docs/native/email-composer/
     let email = {
      to: to,
      subject: 'Richiesta informazioni',
      body: "Salve vorrei informazioni sui campi"
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }
  onPhoneCall() {
      var phone = this.persistenceService.selectedSoccerField.phone;
      if(phone==undefined || phone==""){
          this.showToast("il numero fornito dal gestore non è corretto,impossibile effettuare la chiamata");
          return;
      }
      this.callNumber.callNumber(phone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

      //this.onSubmitEnabled=true;
  }
}
