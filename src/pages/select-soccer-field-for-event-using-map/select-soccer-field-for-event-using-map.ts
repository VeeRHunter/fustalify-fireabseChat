import { Component } from '@angular/core';
import { App,IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  VisibleRegion,
  LatLngBounds,
  HtmlInfoWindow,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { SoccerFieldModel } from '../../app/models';
import { PersistenceService,BEService } from '../../app/services';
import { BasePage } from '../../app/BasePage';
import { SoccerFieldDetailsPage } from '../soccer-field-details/soccer-field-details';

@IonicPage()
@Component({
  selector: 'page-select-soccer-field-for-event-using-map',
  templateUrl: 'select-soccer-field-for-event-using-map.html',
})
export class SelectSoccerFieldForEventUsingMapPage  extends BasePage {
   map: GoogleMap;
   yourLocation : {longitude:number,latitude:number};
   onSelectButtonEnabled:boolean = false;  
   selectSoccerFieldModelOnMap:SoccerFieldModel;

  constructor(public navCtrl: NavController, public navParams: NavParams
          ,public persistenceService : PersistenceService
           ,public beService : BEService   
           ,private geolocation: Geolocation
           ,public app: App
            ,public loadingCtrl: LoadingController
          ,public toastCtrl: ToastController
    ,public androidPermissions: AndroidPermissions
          ) {
       super(persistenceService,beService,loadingCtrl,toastCtrl,app);
  }

  ionViewDidLoad1() {
    
  }
  
  ionViewWillEnter()
  {
//        console.log('ionViewWillEnter SelectSoccerFieldForEventUsingMapPage');
//        console.log("this.soccerFields");
//        console.log(this.soccerFields);
       // this.showLoading();
       super.searchSoccerFields();
  }
  
detectLocation(){
    var self = this;
    this.showLoading();
     
     var def_lat = 41.8530932;
     var def_lng = 12.572687;
     
     var existsLocation = this.user.last_latitude!=undefined && this.user.last_latitude!=null && this.user.last_latitude!=0 && this.user.last_longitude!=undefined && this.user.last_longitude!=null && this.user.last_longitude!=0;
     
     
    var watchID =  navigator.geolocation.watchPosition(
    function(position){
        console.log(position.coords.longitude + ' ' + position.coords.latitude);
        navigator.geolocation.clearWatch(watchID);
         
       self.loadMap({latitude:position.coords.latitude,longitude:position.coords.longitude});
       self.user.last_latitude=position.coords.latitude;
       self.user.last_longitude=position.coords.longitude;
        self.persistenceService.saveUser(self.user,function(){},function(err){});
                                            
                                            
        self.hideLoading();
    }
    ,function(error){
        self.hideLoading();
        if(existsLocation ){
            self.loadMap({latitude:self.user.last_latitude,longitude:self.user.last_longitude});
            return;
            
        } 
         
        
        
        self.showToast("Non sono riuscito a trovare la tua posizione");
        navigator.geolocation.clearWatch(watchID);
        self.loadMap({latitude:def_lat,longitude:def_lng});
        self.user.last_latitude=def_lat;
        self.user.last_longitude=def_lng;
        self.persistenceService.saveUser(self.user,function(){},function(err){});
          
          
        
    }
     ,{ timeout: 30000 }
    )
    
}
 

 detectLocation1(){
     this.showLoading();
    // console.log("detectLocation started");
     var self = this;
     var existsLocation = this.user.last_latitude!=undefined && this.user.last_latitude!=null && this.user.last_latitude!=0 && this.user.last_longitude!=undefined && this.user.last_longitude!=null && this.user.last_longitude!=0;
     
     if(existsLocation ){
         self.loadMap({latitude:this.user.last_latitude,longitude:this.user.last_longitude});
         return;
     }
     try{
        console.log(this.geolocation);
        this.geolocation.getCurrentPosition().then((resp) => {
           // resp.coords.latitude
           // resp.coords.longitude
           console.log("la tua posizione ");
           console.log(resp.coords.latitude);
           console.log(resp.coords.longitude);

            self.loadMap({latitude:resp.coords.latitude,longitude:resp.coords.longitude});
            self.user.last_latitude=resp.coords.latitude;
            self.user.last_longitude=resp.coords.longitude;
            self.persistenceService.saveUser(self.user,function(){},function(err){});
            self.hideLoading();

          }).catch((error) => {
            console.log('Error getting location', error);
            self.showToast("Non sono riuscito a trovare la tua posizione");
            self.hideLoading();
          });
            console.log(this.geolocation);
     } catch (ex){
         console.log(ex);
         self.hideLoading();
     }
     
//       let watch = this.geolocation.watchPosition();
//       watch.subscribe((data) => {
//        self.loadMap({latitude:data.coords.latitude,longitude:data.coords.longitude});
//       });

 }
 createMarker(soccerField) {
        var title = soccerField.name;
        var address = soccerField.address!=undefined && soccerField.address!=null && soccerField.address!= soccerField.address ? "":"";

console.log("soccerField");
console.log(soccerField);
      
      return {
        icon: {
          url: 'assets/maps/marker.png',

          size: {
            width: 32,
            height: 24
          }
        },

        title: title,

        snippet:address,

        position: { lat: soccerField.latitude, lng: soccerField.longitude},

        infoWindowAnchor: [16, 0],

        anchor: [16, 32],

        draggable: true,

        flat: false,

        rotation: 32,

        visible: true,

        styles: {
          'text-align': 'center',
          'font-style': 'italic',
          'font-weight': 'bold',
          'color': 'red'
        },

        animation: GoogleMapsAnimation.DROP,

        zIndex: 0,

        disableAutoPan: true
      };
      
    
 }
 
 loadMap(yourLocation) {
     var self = this;
     let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: yourLocation.latitude,
           lng: yourLocation.longitude
         },
         zoom: 13,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
   
    var markers = [];
    var markersIds = [];
    var markersExtras = [];

     for(var i=0;i<self.soccerFields.length;i++){
           var soccerField = self.soccerFields[i];
          let soccerFieldMarker: MarkerOptions = this.createMarker(soccerField);
          markers.push(soccerFieldMarker);
          soccerFieldMarker.model = self.soccerFields[i];
          
          this.map.addMarker(soccerFieldMarker).then((marker: Marker) => {
               markersIds.push(marker.getId());
               markersExtras.push(soccerFieldMarker.model);
               
               var soccerFieldAddress = soccerFieldMarker.model.address!=undefined && soccerFieldMarker.model.address!=null && soccerFieldMarker.model.address!= soccerFieldMarker.model.address ? "":"";
               soccerFieldAddress="Sconosciuto";
                let htmlInfoWindow = new HtmlInfoWindow();
                let frame: HTMLElement = document.createElement('div');
                frame.innerHTML = [
                  '<h3>'+ soccerFieldMarker.model.name+'</h3>',
                  soccerFieldAddress
                ].join("");
              
              marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((res) => {
              var marker = res[1];
              var iof = markersIds.indexOf(marker.getId());
              var model = markersExtras[iof];
              self.onSelectButtonEnabled=true;
              self.selectSoccerFieldModelOnMap=model;
            });
    
    
          });
          
          
    
    
               

      }

     
 }

  
  onSearchSoccerFieldsSuccess(data){
        super.onSearchSoccerFieldsSuccess(data);    
      
      
      var self = this;
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
              success => {
                  
                  
                self.detectLocation();
                  
              },
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            );

       this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
        
        
        
       
  }
  
  onSelect(){
      
      let nav = this.app.getRootNav();
      nav.setRoot(SoccerFieldDetailsPage,{soccerFieldModel:this.selectSoccerFieldModelOnMap});
  }

   private computeIdealZoom(map,markers){
    //var zoomLevel = map.getZoom();
    var self = this;
    var zoomLevel = map.getCameraZoom();
    console.log("zoomLevel==>"+zoomLevel);
    var found = false;
    let latLngBounds: VisibleRegion=null;
    
     map.one(GoogleMapsEvent.MAP_READY).then(() => {
        latLngBounds = map.getVisibleRegion();
        console.log("map.getBounds()");
        console.log(map.getBounds());
        console.log("latLngBounds");
        console.log(latLngBounds);
        self.setZoomAndTry(map,markers,latLngBounds);
          
        

      
    });
    
}


  private setZoomAndTry(map,markers,latLngBounds){
      var zoomLevel = map.getCameraZoom();
      console.log(" livell zoom " + zoomLevel);
      for (var i=0; i<markers.length; i++){
              if( latLngBounds.contains(markers[i].getPosition()) ){
                  console.log("trovato marker a livello di zoom " + zoomLevel);
                  return;
              } 
      }
       console.log("nessun marker trovato a livello di zoom " + zoomLevel);
           
      if(zoomLevel>1){
                map.setCameraZoom(--zoomLevel);
                this.setZoomAndTry(map,markers,latLngBounds);
      }
            
      

      
    };
    



   
}
