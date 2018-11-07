import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
//Pagine
import { BasePage } from '../../app/BasePage';
import { ComposePlayerTeamPage } from '../compose-player-team/compose-player-team';
import { SelectContactsForBookingPage } from '../select-contacts-for-booking/select-contacts-for-booking';

//Altro
import { SoccerFieldModel,EventModel,SoccerFieldBookingModel } from '../../app/models';
import { PersistenceService,BEService,UtilsService } from '../../app/services';

/**
 * Generated class for the CheckSoccerFieldAvailabilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-check-soccer-field-availability',
  templateUrl: 'check-soccer-field-availability.html',
})
export class CheckSoccerFieldAvailabilityPage   extends BasePage {

  onSubmitEnabled:boolean = false;
  onCheckEnabled:boolean = true;
  onCallPhoneEnabled:boolean = true;
  model : EventModel = new EventModel();
  constructor(
           public navCtrl: NavController
          ,public navParams: NavParams
          ,public beService: BEService
          ,public persistenceService : PersistenceService
          ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
          ,private callNumber: CallNumber
            ,private utilsService:UtilsService
            ,public app: App                    
    ) {
        super(persistenceService,beService,loadingCtrl,toastCtrl,app);
        this.selectedEvent=new SoccerFieldBookingModel();
        this.persistenceService.selectedContacts=[];
        this.model = new EventModel();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18);
        tomorrow.setMinutes(0);
        this.model.event_date = tomorrow;
        this.model.event_time = tomorrow;
        
        
       
  }
  ionViewWillLoad() {
      this.onCheckEnabled=true;
      this.selectedSoccerField=this.persistenceService.selectedSoccerField ;
      if(this.selectedSoccerField.uid==undefined || this.selectedSoccerField.uid==null || this.selectedSoccerField.uid==0){
            this.onCheckEnabled=false;
            this.onCallPhoneEnabled=true;
            this.onSubmitEnabled=true;
      } 
      
  }
 
  onSubmit() {
      console.log("this.model");
      console.log(this.model);
      this.persistenceService.selectedEvent.booked_at = this.model.event_date;
      this.persistenceService.selectedEvent.from_time = this.utilsService.convertTimeToStringHHII(this.model.event_time);
    //this.navigateTo(ComposePlayerTeamPage,{});
    this.navigateTo(SelectContactsForBookingPage,{});
    
  }
  
  
  onCheck() {
      
    this.onCheckEnabled=false;
    //mock
     this.onCheckSuccess({available:true});
  }
  onPhoneCall() {
      var phone = this.selectedSoccerField.phone;
      if(phone==undefined || phone==""){
          this.showToast("il numero fornito dal gestore non è corretto,impossibile effettuare la chiamata");
          return;
      }
      this.callNumber.callNumber(phone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));

      this.onSubmitEnabled=true;
  }
  
  
  onCheckSuccess(data){
      this.onSubmitEnabled=false;
      this.onCheckEnabled=false;
      if(data.available){
          this.onSubmitEnabled=true;
          alert("Disponibile");
      } else {
          this.onCheckEnabled=true;
          
      }
  }
  onCheckFailure(){
      alert("erorre");
  }

}
