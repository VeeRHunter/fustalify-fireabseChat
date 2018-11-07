import { LoadingController,ToastController,App  } from 'ionic-angular';
import { User } from './models';
import { PersistenceService,BEService } from './services';
import { SoccerFieldModel,EventModel,SoccerFieldBookingModel } from './models';

export class BasePage {
    user                : User = new User();    
    soccerFields        : Array<SoccerFieldModel> = new Array<SoccerFieldModel>();
    copyOfSoccerFields        : Array<SoccerFieldModel> = new Array<SoccerFieldModel>();
    selectedSoccerField : SoccerFieldModel = new SoccerFieldModel();
    selectedEvent       : SoccerFieldBookingModel = new SoccerFieldBookingModel();
    loading: any;
    loaded:boolean = false;
    
    constructor( 
                public persistenceService : PersistenceService
                ,public beService : BEService
                ,public loadingCtrl: LoadingController
                ,public toastCtrl: ToastController
                ,public app: App
                ) {
        //this.persistenceService.getLoggedUser(this._existsUser.bind(this),this._notExistsUser.bind(this));
        this.loading = this.loadingCtrl.create();
        this.user = this.persistenceService.user;
    }
  
    register(user:User, cbOnSuccess, cbOnFailure) {
      this.persistenceService.saveUser(user,cbOnSuccess,cbOnFailure);
    }
    _existsUser(user) {
         this.user = user;

    }
    _notExistsUser(err) {
         this.user = new User();  

    }
    
    searchSoccerFields(){
        
       
            this.beService.getAllSoccerFields(this.onSearchSoccerFieldsSuccess.bind(this),this.onSearchSoccerFieldsFailure.bind(this));
       
        
    }
    onSearchSoccerFieldsSuccess(data){
       
       this.soccerFields = data;
//       
//      var payload = data;
//      for(var i=0;i<payload.length;i++){
//          var item = payload[i];
//          var sfm = new SoccerFieldModel();
//          sfm.name=item.name;
//          sfm.latitude=item.latitude;
//          sfm.longitude=item.longitude;
//          sfm.id=item.id;
//          sfm.uid=item.uid;
//          sfm.phone=item.phone;
//          sfm.address=item.address!=undefined && item.address!=null ? item.address : "Sconosciuto";
//          this.soccerFields.push(sfm);
//          
//      }
      this.copyOfSoccerFields=this.soccerFields;
      
    }
    onSearchSoccerFieldsFailure(err){
        //todo
    }
    
    
    
   showToast(msg:string) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top'
        });

        toast.onDidDismiss(() => {
          
        });

        toast.present();
   }
   
    showLoading() {
        this.loading.present();
    }
    
    hideLoading() {
       this.loading.dismiss();
    }
    
    showGenericError() {
       this.showToast("Si è verificato un errore tecnico");
    }
    
   navigateTo(page,parameters) {
        // close the menu when clicking a link from the menu
        let nav = this.app.getRootNav();
        // navigate to the new page if it is not the current page
        nav.setRoot(page,parameters);
  }
  navigateToPreserveBack(page,parameters) {
        // close the menu when clicking a link from the menu
        let nav = this.app.getRootNav();
        // navigate to the new page if it is not the current page
        nav.push(page,parameters);
  }
}

