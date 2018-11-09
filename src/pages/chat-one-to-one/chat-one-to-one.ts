import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, App, Content, VirtualScroll } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureAudioOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Diagnostic } from "@ionic-native/diagnostic";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Media, MediaObject } from '@ionic-native/media';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';
import { Network } from '@ionic-native/network';
import { Keyboard } from '@ionic-native/keyboard';

//Pagine
import { BasePage } from '../../app/BasePage';
import { ContactsPage } from '../contacts/contacts';
//Altro
import { ChatMessage, MyContact } from '../../app/models';
import { PersistenceService, BEService, UtilsService, FirebaseChatService } from '../../app/services';

import { Observable } from "rxjs";
@IonicPage()
@Component({
    selector: 'page-chat-one-to-one',
    templateUrl: 'chat-one-to-one.html',
    providers: [Network]
})
export class ChatOneToOnePage extends BasePage {
    @ViewChild('myContent') content: Content;
    @ViewChild('virtualScroll', { read: VirtualScroll }) virtualScroll: VirtualScroll;
    newMessage: ChatMessage = new ChatMessage();
    contact: MyContact = new MyContact();
    messages: Array<ChatMessage> = new Array<ChatMessage>();
    server_ids: any = [];
    client_ids: any = [];
    itemHeight = 40;
    constructor(
        public navCtrl: NavController
        , public navParams: NavParams
        , public beService: BEService
        , public persistenceService: PersistenceService
        , public loadingCtrl: LoadingController
        , public toastCtrl: ToastController
        , public utilsService: UtilsService
        , public app: App
        , private firebaseChatService: FirebaseChatService
        , private mediaCapture: MediaCapture
        , private transfer: FileTransferObject
        , private media: Media
        , private streamingMedia: StreamingMedia
        , private network: Network
        , private keyboard: Keyboard
    ) {
        super(persistenceService, beService, loadingCtrl, toastCtrl, app);
        this.contact = this.navParams.get("model") as MyContact;
        this.contact.phone = this.utilsService.phoneSanitize(this.contact.phone);

        var self = this;
        // watch network for a disconnect
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            // self.firebaseChatService.disconnect();
            self.showToast("Sei disconnesso");
            //self.onDisconnect();
            self.contact.messages = self.messages;
            this.persistenceService.insertOrUpdateMyContact(this.contact, function (local) {
                console.log("ho salvato il contatto");
                console.log(local);
            }, function (err) {
                console.log("errore su salvataggio in locale");
                console.log(err);
                self.showGenericError();
            });


        });


        // watch network for a connection
        let connectSubscription = this.network.onConnect().subscribe(() => {
            console.log('network connected!');
            //self.onReconnect();
            self.showToast("Sei connesso");
            //        console.log("numero messaggi "+self.messages.length);
            var messagesToSend = [];
            for (var i = 0; i < self.messages.length; i++) {

                //            console.log(self.messages[i]);
                if (self.messages[i].status == 0) {


                    messagesToSend.push(self.messages[i]);
                    //                console.log("invio messaggio a "+self.contact.phone);
                    //                self.showToast("invio messaggio a "+self.contact.phone+ " "+self.messages[i].text);
                    //               
                }

            }
            console.log("invierò questi messaggi");
            console.log(messagesToSend);


            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {

                //   self.firebaseChatService.reconnect();
                console.log("this.network");
                console.log(this.network);
                if (this.network.type === 'wifi') {
                    console.log('we got a wifi connection, woohoo!');
                }

                for (var i = 0; i < messagesToSend.length; i++) {
                    console.log("invio messaggio a " + self.contact.phone);
                    console.log(messagesToSend[i]);
                    self.firebaseChatService.sendTextMessage(messagesToSend[i].text, self.contact.phone, messagesToSend[i].client_id);

                }
            }, 10000);
        });


    }

    /**
     * <p>Salva su dispositivo locale</p>
     */
    private saveToLocalStorage() {
        console.log("saveToLocalStorage");
        var self = this;
        //this.contact.messages = this.messages;

        self.persistenceService.insertOrUpdateMyContact(self.contact, function (local) {

            console.log("ho salvato " + self.contact.messages.length);
            //  self.showToast("ho salvato "+self.contact.messages.length);
            console.log(local);

        }, function (err) {
            console.log("errore salvataggio in locale");
            console.log(err);
            self.showToast(err);

        });

        //            
        //        
        //        setTimeout(() => {
        //        
        //            self.persistenceService.insertOrUpdateMyContact(self.contact,function(local){
        //           
        //                console.timeEnd("ho salvato "+self.contact.messages.length );
        //                
        //            },function(err){
        //                console.timeEnd("errore salvataggio in locale");
        //                console.log(err);
        //                
        //            });
        //
        //        }, 3000);






    }

    ionViewWillLeave() {
        console.log("chatonetoone ionViewWillLeave");
        console.log("chatonetoone start");
        this.saveToLocalStorage();
        this.onDisconnect();
        console.log("chatonetoone end ");

    }
    /**
     * <p>Crea un oggetto ChatModel da una entry su FireBase</p>
     */
    private makeChatModelFromFBEntry(fbEntry) {
        var entry = fbEntry.val();
        //      var server_id               = fbEntry.key;
        //      var ret                     = new ChatMessage();
        //      ret.text                = entry.payload;
        //      ret.server_id           = server_id;
        //      ret.client_id           = entry.client_id!=undefined ? entry.client_id : "";
        //      ret.status              = entry.status;
        //      ret.type                = entry.type;
        //      
        var ret = this.firebaseChatService.makeChatModelFromFBEntry(fbEntry)
        ret.incoming = this.contact.phone != this.utilsService.phoneSanitize(entry.from) ? 1 : 0;
        return ret;

    }
    /**
     * <p>Processa l'evento nuovo messaggio in arrivo</p>
     */
    private processNewIncomingMessage(fbEntry) {
        var entry = fbEntry.val();
        var server_id = fbEntry.key;
        var message = this.makeChatModelFromFBEntry(fbEntry);
        message.text = entry.payload;
        message.server_id = server_id;
        message.status = 3;
        message.type = entry.type;
        message.incoming = 1;
        message.received_or_sent_at = entry.sendDate;
        this.server_ids.push(server_id);
        this.messages.push(message);

        this.contact.last_message = message;
        this.firebaseChatService.updateStatusSetRead(server_id, this.contact.phone);
        this.saveToLocalStorage();

        this.scrollDown();

    }
    /**
     * <p>Processa l'evento aggiornamento messaggio in uscita</p>
     */
    private processNewOutgoingMessage(fbEntry, clientIdIOF) {
        var entry = fbEntry.val();
        var server_id = fbEntry.key;
        var message = this.makeChatModelFromFBEntry(fbEntry);
        if (this.messages[clientIdIOF] == undefined) {
            return;
        }
        this.messages[clientIdIOF].server_id = server_id;
        this.messages[clientIdIOF].status = message.status;
        this.messages[clientIdIOF].received_or_sent_at = message.received_or_sent_at;
        this.server_ids.push(server_id);
        this.saveToLocalStorage();
        //this.contact.messages.push(self.messages[clientIdIOF]);

    }

    private onDisconnect() {
        this.firebaseChatService.cancelToListenOnUserStatus(this.contact.phone, function (remote) { });
        this.firebaseChatService.cancelListenOnMessageAdded(this.contact.phone);
        this.firebaseChatService.cancelListenOnMessageUpdated(this.contact.phone);
        this.firebaseChatService.cancelListenOnMessageDeleted(this.contact.phone);
    }

    ionViewDidEnter() {
        var self = this;


        var userPhone = this.utilsService.phoneSanitize(this.user.phone);

        this.messages = new Array<ChatMessage>();
        const messageArray = this.contact.messages;
        for (let list of messageArray) {

            if (list.server_id != undefined && list.server_id != "") {
                this.server_ids.push(list.server_id);
                if (list.client_id != undefined && list.client_id != null && list.client_id != "") {
                    this.client_ids.push(list.server_id);
                }


            }

            this.messages.push(list);

        }

        if (this.messages.length === messageArray.length) {
            console.log(this.messages.length);
            this.scrollDown();
        }

        //      
        setTimeout(() => {
            self.onReconnect();

        }, 2000);


    }


    private onReconnect() {
        var self = this;
        var userPhone = this.utilsService.phoneSanitize(this.user.phone);

        self.firebaseChatService.listenOnUserStatus(this.contact.phone, function (remote, parent) {
            var remoteUser = remote.val();
            if (remoteUser != null) {
                var status = remoteUser.status;
                var typing_to = remoteUser.typing_to;
                self.contact.online = status;
                self.contact.typing = (typing_to == self.user.phone) ? 1 : 0;
            }
        });


        self.firebaseChatService.listenOnMessageAdded(this.contact.phone, function (message_retrived, destination) {

            console.log("listenOnMessageAdded ");
            console.log(message_retrived);


            var entry = message_retrived.val();
            var server_id = message_retrived.key;


            var incoming = userPhone != self.utilsService.phoneSanitize(entry.from);


            var serverIdIOF = self.server_ids.indexOf(server_id);
            var clientIdIOF = entry.client_id != undefined && entry.client_id != null && entry.client_id != "" ? self.client_ids.indexOf(entry.client_id) : -1;

            var isToAdd = incoming && serverIdIOF == -1;
            var isToUpdate = !incoming && clientIdIOF == -1;
            if (isToUpdate) {

                self.processNewOutgoingMessage(message_retrived, clientIdIOF);
            }


            if (isToAdd) {



                self.processNewIncomingMessage(message_retrived);
                //
                //                        var clientIdIOF=-1;
                //                        if(entry.client_id!=undefined && entry.client_id!=null){
                //                            clientIdIOF =self.client_ids.indexOf(entry.client_id);
                //                        }
                //                        
                //                        
                //                        var isOutgoing = clientIdIOF!=-1;
                //                        
                //status:number=0;//0 non inviato, 1 inviato al server, 2 inviato al client, 3 letto da client
                //                      if(isOutgoing){
                //
                //                           self.processNewOutgoingMessage(message_retrived,clientIdIOF);
                //                      } else {
                //
                //                      
                //                                                }

                //}


            }

        });

        self.firebaseChatService.listenOnMessageUpdated(this.contact.phone, function (message_retrived, destination) {

            console.log("listenOnMessageUpdated ");
            console.log(message_retrived);


            var entry = message_retrived.val();
            var server_id = message_retrived.key;
            var iof = self.server_ids.indexOf(server_id);
            if (iof != -1) {
                if (self.messages[iof].status != entry.status) {
                    self.messages[iof].status = entry.status;
                    self.messages[iof].received_or_sent_at = entry.sendDate;
                }
            }




        });
        self.firebaseChatService.listenOnMessageDeleted(this.contact.phone, function (message_retrived, destination) {

            console.log("listenOnMessageDeleted ");
            console.log(message_retrived);


            //                   var entry     = message_retrived.val();
            //                   var server_id = message_retrived.key;
            //                    
            //                   var iof =self.keys.indexOf(server_id);
            //                   if(iof!=-1){
            //                    self.contact.messages.splice(iof,1);
            //                    
            ////                     setTimeout(() => {
            ////                        if(self.content!=undefined && self.content!=null){
            ////                            self.content.scrollToBottom(300);
            ////                        }
            ////                    }, 1000);
            //                    
            //                    
            //                   }
            //
            //                   

            //self.firebaseChatService.updateStatusSetReceived(entry.id,destination);

        });


    }



    private generateUniqueID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }


    /**
     * <p>Invia un messaggio di testo</p>
     */
    onSendMessage() {




        // this.messages.push(this.message + " " + (this.contact.messages.length));

        try {
            var message = new ChatMessage();
            message.text = this.newMessage.text;
            message.client_id = this.generateUniqueID();
            message.status = 0;
            message.type = "text";
            message.incoming = 0;
            this.client_ids.push(message.client_id);
            this.messages.push(message);
            this.contact.messages.push(message);
            this.contact.last_message = message;
            this.scrollDown();
            this.firebaseChatService.sendTextMessage(this.newMessage.text, this.contact.phone, message.client_id);

        } catch (ex) {
            console.log("ex");
            console.log(ex);

        }

        this.newMessage = new ChatMessage();

        // this.keyboard.close();

    }

    private sendVoiceToServer(url) {
        this.firebaseChatService.sendVoiceMessage(url, this.contact.phone);
    }
    private sendPictureToServer(url) {
        this.firebaseChatService.sendImageMessage(url, this.contact.phone);
    }

    private sendVideoToServer(url) {
        this.firebaseChatService.sendVideoMessage(url, this.contact.phone);
    }


    onSendTyping() {

        var timer = null;
        var self = this;
        // whenever the content of the textarea changes
        this.firebaseChatService.sendTyping(this.contact.phone);

        // if we're counting down, stop the timer
        if (timer != null) clearTimeout(timer);
        // remove this user in 2 seconds
        timer = setTimeout(function () {
            self.firebaseChatService.sendTypingNone();
        }, 2000);

    }

    onSendVoice() {
        var self = this;
        let options: CaptureAudioOptions = { limit: 1, duration: 10 };
        this.mediaCapture.captureAudio(options)
            .then(
                (attachments: MediaFile[]) => {
                    console.log("onSendVoice");
                    console.log(attachments);
                    self.showLoading();

                    self.upload("A", attachments[0]);


                },
                (err: CaptureError) => {
                    console.log("onSendImage err");
                    console.error(err);
                }
            );
    }
    onSendVideo() {
        var self = this;
        let options: CaptureVideoOptions = { limit: 1 };
        this.mediaCapture.captureVideo(options)
            .then(
                (attachments: MediaFile[]) => {
                    self.showLoading();
                    self.upload("V", attachments[0]);


                },
                (err: CaptureError) => {
                    console.log("onSendImage err");
                    console.error(err);
                }
            );
    }
    onSendImage() {
        var self = this;
        let options: CaptureImageOptions = { limit: 1 };
        this.mediaCapture.captureImage(options)
            .then(
                (attachments: MediaFile[]) => {
                    self.showLoading();
                    self.upload("I", attachments[0]);


                },
                (err: CaptureError) => {
                    console.log("onSendImage err");
                    console.error(err);
                }
            );
    }


    private upload(type: string, attachment: MediaFile) {
        var self = this;
        let options: FileUploadOptions = { fileKey: 'file', fileName: attachment.name, headers: {} };
        var imageData = attachment.fullPath;
        var url = self.beService.beChatAttachmentURL + "/" + self.user.id + "/" + self.contact.phone + "/" + type;
        console.log("url");
        console.log(url);
        self.transfer.upload(imageData, url, options)
            .then((data) => {
                // success
                self.hideLoading();

                console.log("remote");
                console.log(data);
                var response: any = JSON.parse(data.response);

                if (response.success) {
                    var remote: any = response.data;
                    if (type == "A") {
                        self.sendVoiceToServer(self.beService.beChatAttachmentURL + "/" + remote.id);
                    }
                    if (type == "V") {
                        self.sendVideoToServer(self.beService.beChatAttachmentURL + "/" + remote.id);
                    }
                    if (type == "I") {
                        self.sendPictureToServer(self.beService.beChatAttachmentURL + "/" + remote.id);
                    }


                } else {
                    self.showGenericError();
                }


            }, (err) => {
                console.log("err");
                console.log(err);
                self.hideLoading();
                self.showGenericError();
            });

    }


    onPlay(event, item) {
        console.log("file to play");
        console.log(item);
        //      const file: MediaObject = this.media.create(item.text);
        //      
        //      file.play();

        let options: StreamingAudioOptions = {
            successCallback: () => { console.log('Video played') },
            errorCallback: (e) => { console.log('Error streaming') },

        };

        this.streamingMedia.playAudio(item.text, options);


    }

    private scrollDown() {
        var self = this;
        setTimeout(() => {
            if (self.content != undefined && self.content != null) {
                self.content.scrollToBottom(300);

            }
        }, 500);


    }


    protected async myUpdateFunction() {
        console.log("myUpdateFunction");
        await this.content.scrollTo(0, 0, 0);
        this.virtualScroll.scrollUpdate({ scrollTop: 0 } as any);
        // data loading
    }

}
