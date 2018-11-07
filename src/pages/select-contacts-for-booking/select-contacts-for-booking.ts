import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';


//Pagine
import { PersistenceService,BEService,UtilsService } from '../../app/services';
import { User,SoccerFieldModel,EventModel,SelectedContactForEvent,UserInviteModel,SoccerFieldBookingModelExtend,SoccerFieldBookingModel } from '../../app/models';
import { BasePage } from '../../app/BasePage';
import { ComposePlayerTeamPage } from '../compose-player-team/compose-player-team';
import { AddNotesForEventPage } from '../add-notes-for-event/add-notes-for-event';
import { EventDetailsPage } from '../event-details/event-details';

@IonicPage()
@Component({
  selector: 'page-select-contacts-for-booking',
  templateUrl: 'select-contacts-for-booking.html',
})
export class SelectContactsForBookingPage  extends BasePage {

 
   items : Array<SelectedContactForEvent> = new Array<SelectedContactForEvent>();
   copyOfItems : Array<SelectedContactForEvent> = new Array<SelectedContactForEvent>();
   buttonsEnabled = {forward: false};
   maxSelected:number=10;
   alreadyInList:any=[];
   model:SoccerFieldBookingModelExtend=null;//questa var è true quando l'utente deve inviare nuovi inviti
   source:SoccerFieldBookingModel=null;//questo è il modello da ridare indietro alla pagina eventdetail
   
  constructor(
              private contacts: Contacts
              ,public navCtrl: NavController
              ,public navParams: NavParams
              ,public loadingCtrl: LoadingController
              ,public toastCtrl: ToastController
              ,public persistenceService : PersistenceService
              ,public beService : BEService 
              ,public app: App
              ,public utilsService:UtilsService
              ,private alertCtrl: AlertController

            ) {
        super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.maxSelected  = this.navParams.get("maxSelected") as number;
        this.model  = this.navParams.get("model") as SoccerFieldBookingModelExtend;
        this.source  = this.navParams.get("source") as SoccerFieldBookingModel;
        if(this.maxSelected==null){
            this.maxSelected=10;
        }
        
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
    var excluded = [];  
    if(this.model!=null){
        for(var i=0;i<this.model.invites.length;i++){
            excluded.push(this.utilsService.phoneSanitize( this.model.invites[i].friend_phone));
            
        }
    }
    console.log("excluded");
    console.log(excluded);
    for(var i=0;i<contactsFoundOnDevice.length;i++)
    {
        var contactFoundOnDevice = contactsFoundOnDevice[i];
        var selectedContactForEvent = new SelectedContactForEvent(); 
        selectedContactForEvent.mainPhone=this.getMainPhoneForContact(contactFoundOnDevice);
        selectedContactForEvent.contact=contactFoundOnDevice;
        var iof = excluded.indexOf(this.utilsService.phoneSanitize(selectedContactForEvent.mainPhone));
        console.log("iof");
    console.log(iof);
        if(iof==-1){
            this.items.push(selectedContactForEvent);
            
        }
        
        
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
    
    return this.utilsService.phoneSanitize(ret);
     
  }
  private enableDisableButtons() {
     console.log("this.persistenceService.selectedContacts");
     console.log(this.persistenceService.selectedContacts);
     console.log("this.persistenceService.selectedContacts.length");
     console.log(this.persistenceService.selectedContacts.length);
     this.buttonsEnabled.forward=(this.persistenceService.selectedContacts.length==this.maxSelected);
      
  }
  onSelect(event,model) {
      var phone =this.utilsService.phoneSanitize(model.mainPhone);
      var iof = this.alreadyInList.indexOf(phone);
      console.log("iof");
      console.log(iof);
      console.log("model.mainPhone");
      console.log(model.mainPhone);
      
       if ( event.checked ) {
            
           if(iof==-1){
                this.persistenceService.selectedContacts.push(model);
                this.alreadyInList.push(phone);
            } else {
                this.showToast("Hai già selezionato un amico con questo numero");
            }
            
           //this.persistenceService.selectedContacts.push(model);
           
       }  else {
           let index = this.removeCheckedFromArray(model);
           
           this.persistenceService.selectedContacts.splice(index,1);
           if(iof!=-1){
                this.alreadyInList.splice(iof,1);
           }
       }
       this.enableDisableButtons();
  }
    
    
  removeCheckedFromArray(checkbox : SelectedContactForEvent) {
    return this.persistenceService.selectedContacts.findIndex((current)=>{
      return current.mainPhone === checkbox.mainPhone;
    })
  }
  
 

  onSelectMe(event){
      var phone = this.utilsService.phoneSanitize(this.user.phone);
          var me = new Contact();
                me.displayName="IO";
                var model = new SelectedContactForEvent();
                model.contact=me;
                model.mainPhone=this.user.phone;
                model.position=1;
        
        var iof = this.alreadyInList.indexOf(phone);
        if ( event.checked ) {
            if(iof==-1){
                this.persistenceService.selectedContacts.push(model);
                this.alreadyInList.push(phone);
            } else {
                this.showToast("Hai già selezionato un amico con questo numero");
            }
                


        } else {
            
           let index = this.removeCheckedFromArray(model);
         
           this.persistenceService.selectedContacts.splice(index,1);
            if(iof!=-1){
                this.alreadyInList.splice(iof,1);
            }
           this.persistenceService.selectedContacts.splice(index,1);
        }

         
        this.enableDisableButtons();
         
    }



  onForward(){
      var self = this;
      if(this.model!=null){
          
          let alert = this.alertCtrl.create({
               title: 'Conferma inviti',
               message: 'Vuoi veramente invitare i '+self.alreadyInList.length+' amici selezionati?',
               buttons: [
                 {
                   text: 'No',
                   role: 'cancel',
                   handler: () => {
                        
                   }
                 },
                 {
                   text: 'Si',
                   handler: () => {

                      //Manca la chiamata al backend
                        self.showLoading();
                        var input = {invites:self.alreadyInList};
                        self.beService.userInviteDeleteDeclinedAndReplaceWith(self.source.id,input,function(remote){
                            self.hideLoading();
                            self.navigateTo(EventDetailsPage,{model:self.source});
                        },function(){
                            self.hideLoading();
                            self.showGenericError();
                            //this.navigateTo(EventDetailsPage,{model:this.source});
                        });
                   }
                 }
               ]
             });
           alert.present();
           return;
             
        
          
      } else {
          this.persistenceService.selectedEvent.invites = new Array<UserInviteModel>();
     
//            console.log("this.selectedContacts");
//            console.log(this.persistenceService.selectedContacts);

           for(var i=0;i<this.persistenceService.selectedContacts.length;i++){
                  var newFriend = new UserInviteModel();
                  newFriend.friend_phone=this.persistenceService.selectedContacts[i].mainPhone;
                  newFriend.friend_is_accepted=0;
                  this.persistenceService.selectedEvent.invites.push(newFriend);
           }

            console.log("this.persistenceService.selectedEvent");
            console.log(this.persistenceService.selectedEvent);

           this.navigateTo(AddNotesForEventPage,{});
      }
       
     
  }
   
}
