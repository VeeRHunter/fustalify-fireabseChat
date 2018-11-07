import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App,AlertController } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { CreateTeamsCompositionPage } from '../create-teams-composition/create-teams-composition';


//Altro
import { PersistenceService,BEService,UtilsService } from '../../app/services';
import { SoccerFieldBookingTeamPlayer,SoccerFieldBookingTeam } from '../../app/models';

@IonicPage()
@Component({
  selector: 'page-teams-composition',
  templateUrl: 'teams-composition.html',
})
export class TeamsCompositionPage extends BasePage {
  team1 : SoccerFieldBookingTeam = new SoccerFieldBookingTeam();
  team2 : SoccerFieldBookingTeam = new SoccerFieldBookingTeam();
  players_in_team1 : Array<SoccerFieldBookingTeamPlayer> = new Array<SoccerFieldBookingTeamPlayer>();
  players_in_team2 : Array<SoccerFieldBookingTeamPlayer> = new Array<SoccerFieldBookingTeamPlayer>();
  id:number;
  constructor(
          public navCtrl: NavController
         ,public navParams: NavParams
         ,public persistenceService : PersistenceService
         ,public beService:BEService
         ,public loadingCtrl: LoadingController
         ,public toastCtrl: ToastController
         ,public app: App
         ,private alertCtrl: AlertController
        ,private utilsService : UtilsService
        ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.id  = this.navParams.get("model") as number;
       
  }
  ionViewDidLoad() {
     var self = this; 
     this.showLoading();  
     var currentUser = this.user;
     var userPhone = this.utilsService.phoneSanitize(currentUser.phone);
     var currentPhone ="";
     var localContact = null;
     var name = null;

    this.beService.getTeamsCompositionInBooking( this.id ,function(remote){
         self.hideLoading(); 
         self.players_in_team1 = remote.players_in_team1;
         self.players_in_team2 = remote.players_in_team2;
         
         
         for(var i=0;i<self.players_in_team1.length;i++){
             currentPhone =self.utilsService.phoneSanitize(self.players_in_team1[i].phone);
             if(userPhone==currentPhone){
                 self.players_in_team1[i].name="Tu";
             } else {
                localContact = self.persistenceService.getContactByPhone(currentPhone);
                name = localContact==null ? "Sconosciuto" : localContact.contact.displayName;

                self.players_in_team1[i].name=name;

             }
             
         }
         for(var i=0;i<self.players_in_team2.length;i++){
             currentPhone =self.utilsService.phoneSanitize(self.players_in_team2[i].phone);
              if(userPhone==currentPhone){
                  self.players_in_team2[i].name="Tu";
             } else {
                localContact = self.persistenceService.getContactByPhone(currentPhone);
                name = localContact==null ? "Sconosciuto" : localContact.contact.displayName;
                self.players_in_team2[i].name=name;

             }
             
         }
         
         console.log("self.players_in_team1");
         console.log(self.players_in_team1);
         
         console.log("self.players_in_team2");
         console.log(self.players_in_team2);
         
         
        
    },function(err){
        self.hideLoading();  
        self.navigateTo(CreateTeamsCompositionPage,{model:self.id});
        //self.showGenericError(); 
    });
  }

}
