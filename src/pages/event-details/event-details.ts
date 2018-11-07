import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App  } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { MyEventsPage } from '../my-events/my-events';
import { BuyYourPartPage } from '../buy-your-part/buy-your-part';
import { SelectContactsForBookingPage } from '../select-contacts-for-booking/select-contacts-for-booking';
import { CreateTeamsCompositionPage } from '../create-teams-composition/create-teams-composition';
import { TeamsCompositionPage } from '../teams-composition/teams-composition';

//Altro
import { SoccerFieldModel,EventModel,SoccerFieldBookingModel,SoccerFieldBookingModelExtend } from '../../app/models';
import { PersistenceService,BEService,UtilsService } from '../../app/services';


@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage extends BasePage {

  model : SoccerFieldBookingModelExtend = new SoccerFieldBookingModelExtend();
  soccerFieldBookingModel : SoccerFieldBookingModel = new SoccerFieldBookingModel();
  buyYourPartButtonEnabled : boolean = false;
  howInvitedButtonEnabled : boolean = false;
  buttonsEnabled = {pay: false,add_friends:false,compose_teams:false};
  constructor( public navCtrl: NavController
              , public navParams: NavParams
               ,public beService: BEService
               ,public persistenceService : PersistenceService
               ,public loadingCtrl: LoadingController
               ,public toastCtrl: ToastController
               ,public app: App
               ,public utilsService: UtilsService
         ) {
            super(persistenceService,beService,loadingCtrl,toastCtrl,app);
            console.log("EventDetailsPage called");
         //this.model                    = this.navParams.get("model") as SoccerFieldBookingModelExtend;
         this.model                    = new SoccerFieldBookingModelExtend();
         this.soccerFieldBookingModel  = this.navParams.get("model") as SoccerFieldBookingModel;
         this.showLoading();
         beService.findBooking(this.soccerFieldBookingModel.id,this.findBookingSuccess.bind(this),this.findBookingFailure.bind(this));
         console.log("this.model");
         console.log(this.model);
         
  }
  private findBookingSuccess(remote) {
      this.buttonsEnabled.pay=false;
      this.model = this.utilsService.makeSoccerFieldBookingModelExtend(this.soccerFieldBookingModel);
      this.buttonsEnabled.add_friends=this.model.invitesDeclined.length>0;
      this.buttonsEnabled.compose_teams=this.model.exists_teams==1 || this.model.uid==this.user.id;
      //this.buttonsEnabled.pay=this.model.invitesDeclined.length>0;
      
      if(!this.persistenceService.userHasPayedHisQuote(this.model)){
             this.buttonsEnabled.pay=true;
      }
      if(this.user.id==this.model.uid){
             this.howInvitedButtonEnabled=true;
      }
         
      this.hideLoading();
      
  }
  private findBookingFailure() {
    this.hideLoading();
    this.showGenericError();

  }
  
  buyYourPart() {
     this.navigateTo(BuyYourPartPage,{model:this.model});
  }
  howInvited() {
    this.navigateTo(BuyYourPartPage,{model:this.model}); 
  }

  inviteFriends(){
        var maxSelected = this.model.invitesDeclined.length;
        this.navigateTo(SelectContactsForBookingPage,{maxSelected:maxSelected,model:this.model,source:this.soccerFieldBookingModel});
  }

  composeTeams(){
    this.navigateToPreserveBack(TeamsCompositionPage,{model:this.model.id});
  }

}
