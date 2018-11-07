import { Component } from '@angular/core';
import { App,IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';

//Pagine
import { BasePage } from '../../app/BasePage';
import { SoccerFieldDetailsPage } from '../soccer-field-details/soccer-field-details';

//Altro
import { PersistenceService,BEService,UtilsService } from '../../app/services';
import { SoccerFieldModel } from '../../app/models';

@IonicPage()
@Component({
  selector: 'page-select-soccer-field-for-event',
  templateUrl: 'select-soccer-field-for-event.html',
})
export class SelectSoccerFieldForEventPage  extends BasePage {

  public  items: Array<SoccerFieldModel>;
  public  copyOfItems: Array<SoccerFieldModel>;
  searchQuery: string = '';
  constructor(
          public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService : PersistenceService
          ,public beService : BEService 
          ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
          ,public app: App
          ,public utilsService: UtilsService
          ) {
      super(persistenceService,beService,loadingCtrl,toastCtrl,app);
      this.items = new Array<SoccerFieldModel>();
      this.copyOfItems = new Array<SoccerFieldModel>();
      
      
  }
  
  
 getItems(ev: any) {
    console.log("getItems");
    
    console.log("this.copyOfItems");
      console.log(this.copyOfItems);
      
   this.soccerFields = this.copyOfSoccerFields;
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log("val");
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
         console.log("val1");
    console.log(val);
        console.log("this.soccerFields.length");
    console.log(this.soccerFields.length);
      this.soccerFields = this.soccerFields.filter((item:SoccerFieldModel) => {
          console.log("item.name");
        console.log(item.name);
        var keep = (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        if(keep){
            console.log("lo prendo");
        } else {
            console.log("non lo prendo");
        }
        
        return keep;
      });
    }
  }
  
  ionViewWillEnter()
    {
       
  }
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectSoccerFieldForEventPage');
    console.log("this.soccerFields");
    console.log(this.soccerFields);
    super.searchSoccerFields();
    //this.beService.getAllSoccerFields(this.ifItemsExists.bind(this),this.ifItemsNotExists.bind(this));
  }
  
  ifItemsExists(data) {
      console.log(data);
      var payload = data;
      this.items = data;
      //console.log(payload.length);
//      for(var i=0;i<payload.length;i++){
//          var item = payload[i];
//          var sfm = new SoccerFieldModel();
//          sfm.name=item.name;
//          sfm.latitude=item.latitude;
//          sfm.longitude=item.longitude;
//          sfm.id=item.id;
//          this.items.push(sfm);
//          
//      }
      
      this.copyOfItems = this.items;
      console.log("this.copyOfItems");
      console.log(this.copyOfItems);
      
  }
  ifItemsNotExists(err) {
      
      alert("errore");
  }

  onSelect(event,model) {
      console.log("onSelect");
      console.log(model);
       let nav = this.app.getRootNav();
      nav.setRoot(SoccerFieldDetailsPage,{soccerFieldModel:model});
      
  }

    
}
