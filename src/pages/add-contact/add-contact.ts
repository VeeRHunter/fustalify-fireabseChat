import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController } from 'ionic-angular';



import { BasePage } from '../../app/BasePage';
import { PersistenceService,BEService } from '../../app/services';
import { UserInviteModel,IncomingUserInviteModel } from '../../app/models';

import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
@IonicPage()
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactPage extends BasePage {

   name:string;
   userInviteModel:IncomingUserInviteModel;
   constructor(
          public navCtrl: NavController
         ,public navParams: NavParams
         ,public persistenceService : PersistenceService
         ,public beService:BEService
         ,public loadingCtrl: LoadingController
         ,public toastCtrl: ToastController
         ,public app: App
         ,private alertCtrl: AlertController
         ,private contacts: Contacts
        ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
       this.userInviteModel  = this.navParams.get("model") as IncomingUserInviteModel;
       
     
  }
 save() {
    var self = this;  
    
    var contact = this.contacts.create();
    contact.displayName = this.name;
    
    
    var contactfield = new ContactField();
    contactfield.type = "home";
    contactfield.value = this.userInviteModel.friend_phone;
    contactfield.pref = true;
    
     var numbersection = [];
      numbersection.push(contactfield);
      contact.phoneNumbers = numbersection;
      this.showLoading();
      contact.save().then((contact) => {
          self.hideLoading();
          self.showToast("Contatto aggiunto");	
          
      }, (error) => {
          self.hideLoading();
        self.showToast("Contatto non aggiunto");	
      });
      
      
      
    
    
    
    
    
  }

}
