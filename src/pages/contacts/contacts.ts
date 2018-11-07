import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';


//Pagine
import { BasePage } from '../../app/BasePage';
import { ChatOneToOnePage } from '../chat-one-to-one/chat-one-to-one';
//Altro
import { MyContact,ChatMessage } from '../../app/models';
import { PersistenceService,BEService,UtilsService,FirebaseChatService } from '../../app/services';



/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage  extends BasePage {

   items : Array<MyContact> = new Array<MyContact>();
   itemsByPhone : any = [];
   server_ids:any = [];
   constructor(
                public navCtrl: NavController
                ,public navParams: NavParams
                ,public beService: BEService
                ,public persistenceService : PersistenceService
                ,public loadingCtrl: LoadingController
                ,public toastCtrl: ToastController
                ,public utilsService:UtilsService
                ,public app: App
                ,private firebaseChatService :FirebaseChatService
                ,private zone :NgZone
            ) {
          super(persistenceService,beService,loadingCtrl,toastCtrl,app);
          
  }
  getItemIndexWithPhone(phone) {
      for(var i=0;i<this.items.length;i++ ){
          if(phone==this.items[i].phone){
              return i;
          }
      }
      return -1;
  }
  getItemIndexWithPhone2(user_info) {
      var iof = user_info.indexOf("_info");
      var phone = user_info.substring(0,iof);
      for(var i=0;i<this.items.length;i++ ){
          if(phone==this.items[i].phone){
              return i;
          }
      }
      return -1;
  }
  ionViewWillLeave(){
        for(var i=0;i<this.items.length;i++){
            var phone = this.utilsService.phoneSanitize(this.items[i].phone);
            this.firebaseChatService.cancelToListenOnUserStatus(phone,function(remote){});
        }
  }

/**
   * <p>Crea un oggetto ChatModel da una entry su FireBase</p>
   */
  private makeChatModelFromFBEntry(contact_phone,fbEntry){
      var entry               = fbEntry.val();
      var server_id           = fbEntry.key;
      var ret                 = new ChatMessage();
      ret.text                = entry.payload;
      ret.server_id           = server_id;
      ret.client_id           = entry.client_id!=undefined ? entry.client_id : "";
      ret.status              = entry.status;
      ret.type                = entry.type;
      ret.incoming            = contact_phone!=this.utilsService.phoneSanitize(entry.from) ? 1 :0;
      return ret;
       
  }
 /**
   * <p>Processa l'evento nuovo messaggio in arrivo</p>
   */
  private processMessage(contact,fbEntry){
      console.log("contacts processMessage");
      var entry                   = fbEntry.val();
      var server_id               = fbEntry.key;
      var contactIndex            = this.itemsByPhone.indexOf(contact);
      var incoming                = this.user.phone!=entry.from;
      
      if(!incoming){
          console.log("messaggio in uscita");
          return;
      }
      
      console.log("messaggio in ingresso");
      var sanitizedPhone          = this.utilsService.phoneSanitize(entry.from);
      var message                 = this.makeChatModelFromFBEntry(sanitizedPhone,fbEntry);
      message.text                = entry.payload;
      message.server_id           = server_id;
      message.status              = 2;
      message.type                = entry.type;
      message.incoming            = 1;
      message.received_or_sent_at = entry.sendDate;
      this.server_ids.push(server_id);
      this.items[contactIndex].messages.push(message);
      this.items[contactIndex].last_message=message;
      if(this.items[contactIndex].count_new_incoming==undefined || this.items[contactIndex].count_new_incoming==null){
          this.items[contactIndex].count_new_incoming=0;
          
      }
      this.items[contactIndex].count_new_incoming++;
      this.firebaseChatService.updateStatusSetReceived(server_id,sanitizedPhone);
      
      
  }
  
  

  ionViewDidEnter() {
  console.log("contact ionViewDidEnter");
    var self = this;  
    var userPhone = self.utilsService.phoneSanitize(this.user.phone);
    //this.zone.run(() => {
        
    
        this.persistenceService.getMyContacts(function(remote){
            self.items = remote;
            
            for(var i=0;i<self.items.length;i++){
                  self.items[i].phone=self.utilsService.phoneSanitize(self.items[i].phone);
                  self.itemsByPhone.push(self.items[i].phone);
            }
             
            for(var i=0;i<self.items.length;i++){
                var phone = self.items[i].phone;

               
                //Ascolta cambiamento di stato    
                self.firebaseChatService.listenOnUserStatus(phone,function(remote,parent){
                    console.log("status is changed");

                    console.log(remote);

                    var remoteUser  = remote.val();
                    console.log("remoteuser");
                    console.log(remoteUser);
                    console.log("parent");
                    console.log(parent);
                    if(remoteUser!=null){


                        var status = remoteUser.status;
                        var typing_to = remoteUser.typing_to;

                        var item_index = self.itemsByPhone.indexOf(parent);
                        console.log("item_index");
console.log(item_index);
                        if(item_index!=-1){
                            self.items[item_index].online=status==1 ? 1 : 0;
                            if(typing_to==self.user.phone)
                                self.items[item_index].typing=1;
                            else
                                self.items[item_index].typing=0;
                            
                         console.log("remoteUser");
                        console.log(remoteUser);
                        if(remoteUser.last_message!=undefined && remoteUser.last_message!=null && self.items[item_index].typing!=1){
                            var destination_to =  self.utilsService.phoneSanitize(remoteUser.last_message.to);
                            var last_message =self.items[item_index].last_message;
                            
                            
                            
                            if(destination_to==userPhone )
                            {
                                if(last_message==undefined || last_message==null || last_message.client_id!=remoteUser.last_message.client_id || ( last_message.client_id==remoteUser.last_message.client_id && last_message.text!=remoteUser.last_message.payload)  ){
                                    
                                
                                        if(self.items[item_index].count_new_incoming==undefined || self.items[item_index].count_new_incoming==null){
                                            self.items[item_index].count_new_incoming=0;
                                        }
                                        self.items[item_index].count_new_incoming++;
                                        self.items[item_index].last_message=self.firebaseChatService.makeChatModelFromFBChatModel(remoteUser.last_message);
                                }
                            }
                            
                        }

                        console.log("self.items");
                        console.log(self.items);

                        }

                    }




                });
                //Ascolta i messaggi di chat
//                self.firebaseChatService.listenOnMessageAdded(phone,function(message_retrived,destination){
//                    self.processMessage(destination,message_retrived);
//                    
//                });
//                
//                self.firebaseChatService.listenOnMessageUpdated(phone,function(messages_retrived,destination){
//                    console.log("elenco messaggi per ");
//                    console.log(messages_retrived);
//                    var entry = messages_retrived.val();
//                    console.log(entry);
//                    
//                    
//                    
//                });
//                self.firebaseChatService.listenOnMessageDeleted(phone,function(messages_retrived,destination){
//                    console.log("elenco messaggi per ");
//                    console.log(messages_retrived);
//                    var entry = messages_retrived.val();
//                    console.log(entry);
//                    
//                    var item_index = self.getItemIndexWithPhone(destination);
//                     self.items[item_index].messages.splice(item_index,1);
//                    
//                    //self.firebaseChatService.updateStatusSetReceived(entry.id,destination);
//                    
//                });
                
            }
        },function(){

        });

    
   // });
    
  }
  
  
  ionViewDidLoad1() {
    var self = this;  
    var userPhone = self.utilsService.phoneSanitize(this.user.phone);
    //this.zone.run(() => {
        
    
        this.persistenceService.getMyContacts(function(remote){
            self.items = remote;
            for(var i=0;i<self.items.length;i++){
                var phone = self.utilsService.phoneSanitize(self.items[i].phone);

                self.itemsByPhone.push(phone);
                //Ascolta cambiamento di stato    
                self.firebaseChatService.listenOnUserStatus(phone,function(remote,parent){
                    console.log("status is changed");

                    console.log(remote);

                    var remoteUser  = remote.val();

                    console.log(parent);
                    if(remoteUser!=null){


                        var status = remoteUser.status;
                        var typing_to = remoteUser.typing_to;

                        var item_index = self.getItemIndexWithPhone(parent);

                        if(item_index!=-1){
                            self.items[item_index].online=status==1 ? 1 : 0;
                            if(typing_to==self.user.phone)
                                self.items[item_index].typing=1;
                            else
                                self.items[item_index].typing=0;

                        console.log("self.items");
                        console.log(self.items);

                        }

                    }




                });
                //Ascolta i messaggi di chat
                self.firebaseChatService.listenOnMessageAdded(phone,function(message_retrived,destination){
                    console.log("listenOnMessageAdded per "+destination);
                    console.log(message_retrived);
                    var entry = message_retrived.val();
                    var server_id = message_retrived.key;
                    var iof =self.server_ids.indexOf(server_id);
                    if(iof==-1){
                        
                    
                    
                        console.log(entry);

                        self.firebaseChatService.updateStatusSetReceived(server_id,destination);
                        var item_index = self.itemsByPhone.indexOf(destination);

                        var message = new ChatMessage();
                        message.text = entry.payload;
                        message.server_id=server_id;
                        message.status=entry.status;
                        message.type=entry.type;
                        if(entry.from!=undefined && entry.from!=null){
                            message.incoming = userPhone!=self.utilsService.phoneSanitize(entry.from) ? 1 :0;    

                            message.received_or_sent_at = entry.sendDate;
                            if(item_index!=-1){
                                self.items[item_index].messages.push(message);
                                if(self.items[item_index].count_new_incoming==undefined || self.items[item_index].count_new_incoming==null){

                                    self.items[item_index].count_new_incoming=0;
                                }

                                self.items[item_index].count_new_incoming+=1;
                            }
                      }
                    }
                });
                
                self.firebaseChatService.listenOnMessageUpdated(phone,function(messages_retrived,destination){
                    console.log("elenco messaggi per ");
                    console.log(messages_retrived);
                    var entry = messages_retrived.val();
                    console.log(entry);
                    
                    
                    
                });
                self.firebaseChatService.listenOnMessageDeleted(phone,function(messages_retrived,destination){
                    console.log("elenco messaggi per ");
                    console.log(messages_retrived);
                    var entry = messages_retrived.val();
                    console.log(entry);
                    
                    var item_index = self.getItemIndexWithPhone(destination);
                     self.items[item_index].messages.splice(item_index,1);
                    
                    //self.firebaseChatService.updateStatusSetReceived(entry.id,destination);
                    
                });
                
            }
        },function(){

        });

    
   // });
    
  }
  
  
  
  onSelect(event,item) {
     
     var phone = this.utilsService.phoneSanitize(item.phone);
     this.firebaseChatService.cancelListenOnMessageAdded(phone);
     this.firebaseChatService.cancelListenOnMessageUpdated(phone);
     this.firebaseChatService.cancelListenOnMessageDeleted(phone);
     this.navigateToPreserveBack(ChatOneToOnePage,{model:item});
  }
  

}
