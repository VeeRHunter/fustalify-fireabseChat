import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { MyEventsPage } from '../my-events/my-events';
//Altro
import { SoccerFieldModel,EventModel,SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';

//Terze parti
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';


@IonicPage()
@Component({
  selector: 'page-buy-your-part',
  templateUrl: 'buy-your-part.html',
})
export class BuyYourPartPage  extends BasePage {
    
    
  model : SoccerFieldBookingModel = new SoccerFieldBookingModel();
 
  constructor( public navCtrl: NavController
              , public navParams: NavParams
               ,public beService: BEService
               ,public persistenceService : PersistenceService
               ,public loadingCtrl: LoadingController
               ,public toastCtrl: ToastController
        , private payPal: PayPal
            ,public app: App) {
        super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.model  = this.navParams.get("model") as SoccerFieldBookingModel;
  }

  confirm() {
    var self = this;
    this.showLoading();
    this.beService.setBoughtMock(this.user.id,this.model.id,function(data){
        
         self.hideLoading();
         self.showToast("Pagamento completato");
          self.navigateTo(MyEventsPage,{});
    }
    ,function(err){
         self.hideLoading();
         self.showToast("Errre");
    });
  
  }
  
   confirmPaypal() {
    var self = this;
    this.showLoading();
    var amount = this.model.amount / (this.model.invites.length!=0 ? this.model.invites.length:1);
    this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'AQmaxXPcWZkf4Qa4H4tr1sb6IhPjvrRYRml4shSSVgIOy3DthOGVZWvvqoR4jHSojGO2gbr_RPVV00Ac'
      }).then(() => {
          self.hideLoading();
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {
          let payment = new PayPalPayment(""+amount, 'EUR', 'Pagamento quota partita di calcetto', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then(() => {
              
              self.showToast("Pagamento completato");
                
            // Successfully paid

            // Example sandbox response
            //
            // {
            //   "client": {
            //     "environment": "sandbox",
            //     "product_name": "PayPal iOS SDK",
            //     "paypal_sdk_version": "2.16.0",
            //     "platform": "iOS"
            //   },
            //   "response_type": "payment",
            //   "response": {
            //     "id": "PAY-1AB23456CD789012EF34GHIJ",
            //     "state": "approved",
            //     "create_time": "2016-10-03T13:33:33Z",
            //     "intent": "sale"
            //   }
            // }
          }, () => {
              self.hideLoading();
              self.showToast("Errore1");
            // Error or render dialog closed without being successful
          });
        }, () => {
            self.hideLoading();
            self.showToast("Errore2");
          // Error in configuration
        });
      }, () => {
          self.hideLoading();
          self.showToast("Errore3");
        // Error in initialization, maybe PayPal isn't supported or something else
      });

  
  }
  
  undo(){
     this.showLoading();
     this.showToast("Pagamento annullato");
     
  }

}
