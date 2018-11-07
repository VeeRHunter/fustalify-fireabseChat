import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
export class PlayerRole {
    id:number=0;
    name:string="";
    
    

}
export class User {
    id:number=0;
    username:string="";
    loginWith:string="fb";
    accessToken:string="";
    expiresIn:number=0;
    name:string="";
    surname:string="";
    email:string="";
    pictureURL:string="";
    phone:string="";
    fb_id:string="";
    preferred_prid:number;
    playerRole:PlayerRole;
    last_latitude:number;
    last_longitude:number;
    paypal_email:string="";
    flag_privacy_all_can_view_my_number:number;
    
    
}
export class FriendModel {
    phone:string="";
    accepted:number=0;
    
    
}
export class EventModel {
  id:number;  
  sfid:number;
  uid:number;
  name: string;
  notes: string;
  created_at: Date;
  event_date: Date;
  event_time: Date;
  location: string;
  amount: number;
 
  friends: Array<FriendModel>;
  
  constructor() {
      this.friends= new Array<FriendModel>();
      
  }
  
}
export class EventsModel {
  items: Array<EventModel>;
   constructor() {
      this.items= new Array<EventModel>();
      
  }
}

export class SelectedContactForEvent {
  contact:Contact;
  mainPhone:string;
  position:number;
}
export class SoccerFieldModel {
  name: string;
  latitude: string;
  longitude: string;
  id: number;
  uid: number;
  phone:string;
  address:string;
  description:string;
  fax:string;
  email:string;
  main_picture:string;
  website:string;
  city:string;
  province:string;
  monday_is_open:string;
  tuesday_is_open:string;
  wednesday_is_open:string;
  thursday_is_open:string;
  friday_is_open:string;
  saturday_is_open:string;
  sunday_is_open:string;
  
  
}
export class IncomingUserInviteModel {
   id: number;
   invited_from_phone:string;
   invited_from_name:string;
   soccerField:any;
   playerRole:any;
   booking:any;
   soccer_field_bought_at:string;
   soccer_field_bought_amount:number;
   friend_is_accepted:number;
   uid_from : number;
   friend_uid : number;
   vote : number;
   unknown:number=0;
   flag_privacy_all_can_view_my_number:number=1;
   friend_phone : string;
}

export class OutgoingUserInviteModel {
   id: number;
   invited_to_phone:string;
   invited_to_name:string;

}

export class SoccerFieldBookingModel {
    id : number;
    sfid : number;
    booked_at : Date;
    booked_at_as_human : string;
    
    from_time : string;
    to_time : string;
    uid : number;
    status : number;
    name : string;
    notes : string;
    amount: number;
    invites : Array<UserInviteModel> = new Array<UserInviteModel>();
    exists_teams:number=0;
    
}
export class SoccerFieldBookingModelExtend extends SoccerFieldBookingModel {
    invitesAccepted : Array<UserInviteModel> = new Array<UserInviteModel>();
    invitesDeclined : Array<UserInviteModel> = new Array<UserInviteModel>();
    invitesWaiting : Array<UserInviteModel> = new Array<UserInviteModel>();
    countInvitesNotSent : number;
}
export class UserInviteModel {
    id : number;
    uid_from : number;
    friend_uid : number;
    friend_phone : string;
    friend_is_accepted : number;
    sfbid : number;
    prid : number;
    soccer_field_bought_at : Date;
    soccer_field_bought_amount : number;
   
}


export class UserTransportModel {
    id : number;
    uid_carrier : number;
    name : string;
    description : string;
    availability : number;
   
}

export class UserTransportAvailabilityModel {
    id : number;
    sfbid : number;
    uid_carrier : number;
    availability : number;
   
}


export class UserTransportBookingModel {
    id : number;
    sfbid : number;
    utid : number;
    uid_carrier : number;
    uid_passenger : number;
    carrier: User;
    passenger:User;
    soccerFieldBooking:SoccerFieldBookingModel;
    userTransport:UserTransportModel;
    
   
}
export class SoccerFieldBookingTeamPlayer {
    phone : string;
    playerRole:PlayerRole;
    name:string;
}
export class SoccerFieldBookingTeam {
    id : number;
    sfbid : number;
    tshirt : string;
    player : Array<SoccerFieldBookingTeamPlayer> = new Array<SoccerFieldBookingTeamPlayer>();
    
   
}
export class ChatMessage {
    text:string="";
    status:number=0;//0 non inviato, 1 inviato al server, 2 inviato al client, 3 letto da client
    incoming:number=0;//0 messaggi che ho inviato, 1 messaggi che ho ricevuto
    received_or_sent_at:Date=null;
    server_id : string = "";
    client_id : string = "";
    type:string="text";
    
}
export class MyContact {
    name:string="";
    phone:string="";
    typing:number=0;
    online:number=0;
    last_loging:Date=null;
    messages : Array<ChatMessage> = new Array<ChatMessage>();
    count_new_incoming:number;
    last_message:ChatMessage=null;
    
}

export class ChatMessagePayloadModel {
    from:string = "";
    to:string = "";
    type:string = "";
    payload:string = "";
    status:number =0;
    sendDate:any;
    client_id:string;
    setTextMessage(){
        this.type="text";
    }
    setTypingMessage(){
        this.type="typing";
    }
    
    setVoiceMessage(){
        this.type="voice";
    }
    setImageMessage(){
        this.type="image";
    }
    setVideoMessage(){
        this.type="video";
    }
    
    isTextMessage(){
        return this.type=="text";
    }
    isVoiceMessage(){
        return this.type=="voice";
    }
    isImageMessage(){
        return this.type=="image";
    }
    isVideoMessage(){
        return this.type=="video";
    }
    setUnsent(){
        this.status=0;
    }
    setSentToServer(){
        this.status=1;
    }
    setReceivedFromServer(){
        this.status=2;
    }
    setReadFromDestination(){
        this.status=3;
    }
    
    isUnsent(){
        return this.status==0;
    }
    isSentToServer(){
        return this.status==1;
    }
    isReceivedFromServer(){
        return this.status==2;
    }
    isReadFromDestination(){
        return this.status==3;
    }
    
    toJSON(){
        return {
            payload:this.payload
            ,status:this.status
            ,from:this.from
            ,to:this.to
            ,type:this.type
            ,sendDate:this.sendDate
            ,client_id:this.client_id
        };
    }
    
}