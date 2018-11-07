import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';


//Pagine
import { PersistenceService,BEService } from '../../app/services';
import { User,SoccerFieldModel,EventModel,SelectedContactForEvent } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { ComposePlayerTeamPage } from '../compose-player-team/compose-player-team';

@IonicPage()
@Component({
  selector: 'page-select-contact-for-compose-player-team',
  templateUrl: 'select-contact-for-compose-player-team.html',
})
export class SelectContactForComposePlayerTeamPage  extends BasePage {

   items : Array<SelectedContactForEvent> = new Array<SelectedContactForEvent>();
   copyOfItems : Array<SelectedContactForEvent> = new Array<SelectedContactForEvent>();
   position:number;
  constructor(
              private contacts: Contacts
              ,public navCtrl: NavController
              ,public navParams: NavParams
              ,public loadingCtrl: LoadingController
              ,public toastCtrl: ToastController
              ,public persistenceService : PersistenceService
              ,public beService : BEService 
                      ,public app: App

            ) {
        super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.position  = this.navParams.get("position") as number;
        this.onLoad();
  }
  
  
  filterItems(ev: any) {
      
   this.items = this.copyOfItems;
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log("val");
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
         
    console.log(this.soccerFields.length);
      this.items = this.items.filter((item:SelectedContactForEvent) => {
          
        var keep = (item.contact.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
        return keep;
      });
    }
  }
  
  onLoad() {

    this.showLoading();
    var self = this;
    this.contacts.find(['*'], {filter: "", multiple: true,hasPhoneNumber : true})
    .then(data => 
            {
              //this.items = data;
              this.populateItemsFromContacts(data);
              this.hideLoading();
            }
    );
    
    
  }
  private populateItemsFromContacts(contactsFoundOnDevice) {
    for(var i=0;i<contactsFoundOnDevice.length;i++){
        var contactFoundOnDevice = contactsFoundOnDevice[i];
        var selectedContactForEvent = new SelectedContactForEvent(); 
        selectedContactForEvent.mainPhone=this.getMainPhoneForContact(contactFoundOnDevice);
        selectedContactForEvent.contact=contactFoundOnDevice;
        this.items.push(selectedContactForEvent);
        
    }
    
    this.items.sort(function(a,b) {
        return a.contact.displayName >= b.contact.displayName ? 1 : -1;
    });

    this.copyOfItems = this.items;
    
  }
  private getMainPhoneForContact(contact) {
    
    var ret="";
    var phones = contact.phoneNumbers;
    if(phones!=null){
          for(var j=0;j<phones.length;j++){
              return phones[j].value;
          } 
    }
    
    return ret;
     
  }
  
  onSelect(event,model) {
    this.showLoading();
    model.position=this.position;
    this.persistenceService.selectedContacts.push(model);
    this.navigateTo(ComposePlayerTeamPage,{});
    
    this.hideLoading();
    
    this.showToast("Hai selezionato " + model.contact.displayName);
  }

    onSelectMe(){

        this.showLoading();
        var me = new Contact();
        me.displayName="IO";
        var model = new SelectedContactForEvent();
        model.contact=me;
        model.mainPhone=this.user.phone;
        model.position=this.position;
        
        
        this.persistenceService.selectedContacts.push(model);
        this.navigateTo(ComposePlayerTeamPage,{});

        this.hideLoading();

        this.showToast("Hai selezionato te stesso");

    }

}
