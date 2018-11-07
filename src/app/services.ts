import { Storage } from '@ionic/storage';
import { Injectable,Injector  } from '@angular/core';
import { User,SoccerFieldModel,EventModel,SelectedContactForEvent,IncomingUserInviteModel,SoccerFieldBookingModel,SoccerFieldBookingModelExtend,UserInviteModel,MyContact,ChatMessage,ChatMessagePayloadModel } from './models';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { HTTP } from '@ionic-native/http';
import { environment } from '../environment/environment';
import * as firebaseDB from "firebase";


 var config = {
    apiKey: "AIzaSyAllqmlUH_Oems2pKMeuX4rJsaJIIJDrJs",
    authDomain: "futsalify.firebaseapp.com",
    databaseURL: "https://futsalify.firebaseio.com",
    projectId: "futsalify",
    storageBucket: "futsalify.appspot.com",
    messagingSenderId: "469487751298"
  };

@Injectable()
export class UtilsService {
    const_months_breef = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
    const_months = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    
    months_breef: any = [];
    months: any = [];
    
    constructor() {
        for(var i=0;i<this.const_months_breef.length;i++){
            this.months_breef.push(this.const_months_breef[i]);
        }
    } 
    
    distanceBetweenToHuman(lat1, lon1, lat2, lon2) {
       var ret:any = new String(this.distanceBetween(lat1, lon1, lat2, lon2));
       var s :any = ret.split(".");
       var km:any  = s[0];
       var m:any  = s[1];
       
       return km +" km e "+ m+ " m";
   }
    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    distanceBetween(lat1, lon1, lat2, lon2) 
    {
      var R:any = 6371; // km
      var dLat:any = this.toRad(lat2-lat1);
      var dLon:any = this.toRad(lon2-lon1);
      var lat1:any = this.toRad(lat1);
      var lat2:any = this.toRad(lat2);

      var a:any = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c:any = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d:any = R * c;
      return d.toFixed(2);
    }

    // Converts numeric degrees to radians
    toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
    
    isInt(value) {
        return (typeof value)=="number";
   }
   
   tryParseIntOrDefault(m:string,def:number){
       try{
           return parseInt(m);
       } catch (ex){
           
       }
       return def;
   }
   
   isString(value) {
        return (typeof value)=="string";
   }
   monthToHumanFromInt(m:number) {
       var iof = this.months_breef.indexOf(m);
       return (iof>-1) ? this.months_breef[iof] : m;
   }
   
   monthToHumanFromString(m:string) {
       var iof = this.months_breef.indexOf(parseInt(m));
       return (iof>-1) ? this.months_breef[iof] : m;
   }

   
   stringPad(str,car,len,left) {
         var test : any = str;
         if(this.isInt(str)){
            test = new String(str);
         }
         
         if(test.length>=len)
             return test;
         var append ="";
         for(var i=0;i<len-test.length;i++){
             append += car;
         }
         if(left){
             return append+test;
         } else {
             return test+append;
         }
         
         
   }
   dateTimeToHumanFromDateAndTimeAsString(dateStr,timeStr) {
        if(dateStr instanceof Date){
//            console.log("dateTimeToHumanFromDateAndTimeAsString instanceof date yes");
            return this.dateTimeToHuman(dateStr,true);
        }
        
        var _time = timeStr.split(":");
        var t = "";
        if(_time.length==2){
            t=_time[0]+":"+_time[1];
//            console.log("caso 1"+ t);
        } else {
            var hh = timeStr.substr(0,2);
            var ii = timeStr.substr(2,2);
//            console.log("caso 2"+ hh);
//            console.log("caso 2"+ ii);
            t=hh+":"+ii;
        }
//        console.log("invio");
//        console.log(dateStr+" "+t);
        return this.dateTimeToHumanFromString(dateStr+" "+t,true);
        
   }
   dateTimeToHumanFromString(str,includeTime) {
   
   
        if(str instanceof Date){
//             console.log("dateTimeToHumanFromString instanceof date yes");
            return this.dateTimeToHuman(str,includeTime);
        }
        
        var date_and_time = str.split(" ");
        if(date_and_time.length==2){
            /*
            var date_part = date_and_time[0];
            var time_part = date_and_time[0];
            
            var date_parts = date_part.split("-");
            var yyyy  = date_parts[0];
            var mm  = date_parts[1];
            var dd  = date_parts[2];
            */
//           console.log("new Date(str)");
//           console.log(new Date(str));
            return this.dateTimeToHuman(new Date(str),includeTime);
            
        } else {
            
            return this.dateTimeToHuman(new Date(str+" 0:0"),includeTime);
            
            
        }
        
   }
   dateTimeToHuman(date,includeTime) {
        try {
           
          var now = new Date();
          
          var now_yyyy = now.getFullYear();
          var now_mm = now.getMonth();
          var now_dd = now.getDate();
          
          
//          console.log("now ==> "+ now);
//          
//          
          var yyyy = date.getFullYear();
          var mm = date.getMonth();
          var dd = date.getDate();
          
          var hh = date.getHours();
          var ii = date.getMinutes();
          
//          console.log("yyyy ==> "+ yyyy);
//          console.log("mm ==> "+ mm);
//          console.log("dd ==> "+ dd);
//          console.log("hh ==> "+ hh);
//          console.log("ii ==> "+ ii);
//          
          
          
          
          var ret = "";
          if(!includeTime){
              
              if(now_yyyy==yyyy
                      && now_mm==mm
                      && now_dd==dd
                      ){
                  return "Oggi";
              }
              
              ret+=dd;
              if(now_mm!=mm){
                  ret+="-"+mm;
              }
              if(now_yyyy!=yyyy){
                  ret+="-"+yyyy;
              }
              
              return ret;
              
          } else {
              if(now_yyyy==yyyy
                      && now_mm==mm
                      && now_dd==dd
                      ){
                  return hh+":"+ii;
              }
              
             
              
              ret+=dd;
              if(now_mm!=mm){
                  ret+="-"+mm;
              }
              if(now_yyyy!=yyyy){
                  ret+="-"+yyyy;
              }
              //stringPad(str,car,len,left) {
              ret+= " "+this.stringPad(hh,"0",2,true)+":"+ this.stringPad(ii,"0",2,false);
              return ret;
              
              
          }
          
       } catch (ex){
//           console.log(ex);
       }
       
       return date;

        
    }
    
   convertToInt(str) {
       try {
           return parseInt(str);
       } catch (ex){
           
       }
       return -1;
        
    }
    
    convertTimeToStringHHII(str) {
        var splitted = str.split(":");
        var hh=splitted[0];
        var ii=splitted[1];
        return ""+hh+ii;
    }
    convertStringHHIIToTime(str) {
        var hh=str.substring(0,2);
        var ii=str.substring(2);
        return new Date(hh+":"+ii);
    }
    timeToHuman(strOrDate){
        if(strOrDate==undefined || strOrDate==""){
                return "";
        }
        
        var splitted = strOrDate.split(":");
        if(splitted.length==2){
            return  strOrDate;
        }
        var hh = strOrDate.substring(0,2);
        var ii   = strOrDate.substring(2);
        return hh+":"+ii;
        
    }
    
    dateToHuman(strOrDate){
        var yyyymmdd = this.dateOrStringToYYYYMMDD(strOrDate);
        if(yyyymmdd==""){
                return "";
        }
        var now = new Date();
        var now_yyyy = new String(now.getFullYear());
        var now_mm   = this.stringPad(now.getMonth()+1,"0",2,true);
        var now_dd   = this.stringPad(now.getDate(),"0",2,true);
        
        var yyyy = yyyymmdd.substring(0,4);
        var mm   = yyyymmdd.substring(4,6);
        var dd   = yyyymmdd.substring(6,8);
        
        if(yyyy==now_yyyy
                && mm==now_mm
                && dd==now_dd){
            return "Oggi";
        }
        
        if(yyyy==now_yyyy
                && mm==now_mm
                ){
            return dd;
        }
        
        if(yyyy==now_yyyy){
            return dd + " " + this.monthToHumanFromString(mm);
        }
            
        return dd + " " + this.monthToHumanFromString(mm)+" " +yyyy ;
    }
    dateOrStringToYYYYMMDD(strOrDate){
        var mm: any;
        var yyyy: any;
        var dd: any;
        
        if(strOrDate instanceof Date){
            yyyy = strOrDate.getFullYear();
            mm   = strOrDate.getMonth()+1;
            dd   = strOrDate.getDate();
            return yyyy+""+this.stringPad(mm,"0",2,true)+""+this.stringPad(dd,"0",2,true);
        } else {
            if(strOrDate==undefined || strOrDate==""){
                
                return "";
            }
        
            var exploded = strOrDate.split("-");
            if(exploded.length==3){
                
                yyyy = exploded[0];
                mm   =  exploded[1];
                dd   =  exploded[2];
                if(dd.length>2){
                    dd = dd.substring(0,2);
                }
                return yyyy+""+this.stringPad(mm,"0",2,true)+""+this.stringPad(dd,"0",2,true);
            }
            exploded = strOrDate.split(" ");
            if(exploded.length==3){
                
                yyyy    = exploded[0];
                mm      =  exploded[1];
                dd      =  exploded[2];
                if(dd.length>2){
                    dd = dd.substring(0,2);
                }
                return yyyy+""+this.stringPad(mm,"0",2,true)+""+this.stringPad(dd,"0",2,true);
            }
            
            return strOrDate;
            
        }
        
    }
    
    
    replaceAll(str, cerca, sostituisci) {
        if(str==undefined || cerca==undefined || sostituisci==undefined)
            return "";
        return str.split(cerca).join(sostituisci);
    }

    phoneSanitize(phone:string){
        var ret = this.replaceAll(phone," ","");
        ret = this.replaceAll(ret,"+","");
        if(ret.length==10){
            ret = "39"+ret;
        }
        return ret;
        
    }
    
    makeUserForBE(user){
        var ret = {
            username:user.username
            ,login_with:user.loginWith
            ,email:user.email
            ,phone:user.phone
            ,fb_id:user.fb_id
        };
        return ret;
    }
    
    makeBookingForBE(booking){
//		console.log("makeBookingForBE");
//		console.log(booking);
        var booking_date = booking.event_date + " "+booking.event_time;
		var friends = [];
		for(var i=0;i<booking.invites.length;i++){
            friends.push(booking.invites[i].phone);
        }
//		console.log(friends);
        var ret = {
            name:booking.name
            ,description:booking.description
            ,sfid:booking.sfid
            ,uid:booking.uid
            ,booked_at:booking.booked_at
            ,invites:friends
        };

        return ret;
    }
    
    makeIncomingUserInviteModelForFE(item,contacts){

        var ret = new IncomingUserInviteModel();
            ret.id = item.id;
            ret.invited_from_phone = item.friend_phone;
            ret.uid_from = item.uid_from;
            ret.friend_uid = item.friend_uid;
            ret.soccerField = item.soccerField;
            ret.playerRole = item.playerRole;
            ret.booking = item.booking;
            ret.friend_is_accepted = item.friend_is_accepted;
            ret.friend_phone = item.friend_phone;
            ret.soccer_field_bought_at = item.soccer_field_bought_at!=undefined ? "" : null;
            ret.soccer_field_bought_amount = item.soccer_field_bought_amount!=undefined ? item.soccer_field_bought_amount : 0;
            ret.invited_from_name="Sconosciuto";
            ret.unknown=1;
            for(var j=0;j<contacts.length;j++){
                if(this.phoneSanitize(contacts[j].mainPhone)==this.phoneSanitize(ret.invited_from_phone)){
                    ret.invited_from_name = contacts[j].contact.displayName;
                    ret.unknown=0;
                    break;
                }
            }
          
          
        return ret;
    }
    
    makeSoccerFieldBookingModelExtend(source:SoccerFieldBookingModel){
        
        var ret : SoccerFieldBookingModelExtend = new SoccerFieldBookingModelExtend();
         ret.amount=source.amount;
         ret.id=source.id;
         ret.sfid=source.sfid;
         ret.booked_at=source.booked_at;
         ret.from_time=source.from_time;
         ret.to_time=source.to_time;
         ret.uid=source.uid;
         ret.status=source.status;
         ret.name=source.name;
         ret.notes=source.notes;
         ret.invites=source.invites;
         ret.invitesAccepted= new Array<UserInviteModel>();
         ret.invitesDeclined= new Array<UserInviteModel>();
         ret.invitesWaiting= new Array<UserInviteModel>();
         for(var x=0;x<source.invites.length;x++){
            var invited = source.invites[x];
                if(invited.friend_is_accepted==0 || invited.friend_is_accepted==null){
                    console.log(" questo è in attesa");
                    console.log(invited);
                    ret.invitesWaiting.push(invited);
                }
                if(invited.friend_is_accepted!=null && invited.friend_is_accepted==1){
                    ret.invitesAccepted.push(invited);
                }
                if(invited.friend_is_accepted!=null &&  invited.friend_is_accepted==2){
                    ret.invitesDeclined.push(invited);
                }

         }
                
                    
        
        return ret;
        
    }
    
}
@Injectable()
export class PersistenceService {
    user:User = new User();
    selectedSoccerField: SoccerFieldModel = new SoccerFieldModel();
    selectedEvent: SoccerFieldBookingModel = new SoccerFieldBookingModel();
    selectedContacts: Array<SelectedContactForEvent> = new Array<SelectedContactForEvent>();
    playerRoles: any = [];
    contactsOnDevice: Array<SelectedContactForEvent> = new Array<SelectedContactForEvent>();
    
    
    
    /**
     * costruttore
     */
    constructor(public storage: Storage
            ,private contacts: Contacts
              ,private utilsService: UtilsService) {

    }
    /**
     * <p>Restituisce il contatto del dispositivo che corrisponde al telefono passato</p>
     */
    getContactByPhone(phone){
        phone = this.utilsService.phoneSanitize(phone);
        for(var i=0;i<this.contactsOnDevice.length;i++){
//            console.log("this.contactsOnDevice[i]");
//            console.log(this.contactsOnDevice[i]);
            var phoneInContact = this.utilsService.phoneSanitize(this.contactsOnDevice[i].mainPhone);
            //console.log("confronto "+phone+" con "+ this.contactsOnDevice[i].mainPhone);
            if(phoneInContact==phone){
//                console.log(" trovato");
            } else {
//                console.log("non trovato");
            }
            if(phoneInContact==phone){
                return this.contactsOnDevice[i];
            }
        }
        return null;
        
    }
    userHasPayedHisQuote(model){
//        console.log("userHasPayedHisQuote()");
        var user = this.user;
        var invites = model.invites;
        var ret = false;
        for(var i=0;i<invites.length;i++){
//            console.log("invites[i]");
//            console.log(invites[i]);
            if(invites[i].friend_uid==user.id && invites[i].soccer_field_bought_at!=null){
//                console.log("beccato");
                ret=true;
                break;
            } else {
//               console.log("scartato"); 
            }
        }
        
        return ret;
        
        
    }
    
    fetchContactsOnDevice(cbOnSuccess,cbOnFailure){
          this.contacts.find(['*'], {filter: "", multiple: true,hasPhoneNumber : true})
    .then(data => 
            {
              //this.items = data;
               this.contactsOnDevice = [];
               for(var i=0;i<data.length;i++){
                    var contactFoundOnDevice = data[i];
                    var selectedContactForEvent = new SelectedContactForEvent(); 
                    selectedContactForEvent.mainPhone=this.getMainPhoneForContact(contactFoundOnDevice);
                    selectedContactForEvent.contact=contactFoundOnDevice;
                    this.contactsOnDevice.push(selectedContactForEvent);

                }
                if(this.contactsOnDevice.length>0){
                    cbOnSuccess(this.contactsOnDevice);
                } else {
                    cbOnFailure();
                }
             
            }
    );
         
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
  
    clearAddEventSession(){
        this.selectedSoccerField = new SoccerFieldModel();
        this.selectedEvent = new SoccerFieldBookingModel();
        this.selectedContacts = new Array<SelectedContactForEvent>();
    }
    
    /**
     * <p>Prende un elemento dal local storage già deserializzato oppure ritorna null</p>
     */
    private getFromLocalStorage(key,cbOnExists,cbOnNotExists){
        
        var itemInLS = window.localStorage.getItem(key);
        if(itemInLS!=null){
            
            var ret= JSON.parse(itemInLS);
            cbOnExists(ret);
            return;
        }
        cbOnNotExists();
        
        
        
    }

    /**
     * <p>Prende un elemento dal local storage già deserializzato oppure ritorna null</p>
     */
    private setToLocalStorage(key,value,cbOnSuccess,cbOnErr){
        
        try {
            window.localStorage.setItem(key,JSON.parse(value));
            cbOnSuccess(value);
        } catch (ex){
            cbOnErr(ex);
        }
        
    }

    /**
     * restituisce l'utente corrente
     */
    getLoggedUser(cbOnExists,cbOnNotExists){
         var self = this;
         this.getFromLocalStorage("user",function(user){
             console.log("getLoggedUser ok");
             console.log(user);
             self.user=user;
             self.populateUserFromRemote(user);
             cbOnExists(self.user);
                  
         },cbOnNotExists);
         
    }
    
    getLoggedUserAsync(cbOnExists,cbOnNotExists){
        
//          if(this.user!=null){
//              cbOnExists(this.user);
//              return;
//              
//          }
          var self = this;
          this.storage.get('user').then((user) => {
              if(user==null){
                  cbOnNotExists();
              } else {
                  self.user=user;
                  self.populateUserFromRemote(user);
                  cbOnExists(self.user);
                  
              }
               
               
           });
    }
    /**
     * Restituisce true se l'utente ha imopostato nome, cognome, telefono e ruolo
     */
    public userHasNameSurnameAndPlayerRoleAndPhone(){
        var hasName       = this.user.name!=undefined && this.user.name!=null && this.user.name!='';
        var hasSurname    = this.user.surname!=undefined && this.user.surname!=null && this.user.surname!='';
        var hasPlayerRole = this.user.preferred_prid!=undefined && this.user.preferred_prid!=null && this.user.preferred_prid>0;
        var hasPhone      = this.user.phone!=undefined && this.user.phone!=null && this.user.phone!='';
        
        return hasName && hasSurname && hasPlayerRole && hasPhone;
    }
    
    
    private populateUserFromRemote(remote){
        
        if(remote.preferred_prid!=undefined && remote.preferred_prid!=null && remote.preferred_prid!=0){
            var players = this.playerRoles;
            for(var i=0;i<this.playerRoles.length;i++){
                if(this.playerRoles[i].id==remote.preferred_prid){
                    this.user.playerRole=this.playerRoles[i];
                    i=this.playerRoles.length;
                }
            }
        }
    }
    
    /**
     * rimuove l'utente
     */
    removeLoggedUser(){
        this.storage.set('user',null);
        this.storage.set('events',null);
        
        
    }
    

    saveUser(user,cbOnSuccess,cbOnFailure){
        var self = this;
        
		try {
			window.localStorage.setItem('user', JSON.stringify(user));
                        this.user = user;
			cbOnSuccess(user);
		
                        
		} catch (ex) {
			cbOnFailure(ex);
			
		}
			
        
    }
    
    saveUserAsync(user,cbOnSuccess,cbOnFailure){
        var self = this;
        
		try {
			this.storage.set('user',user);
			cbOnSuccess();
		
		} catch (ex) {
			cbOnFailure(ex);
			
		}
			
        
    }
    
    
    /* salva un evento */
    updateEvents(events,cbOnSuccess,cbOnFailure){
        
         try {
             this.storage.set('events',events);
             cbOnSuccess();
         } catch (ex) {
             cbOnFailure(ex);
         }
                
                
         
    }
    updateEvent(event,cbOnSuccess,cbOnFailure){
        var self = this;
        this.storage.get('events').then((events) => {
             if(events==null){
                cbOnFailure(); 
             } else{
//                 console.log("events");
//                 console.log(events);
                 for(var i=0;i<events.length;i++){
                     var eventFound = events[i];
//                     console.log(eventFound);
//                     console.log(event);
                     if(eventFound.id==event.id){
                        events[i]=event; 
                        self.storage.set('events',events);
                        cbOnSuccess(events);
                        return;
                        
                     }
                 }
                 cbOnFailure();
             }
         });
    }
    saveEvent(event,cbOnSuccess,cbOnFailure){
//        console.log("salvo localmente evento");
//        console.log(event);
        var self = this;
        try{
          this.storage.get('events').then((events) => {
             if(events==null){
                events=[]; 
             }
             //var now = new Date();
             //var key = now.getFullYear()+now.getMonth()+now.getDate()+now.getHours()+now.getMinutes()+now.getSeconds();
             //event.id=key;
             //event.booked_at = new Date();
             events.push(event);
             self.storage.set('events',events);
//             console.log("inserito");
             cbOnSuccess(events);
             
         });
        } catch (ex){
//            console.log("errore");
//            console.log(ex);
            cbOnFailure(ex);
        }
        
    }
    insertOrUpdateMyContacts(contacts,cbOnSuccess,cbOnFailure){
        console.log("salvo nuovi contatti");
        console.log(contacts);
         var self = this;
         var mycontacts=contacts;
        try{
           var mycontactsLS = window.localStorage.getItem('mycontacts');
           
            console.log("mycontactsLS");
              console.log(mycontactsLS);
              
              if(mycontactsLS!=null){
                   mycontacts=JSON.parse(mycontactsLS);
              }
              var existsInLS = [];
              for(var i=0;i<mycontacts.length;i++){
                  var phoneInMyContactsLS = self.utilsService.phoneSanitize(mycontacts[i].phone);
                  existsInLS.push(phoneInMyContactsLS);
              }
              
              for(var i=0;i<contacts.length;i++){
                  var phoneInMyContactsNLS = self.utilsService.phoneSanitize(contacts[i].phone);
                  contacts[i].phone=phoneInMyContactsNLS;
                  var iof=existsInLS.indexOf(phoneInMyContactsNLS);
                  if(iof==-1){
                      mycontacts.push(contacts[i]);
                  } else {
                      mycontacts[iof]=contacts[i];
                        
                  }
              }
              console.log("mycontacts");
              console.log(mycontacts);
              
//              for(var i=0;i<mycontacts.length;i++){
//                     var phoneInMyContacts = self.utilsService.phoneSanitize(mycontacts[i].phone);
//                      for(var x=0;x<contacts.length;x++){
//                          var phoneInContact = self.utilsService.phoneSanitize(contacts[x].phone);
//                          if(phoneInMyContacts==phoneInContact){
//                             mycontacts[i]=contacts[x];
//                             x=contacts.length;
//                          }
//                      }
//                     
//               }
                 
             window.localStorage.setItem('mycontacts',JSON.stringify(mycontacts));
             cbOnSuccess(mycontacts);
             
         
        } catch (ex){
            cbOnFailure(ex);
        }
    }
    
    insertOrUpdateMyContactsAsync(contacts,cbOnSuccess,cbOnFailure){
         var self = this;
        
        try{
          this.storage.get('mycontacts').then((mycontacts) => {
             if(mycontacts==null){
                mycontacts=contacts; 
                
             } else {
                 for(var i=0;i<mycontacts.length;i++){
                     var phoneInMyContacts = self.utilsService.phoneSanitize(mycontacts[i].phone);
                      for(var x=0;x<contacts.length;x++){
                          var phoneInContact = self.utilsService.phoneSanitize(contacts[x].phone);
                          if(phoneInMyContacts==phoneInContact){
                             mycontacts[i]=contacts[x];
                             x=contacts.length;
                          }
                      }
                     
                 }
             }
             
             self.storage.set('mycontacts',mycontacts);
             cbOnSuccess(mycontacts);
             
         });
        } catch (ex){
            cbOnFailure(ex);
        }
    }
    
    insertOrUpdateMyContact(contact,cbOnSuccess,cbOnFailure){
        var phoneInContact = this.utilsService.phoneSanitize(contact.phone);
        try{
            var mycontactInLS = window.localStorage.getItem("mycontacts");
            console.log("mycontactInLS ");
            console.log(mycontactInLS);
            
            var mycontacts = [];
            if(mycontactInLS==null){
                
                mycontacts.push(contact);
                
            } else {
                mycontacts = JSON.parse(mycontactInLS);
                
                console.log("ora mycontacts ");
                console.log(mycontacts);
            
                for(var i=0;i<mycontacts.length;i++){
                     var phoneInMyContacts = this.utilsService.phoneSanitize(mycontacts[i].phone);
                     
                     
                      console.log("Confronto  "+phoneInMyContacts+ " con "+phoneInContact);
                
                     if(phoneInMyContacts==phoneInContact){
                         console.log("trovato contatto con messaggi "+contact.messages.length);
                         mycontacts[i]=contact;
                         mycontacts[i].messages=contact.messages;
                         console.log("ho aggiornato contatto con messaggi "+mycontacts[i].messages.length);
                         break;
                     }
                }
            
             
            }
            console.log("salvo su dispositivo:"+JSON.stringify(mycontacts));
            window.localStorage.setItem('mycontacts', JSON.stringify(mycontacts));
            cbOnSuccess(mycontacts);
            
        } catch (ex){
            cbOnFailure(ex);
        }

    }
    
   insertOrUpdateMyContactAsync(contact,cbOnSuccess,cbOnFailure){
        var self = this;
        var phoneInContact = self.utilsService.phoneSanitize(contact.phone);
        console.log("salvo dati del contatto");
        console.log(contact);
        console.log(phoneInContact);
        try{
          this.storage.get('mycontacts').then((mycontacts) => {
             if(mycontacts==null){
                mycontacts=[]; 
                mycontacts.push(contact);
             } else {
                 for(var i=0;i<mycontacts.length;i++){
                     console.log("contatto corrente");
                     console.log(mycontacts[i]);
                     var phoneInMyContacts = self.utilsService.phoneSanitize(mycontacts[i].phone);
                     
                     if(phoneInMyContacts==phoneInContact){
                         console.log("bingo!!!");
                         mycontacts[i]=contact;
                         mycontacts[i].messages=contact.messages;
                         console.log("contact.messages");
                         console.log(contact.messages);
                         
                         break;
                     }
                 }
             }
             
             self.storage.set('mycontacts',mycontacts);
             cbOnSuccess(mycontacts);
             
         });
        } catch (ex){
            cbOnFailure(ex);
        }

    }
    
    getMyContacts(cbOnSuccess,cbOnFailure){
         var self=this;
         var mycontactsLS = window.localStorage.getItem('mycontacts');
         console.log("mycontacts");
         console.log(mycontactsLS);
         
         if(mycontactsLS==null){
             cbOnFailure();
             return;
         }
         var mycontacts = JSON.parse(mycontactsLS);
          self.fetchContactsOnDevice(function(fetched){
                    cbOnSuccess(self.applyFilterMyContacts(mycontacts));
          },function(){
                    cbOnFailure();    
          });
                
         
    }
    
    getMyContactsAsync(cbOnSuccess,cbOnFailure){
         var self=this;
         this.storage.get('mycontacts').then((mycontacts) => {
          if(mycontacts==null){
                cbOnFailure();
            } else {
                self.fetchContactsOnDevice(function(fetched){
                    cbOnSuccess(self.applyFilterMyContacts(mycontacts));
                },function(){
                    cbOnFailure();    
                });
                
            }
         });
         
    }
    
    
    /* elenco eventi */
    getInvitedToEvents(cbOnSuccess,cbOnFailure){
         var self=this;
         this.storage.get('events').then((events) => {
//            console.log("events"); 
//            console.log(events);
            if(events==null){
                cbOnFailure();
            } else {
                cbOnSuccess(self.filterEvents(events,false));
            }
         });
         
    }
   getMyEvents(cbOnSuccess,cbOnFailure){
         var self=this;
         this.storage.get('events').then((events) => {
            if(events==null){
                cbOnFailure();
            } else {
                
                cbOnSuccess(self.filterEvents(events,true));
            }
         });
         
    }
    private filterEvents(events,my){
        var ret = [];
        for(var i=0;i<events.length;i++){
//            console.log("events[i]");
//            console.log(events[i]);
//            console.log("this.user");
//            console.log(this.user);
            if(this.utilsService.convertToInt(events[i].uid)===this.user.id && my){
//                console.log("lo prendo 1");
                ret.push(events[i]);
            }
            if(this.utilsService.convertToInt(events[i].uid)!=this.user.id && !my){
//                console.log("lo prendo 2");
                ret.push(events[i]);
            }
        }
        
        return ret;
        
    }
    private applyFilterMyContacts(contacts){
        var ret = [];
        for(var i=0;i<contacts.length;i++){
            var item = contacts[i];
            var contactOnDevice  = this.getContactByPhone(item.phone);
            if(contactOnDevice!=null){
                item.name = contactOnDevice.contact.displayName;
                ret.push(item);

            }
            
            
        }
        
        return ret;
        
    }
    
    
    getPlayerRoles(cbOnSuccess,cbOnFailure){
         var self = this;
         this.storage.get('player_roles').then((player_roles) => {
            if(player_roles==null){
                cbOnFailure();
            } else {
                self.playerRoles=player_roles;
                cbOnSuccess(player_roles);
            }
         });
         
    }
    
    
    saveStatus(){
        this.storage.set('player_roles',this.playerRoles);
        this.storage.set('user',this.user);
//        console.log("save status");
    }
    
    saveFirebaseToken(token){
        this.storage.set('firebase_token',token);
        
    }
    
    getFirebaseToken(cbOnSuccess,cbOnFailure){
        this.storage.get('firebase_token').then((token) => {
            if(token==null){
                cbOnFailure();
            } else {
                cbOnSuccess(token);
            }
         });
        
    }
    
    
}
@Injectable()
export class FBService {
    constructor(private fb: Facebook) {

    }
    
    getProfile(authResponse,cbOnSuccess,cbOnError){
        
//         this.fb.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,cbOnSuccess,cbOnError)
//                 .then(cbOnSuccess);
         
           return this.fb.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null)
                 .then(cbOnSuccess,cbOnError);
         
    
    }
    
}

@Injectable()
export class BEService {
    db;
    
    
    beGetSoccerFieldsURL: string = environment.beURL+"get-all-soccer-fields";
    beUserURL: string = environment.beURL+"user";
    beSearchURL: string = environment.beURL+"search";
    beSoccerFieldBookingURL: string = environment.beURL+"soccer-field-booking";
    beUserInviteDeleteDeclinedAndReplaceWithURL: string = environment.beURL+"user-invite/delete-declined-and-replace-with";
    beActivateURL: string = environment.beURL+"activate";
    beUpdateSetPhoneAndNameAndPlayerRoleURL: string = this.beUserURL+"/update-set-phone-and-name-player-role";
    beUpdatePrivacyURL: string = this.beUserURL+"/update-privacy";
    beUpdatePaypalEmailURL: string = this.beUserURL+"/update-paypal-email";
    
    beGetAllPlayerRolesURL: string = environment.beURL+"get-all-player-roles";
    beGetIncomingUserInvitesURL: string = environment.beURL+"user-invite/incoming";
    beGetIncomingRequestsUserInvitesURL: string = environment.beURL+"user-invite/requests";
    beGetOutgoingUserInvitesURL: string = environment.beURL+"user-invite/outgoing";
    beGetOutgoingStatusUserInvitesURL: string = environment.beURL+"user-invite/outgoing-status";
    beGetArchivedBookingURL: string = environment.beURL+"soccer-field-booking/archived";
    beAcceptUserInviteURL: string = environment.beURL+"user-invite/set-accepted";
    beNotAcceptUserInviteURL: string = environment.beURL+"user-invite/set-not-accepted";
    beFindForBookingURL: string = environment.beURL+"user-invite/find-for-booking";
    beSetBoughtMockURL: string = environment.beURL+"user-invite/set-bought";
    beTransportsURL: string = this.beUserURL+"/transport";
    beTransportsAvailabilityURL: string = this.beUserURL+"/transport-availability";
    beTransportsBookingURL: string = this.beUserURL+"/transport-booking";
    
    beAcceptTransportBookingURL: string = environment.beURL+"user/transport-booking/set-accepted";
    beNotAcceptTransportBookingURL: string = environment.beURL+"user/transport-booking/set-not-accepted";
    
    beTransportsBookingAsCarrierOrPassengerURL: string = environment.beURL+"user/transport-booking/all";
    beTransportsBookingAsCarrierOrPassengerForBookingURL: string = environment.beURL+"user/transport-booking/for-booking";
    beRemoveAccountURL: string = environment.beURL+"user/remove";
    beInviteSetVoteURL: string = environment.beURL+"user-invite/set-vote";
    beComposeTeamsRandomURL: string = environment.beURL+"soccer-field-booking/compose-teams-random";
    beGetTeamsCompositionInBookingURL: string = environment.beURL+"soccer-field-booking-team";
    beCreateOrUpdateRegistrationIdURL: string = environment.beURL+"create-or-update-registration-id";
    
    //Chat attachments
    beChatAttachmentURL: string = environment.beURL+"chat-attachment";
    beUserCheckURL: string = environment.beURL+"user/check";
    
    
    constructor(private utilsService:UtilsService,private persistenceService:PersistenceService,private http:HTTP) {
        this.init();
    }

//    constructor(private utilsService:UtilsService) {
//        this.init();
//    }
    init(){
        var self = this;
//        if(!this.db){
//            var model = {email:"test",name:"test"};
//            
//            firebase.initializeApp(config);
//            this.db =  firebase.database().ref();
//            this.db.child("users").on('value',function(users){
//                if(!users.exists())
//                    self.db.child("users").set("init");
//             });
//        }
    }
    saveUser(user){
        var self = this;
        var key = this.utilsService.phoneSanitize(user.phone);
        //var model = {email:user.email,name:user.name,pictureURL:user.pictureURL,loginWith:user.loginWith};
        var model = this.utilsService.makeUserForBE(user);
        this.db.child("users").child(key).on('value',function(record){
            
            if(!record.exists()){
                self.db.child("users").child(key).set(model);
            } else {
                self.db.child("users").child(key).update(model);
            }
            
            this.db.child("users").child(key).off("value");
            
        });
        
    }
    saveEvent(model){
        var self = this;
        this.persistenceService.getLoggedUser(function(user){
            var key = this.utilsService.phoneSanitize(user.phone);
            this.db.child("events").child(key).on('value',function(record){
            
            if(!record.exists()){
                self.db.child("events").child(key).set(model);
            } else {
                self.db.child("event").child(key).update(model);
            }
            
           this.db.child("events").child(key).off("value");
            
        });
        
        },function(err){});
        
        
        
        
        
        
    }
    
    
   doGet(url:string,cbOnSuccess,cbOnFailure){
        var self = this;
         console.log("doGet");
        console.log("URL:"+url);
        
        this.http.get(url, {},   { 'Content-Type': 'application/json' })
                .then(data => {
                    console.log("response from server ok");
                      console.log(data);
                      var payload = JSON.parse(data.data);
                       if(payload.success==undefined){
                          cbOnFailure("errore");
                          return;
                      }
                       if(payload.success){
                          cbOnSuccess(payload.data);
                      } else {
                          cbOnFailure(payload.error);
                      }
                      


                })
                .catch(error => {
                    console.log("response from server ko");
                    console.log(error);
                    cbOnFailure(error);


              });
    }
    
    doPost(url:string,rowData,cbOnSuccess,cbOnFailure){
        console.log("doPost");
        console.log("URL:"+url);
        console.log("rowData");
        console.log(rowData);
        const headers = new Headers();
        var self = this;
        //var toJSON = JSON.parse(rowData);
        var toJSON = rowData;
        console.log("toJSON");
        console.log(toJSON);
        
        
//        this.http.setDataSerializer('json');
//    this.http.setHeader("Accept", "application/json");
//    this.http.setHeader("Content-Type", "application/json");
//    
        this.http.post(url, toJSON, { "Content-Type": "application/json" })
                .then(data => {
                     console.log("response from server ok");
                      console.log(data);
                      var payload = JSON.parse(data.data);
                      console.log(payload.success);
                      if(payload.success==undefined){
                          cbOnFailure("errore");
                          return;
                      }
                      console.log("payload");
                      console.log(payload);
                      if(payload.success){
                          cbOnSuccess(payload.data);
                      } else {
                          cbOnFailure(payload.error);
                      }


                })
                .catch(error => {
                    console.log("response from server ko");
                    console.log(error);
                    cbOnFailure(error);


              });
    }
    
    getAllSoccerFields(cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetSoccerFieldsURL,cbOnSuccess,cbOnFailure);
    }    
    
    findUser(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beUserURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    
    
    /* registrazione utente */
    newUser(user,cbOnSuccess,cbOnFailure){
        user = this.utilsService.makeUserForBE(user);
        this.doPost(this.beUserURL,user,cbOnSuccess,cbOnFailure);
    }
    /* aggiorna i dati dell'utente */
    updateUser(id,user,cbOnSuccess,cbOnFailure){
        this.doPost(this.beUserURL+"/"+id,user,cbOnSuccess,cbOnFailure);
    }
    
     findUserWithUsername(username,cbOnSuccess,cbOnFailure){
        this.doGet(this.beSearchURL+"/user/"+username,cbOnSuccess,cbOnFailure);
    }
    newBooking(booking,cbOnSuccess,cbOnFailure){
        this.doPost(this.beSoccerFieldBookingURL,booking,cbOnSuccess,cbOnFailure);
    }
    
    userInviteDeleteDeclinedAndReplaceWith(id,data,cbOnSuccess,cbOnFailure){
        this.doPost(this.beUserInviteDeleteDeclinedAndReplaceWithURL+"/"+id,data,cbOnSuccess,cbOnFailure);
    }
    
    findBooking(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beSoccerFieldBookingURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    
    activate(activaction_code,cbOnSuccess,cbOnFailure){
        this.doGet(this.beActivateURL+"/"+activaction_code,cbOnSuccess,cbOnFailure);
    }
    updateSetPhoneAndNameAndPlayerRoleURL(uid,data,cbOnSuccess,cbOnFailure){
        this.doPost(this.beUpdateSetPhoneAndNameAndPlayerRoleURL+"/"+uid,data,cbOnSuccess,cbOnFailure);
    }
    updatePrivacy(uid,data,cbOnSuccess,cbOnFailure){
        this.doPost(this.beUpdatePrivacyURL+"/"+uid,data,cbOnSuccess,cbOnFailure);
    }
    updatePaypalEmail(uid,data,cbOnSuccess,cbOnFailure){
        this.doPost(this.beUpdatePaypalEmailURL+"/"+uid,data,cbOnSuccess,cbOnFailure);
    }
    getAllPlayerRoles(cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetAllPlayerRolesURL,cbOnSuccess,cbOnFailure);
    }
    getIncomingUserInvites(uid,cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetIncomingUserInvitesURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    beGetIncomingRequestsUserInvites(uid,cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetIncomingRequestsUserInvitesURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    getOutgoingUserInvites(uid,cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetOutgoingUserInvitesURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    getOutgoingStatusUserInvites(uid,cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetOutgoingStatusUserInvitesURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    
    setAcceptInvite(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beAcceptUserInviteURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    setNotAcceptInvite(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beNotAcceptUserInviteURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    findForBooking(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beFindForBookingURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    setBoughtMock(uid,id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beSetBoughtMockURL+"/"+uid+"/"+id,cbOnSuccess,cbOnFailure);
    }
    
    trasportsInsertOrUpdate(data,cbOnSuccess,cbOnFailure){
       var uid = this.persistenceService.user.id;
        this.doPost(this.beTransportsURL+"/"+uid,data,cbOnSuccess,cbOnFailure);
    }
    trasportsFindOne(id,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsURL+"/"+uid+"/"+id,cbOnSuccess,cbOnFailure);
    }
    trasportsFindAll(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    /**
     * <p>Restituisce i mezzi di trasporto disponibili per un dato utente</p>
     */
    trasportsOfUserFindAll(uid,cbOnSuccess,cbOnFailure){
        this.doGet(this.beTransportsURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    
    trasportsAvailabilityInsertOrUpdate(data,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doPost(this.beTransportsAvailabilityURL+"/"+uid,data,cbOnSuccess,cbOnFailure);
    }
    trasportsAvailabilityFindOne(id,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsAvailabilityURL+"/"+uid+"/"+id,cbOnSuccess,cbOnFailure);
    }
    trasportsAvailabilityFindAll(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsAvailabilityURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    
    
    trasportsBookingInsertOrUpdate(data,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doPost(this.beTransportsBookingURL+"/"+uid,data,cbOnSuccess,cbOnFailure);
    }
    trasportsBookingFindOne(id,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsBookingURL+"/"+uid+"/"+id,cbOnSuccess,cbOnFailure);
    }
    trasportsBookingFindAll(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsBookingURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    
   
    setAcceptTransportBooking(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beAcceptTransportBookingURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    setNotAcceptTransportBooking(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beNotAcceptTransportBookingURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    
    
    
    transportsBookingAsCarrierOrPassenger(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsBookingAsCarrierOrPassengerURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    transportsBookingAsCarrierOrPassengerForBooking(id,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beTransportsBookingAsCarrierOrPassengerForBookingURL+"/"+uid+"/"+id,cbOnSuccess,cbOnFailure);
    }
 
    
    getArchivedBooking(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beGetArchivedBookingURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    
    removeAccount(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beRemoveAccountURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
    
    inviteSetVote(data,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doPost(this.beInviteSetVoteURL,data,cbOnSuccess,cbOnFailure);
    }
    composeTeamsRandom(data,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doPost(this.beComposeTeamsRandomURL,data,cbOnSuccess,cbOnFailure);
    }
    getTeamsCompositionInBooking(id,cbOnSuccess,cbOnFailure){
        this.doGet(this.beGetTeamsCompositionInBookingURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    createOrUpdateRegistrationId(data,cbOnSuccess,cbOnFailure){
        this.doPost(this.beCreateOrUpdateRegistrationIdURL,data,cbOnSuccess,cbOnFailure);
    }
    
    //Chat attachments
    beChatAttachmentInsert(uid_to,attachment_type,data,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doPost(this.beChatAttachmentURL+"/"+uid+"/"+uid_to+"/"+attachment_type,data,cbOnSuccess,cbOnFailure);
    }
    
    beChatAttachmentFind(id,cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beChatAttachmentURL+"/"+id,cbOnSuccess,cbOnFailure);
    }
    
    beUserCheck(cbOnSuccess,cbOnFailure){
        var uid = this.persistenceService.user.id;
        this.doGet(this.beUserCheckURL+"/"+uid,cbOnSuccess,cbOnFailure);
    }
}



enum USER_STATUS {
  OFFLINE,
  ONLINE,
  BUSY,
  TYPING
};
@Injectable()
export class FirebaseChatService {
    fbUsers;
    fbMessages;
    fbBase;
    constructor(private persistenceService : PersistenceService) {
        
        
    } 
    reconnect(){
        firebaseDB.database().goOnline();   
    }
    disconnect(){
       this.fbUsers = null;
       this.fbMessages = null;
       this.fbBase = null;
       firebaseDB.database().goOffline();   
    }
    
    init(){
        if(!this.fbUsers){
           console.log("this.fbUsers is null"); 
           // Firebase.getDefaultConfig().setPersistenceEnabled(true);
            //Firebase ref = new Firebase(apiUrl);
            
//
//            this.fbUsers = firebaseDB.database().ref('users/');
//            
//            this.fbMessages = firebaseDB.database().ref('messages/');
           // this.fbBase = firebaseDB.database().ref();
            
          //  this.fbBase.keepSynced(true);
            
        } else {
            console.log("this.fbUsers is not null");
        }
    }
    
    replaceAll(str, cerca, sostituisci) {
        return str.split(cerca).join(sostituisci);
    }

    
    makeUserInfoName(buddyid:string){
        return this.toi( buddyid)+"_info";
        
        
    }
    toi(buddyid:string){
        var ret = this.replaceAll(buddyid," ","");
        ret = this.replaceAll(ret,"+","");
        return ret;
        
    }
    makeChatOneToOneName(from:string,to:string){
        
        var fromTOI = parseInt(from.replace(" ","").replace("+",""));
        var toTOI = parseInt(to.replace(" ","").replace("+",""));
        var ret =fromTOI<toTOI ? new String(fromTOI)+"-"+new String(toTOI) :new String(toTOI)+"-"+new String(fromTOI) ;
        
        return ret;
        
        
    }
    listenOnMessageAdded1(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        this.fbMessages.child(room_name).on('child_added',function(snap){
            cb(snap,to);
        });
         
    }
    listenOnMessageAdded(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        firebaseDB.database().ref('messages/').child(room_name).on('child_added',function(snap){
            cb(snap,to);
        });
         
    }
    
    listenOnMessageUpdated(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        firebaseDB.database().ref('messages/').child(room_name).on('child_changed',function(snap){
            cb(snap,to);
        });
         
    } 
    listenOnMessageDeleted(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        firebaseDB.database().ref('messages/').child(room_name).on('child_removed',function(snap){
            cb(snap,to);
        });
         
    } 
    
    
    listenOnMessageUpdated1(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        this.fbMessages.child(room_name).on('child_changed',function(snap){
            cb(snap,to);
        });
         
    } 
    listenOnMessageDeleted1(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        this.fbMessages.child(room_name).on('child_removed',function(snap){
            cb(snap,to);
        });
         
    } 
    
    
    
    listenOnChat(to:string,cb){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        //this.fbMessages.child(room_name).on('value',function(snap){
       firebaseDB.database().ref('messages/').child(room_name).on('value',function(snap){
            if(!snap.exists()){
                console.log("la room "+room_name+" non esiste");
                try{
                    //self.fbBase.child("messages").update(room_name);
                    //self.fbBase.child("messages").child(room_name).set("");
                } catch (ex){
                    console.log(ex);
                }
                
            } else {
                console.log("la room "+room_name+"  esiste");
            }
            cb(snap);
        });
        
        
        
        
    }
    listenOnUserStatus(buddyid:string,cb){
        this.init();
        var self=this;
        let user_info = this.makeUserInfoName(buddyid);
        console.log(user_info);
        //this.fbUsers.child(user_info).on('value',function(snap){
        
        firebaseDB.database().ref('users/').child(user_info).on('value',function(snap){
            
            cb(snap,buddyid);
        });
        
        
        
        
    }
    register(){
        this.init();
        var self = this;
        var user = this.persistenceService.user;
        let model = {
                 phone:user.phone
                ,status:0
                ,typing_to:""
                ,welcome:"Ciao sto usando firebase chat"
                ,pictureURL:""
                 
        }
        
        let user_info = this.makeUserInfoName(user.phone);
        this.fbBase.child("users").child(user_info).on('value',function(snap){
            
            if(!snap.exists()){
                self.fbBase.child("users").child(user_info).set(model);
            
            }
            
        });
        
   
    }
    
    updateStatusSetRead(message_id,destination){
        let room_name = this.makeChatOneToOneName(this.persistenceService.user.phone,destination);
        //this.fbMessages.child(room_name).child(message_id).child("status").set("3");
        firebaseDB.database().ref('messages/').child(room_name).child(message_id).child("status").set("3");
    }
    updateStatusSetReceived(message_id,destination){
        let room_name = this.makeChatOneToOneName(this.persistenceService.user.phone,destination);
        //this.fbMessages.child(room_name).child(message_id).child("status").set("2");
        firebaseDB.database().ref('messages/').child(room_name).child(message_id).child("status").set("2");
    }
    
    
    sendTextMessage(text:string,destination:string,client_id:string){
        this.init();
        
        let room_name = this.makeChatOneToOneName(this.persistenceService.user.phone,destination);
        console.log("creo la room " + room_name);
        //creo la room
        //this.fbMessages = firebase.database().ref('messages/'+room_name);
        //let message = this.fbMessages.child(room_name).push();
        let message = firebaseDB.database().ref('messages/').child(room_name).push();
        let payload = new ChatMessagePayloadModel();
        payload.setTextMessage();
        payload.payload=text;
        payload.client_id=client_id;
        payload.from=this.persistenceService.user.phone;
        payload.to=destination;
        payload.setSentToServer();
        payload.sendDate=Date();
        console.log("invio messaggio verso fb");
        console.log(payload.toJSON());
        message.set(payload.toJSON()
                , function(error) {
                    if (error) {
                      console.log("ERRORE");
                      console.log(error);
                    } else {
                      // Data saved successfully!
                      console.log("MESSAGGIO INVIAO");
                    }
                  });
       let user_info = this.makeUserInfoName(this.persistenceService.user.phone);
        firebaseDB.database().ref('users/').child(user_info).child("last_message").set(payload.toJSON());
        
   
    }
    
    sendVoiceMessage(url:string,destination:string){
        this.sendAttachmentMessage("voice",url,destination);
    }
    sendImageMessage(url:string,destination:string){
        this.sendAttachmentMessage("image",url,destination);
    }
    sendVideoMessage(url:string,destination:string){
        this.sendAttachmentMessage("video",url,destination);
    }
     private sendAttachmentMessage(type:string,url:string,destination:string){
        this.init();
        
        let room_name = this.makeChatOneToOneName(this.persistenceService.user.phone,destination);
        //creo la room
       // let message = this.fbMessages.child(room_name).push();
        let message = firebaseDB.database().ref('messages/').child(room_name).push();
        let payload = new ChatMessagePayloadModel();
        if(type=="voice")
            payload.setVoiceMessage();
        if(type=="image")
            payload.setImageMessage();
        if(type=="video")
            payload.setVideoMessage();
    
        payload.payload=url;
        payload.from=this.persistenceService.user.phone;
        payload.to=destination;
        payload.setSentToServer();
        payload.sendDate=Date();
        message.set(payload.toJSON());
       
        
        
   
    }
    
    sendTyping(destination:string){
        this.init();
        let user_info = this.makeUserInfoName(this.persistenceService.user.phone);
        console.log("sendTyping");
        console.log(user_info);
//        this.fbUsers.child(user_info).child("status").set(USER_STATUS.ONLINE);
//        this.fbUsers.child(user_info).child("typing_to").set(destination);
//        
        
        firebaseDB.database().ref('users/').child(user_info).child("status").set(USER_STATUS.ONLINE);
        firebaseDB.database().ref('users/').child(user_info).child("typing_to").set(destination);
        
        
        
        
   
    }
    sendTypingNone(){
        this.init();
        let user_info = this.makeUserInfoName(this.persistenceService.user.phone);
//        this.fbUsers.child(user_info).child("status").set(USER_STATUS.ONLINE);
//        this.fbUsers.child(user_info).child("typing_to").set("");
        firebaseDB.database().ref('users/').child(user_info).child("status").set(USER_STATUS.ONLINE);
        firebaseDB.database().ref('users/').child(user_info).child("typing_to").set("");
        
        
        
   
    }
    
    cancelToListenOnChat(destination:string, cb){
        this.init();
        let room_name = this.makeChatOneToOneName(this.persistenceService.user.phone,destination);
        //creo la room
       // this.fbMessages = firebaseDB.database().ref('messages/'+room_name);
       // this.fbMessages.off("value");
        
        
    }
    
   
    
   cancelToListenOnUserStatus(buddyid:string, cb){
        this.init();
        var self=this;
        let user_info = this.makeUserInfoName(buddyid);
        
        this.fbBase = firebaseDB.database().ref("users/"+user_info);
        this.fbBase.off("value");
        
        
        
        
        
    }
    
     cancelListenOnMessageAdded(to:string){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        //this.fbMessages.child(room_name).off('child_added');
        firebaseDB.database().ref('messages/').child(room_name).off('child_added');
        
         
    }
    cancelListenOnMessageUpdated(to:string){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        //this.fbMessages.child(room_name).off('child_changed');
        firebaseDB.database().ref('messages/').child(room_name).off('child_changed');
         
    } 
    cancelListenOnMessageDeleted(to:string){
        this.init();
        var self=this;
        var user = this.persistenceService.user;
        let room_name = this.makeChatOneToOneName(user.phone,to);
        //this.fbMessages.child(room_name).off('child_removed');
       firebaseDB.database().ref('messages/').child(room_name).off('child_removed');
         
    } 
    
    makeChatModelFromFBEntry(fbEntry){
      var entry               = fbEntry.val();
      var server_id           = fbEntry.key;
      var ret                 = new ChatMessage();
      ret.text                = entry.payload;
      ret.server_id           = server_id;
      ret.client_id           = entry.client_id!=undefined ? entry.client_id : "";
      ret.status              = entry.status;
      ret.type                = entry.type;
     return ret;
       
  }
   makeChatModelFromFBChatModel(entry){
       
//        text:string="";
//    status:number=0;//0 non inviato, 1 inviato al server, 2 inviato al client, 3 letto da client
//    incoming:number=0;//0 messaggi che ho inviato, 1 messaggi che ho ricevuto
//    received_or_sent_at:Date=null;
//    server_id : string = "";
//    client_id : string = "";
//    type:string="text";
//    
      var ret                 = new ChatMessage();
      ret.text                = entry.payload;
      ret.client_id           = entry.client_id!=undefined ? entry.client_id : "";
      ret.status              = entry.status;
      ret.type                = entry.type;
     return ret;
       
  }
}
