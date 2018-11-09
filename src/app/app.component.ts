import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController, App, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { ActivateByCodePage } from '../pages/activate-by-code/activate-by-code';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { HomePage } from '../pages/home/home';
import { FirstTimePage } from '../pages/first-time/first-time';
import { RegisterWithEmailPage } from '../pages/register-with-email/register-with-email';
import { RegisterWithPhonePage } from '../pages/register-with-phone/register-with-phone';
import { RegisterWithFbPage } from '../pages/register-with-fb/register-with-fb';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AddOrEditMyTransportPage } from '../pages/add-or-edit-my-transport/add-or-edit-my-transport';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { InviteToMyEventPage } from '../pages/invite-to-my-event/invite-to-my-event';
import { InvitedToEventsPage } from '../pages/invited-to-events/invited-to-events';
import { MyEventsPage } from '../pages/my-events/my-events';
import { MyTransportsPage } from '../pages/my-transports/my-transports';
import { ProfilePage } from '../pages/profile/profile';
import { EventsTabPage } from '../pages/events-tab/events-tab';
import { RequestsTabPage } from '../pages/requests-tab/requests-tab';
import { SettingsTabPage } from '../pages/settings-tab/settings-tab';
import { SoccerFieldBookingArchivePage } from '../pages/soccer-field-booking-archive/soccer-field-booking-archive';
import { ContactsPage } from '../pages/contacts/contacts';
import { UserDisabledPage } from '../pages/user-disabled/user-disabled';
import { FatalErrorUnknownPage } from '../pages/fatal-error-unknown/fatal-error-unknown';

//import { MapsPage } from '../pages/maps/maps';

//Servizi
import { PersistenceService, FBService, BEService } from './services';
import { User } from './models';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as firebaseDB from "Firebase";
import { timer } from 'rxjs/observable/timer';


@Component({
    selector: 'app-root',
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = WalkthroughPage;
    textDir: string = "ltr";
    authResponse: any;
    user: User;

    pages: Array<{ title: any, icon: string, component: any, parameters: any }>;
    pushPages: Array<{ title: any, icon: string, component: any, parameters: any }>;


    showSplash = true;

    constructor(public platform: Platform
        , public statusBar: StatusBar
        , public splashScreen: SplashScreen
        , private persistenceService: PersistenceService
        , public events: Events
        , private fb: Facebook
        , private fbService: FBService
        , public menu: MenuController
        , public app: App
        , public beService: BEService
        , public toastCtrl: ToastController
        , private firebase: Firebase
        //          ,private push: Push
    ) {

        this.initializeApp();

        console.log("this.initializeApp");


        this.populateEmptyNav();

        /*
        const options: PushOptions = {
            android: {},
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
         };
    
         const pushObject: PushObject = this.push.init(options)
    
        pushObject.on('notification').subscribe((notification: any) => 
        {
            console.log('Received a notification');
            console.log(notification);
        });
        */

    }


    showToast(msg: string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });

        toast.onDidDismiss(() => {

        });

        toast.present();
    }

    initializeApp() {
        var self = this;
        //     this.translate.setDefaultLang('en');
        //    this.translate.use('en');

        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            window.addEventListener('beforeunload', () => {
                self.persistenceService.saveStatus();
            });
            this.statusBar.styleDefault();

            timer(3000).subscribe(() => this.showSplash = false);

            self.initBasicInformations();

            self.events.subscribe('user:logged', () => {
                self.populateNavWhenLogged();
            });
            //        console.log("this.firebase");
            //        console.log(this.firebase);
            this.firebase.getToken()
                .then(token => {
                    console.log("this.initializeApp");
                    self.beService.createOrUpdateRegistrationId({ token: token }, function (remote) {
                        //                  console.log("token registato");
                        //                  console.log(remote);
                        self.persistenceService.saveFirebaseToken(token);
                    }, function (err) {
                        //                  console.log("errore token");
                    })
                }) // save the token server-side and use it to push notifications to this device
                .catch(error => {
                    // console.error('Error getting token', error);
                    console.log(error);
                });

            console.log("this.initializeApp");
            this.firebase.onTokenRefresh()
                .subscribe((token: string) => console.log(`Got a new token ${token}`));


            console.log("this.initializeApp");
            this.splashScreen.hide();


        });
        //    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
        //      {
        //     
        //        if(event.lang == 'ar'){
        //          self.platform.setDir('rtl', true);
        //        } else {
        //          self.platform.setDir('ltr', true);
        //        }
        //    
        //        
        //     });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        let nav = this.app.getRootNav();
        // navigate to the new page if it is not the current page
        nav.setRoot(page.component, page.parameters);
    }

    pushPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();

        this.app.getRootNav().push(page.component, page.parameters);
    }

    initBasicInformations() {
        var self = this;
        this.persistenceService.fetchContactsOnDevice(function (remote) {

        }, function (err) {

        });


        this.persistenceService.getPlayerRoles(
            function (player_roles) {
                //           console.log("elenco ruoli trovati sul dispositivo");
                //         console.log(player_roles);

                //self.showToast("elenco ruoli trovati sul telefono");
                self.detectUser();

            }
            , function (err) {
                //           console.log("elenco ruoli non trovati sul dispositivo");
                //self.showToast("elenco ruoli non trovati sul dispositivo");
                //Elenco ruoli non presenti sul dispositivo
                self.beService.getAllPlayerRoles(
                    function (data) {
                        // self.showToast("elenco ruoli scaricati dal server");
                        //                    console.log("elenco ruoli scaricati dal server");
                        //                        console.log(data);
                        self.persistenceService.playerRoles = data;
                        //ottengo info utente
                        self.detectUser();
                    }
                    , function () {
                        //                    console.log("elenco ruoli non scaricati dal server");
                        //  self.showToast("elenco ruoli non scaricati dal server");
                    }
                );


            });

    }


    detectUser() {
        console.log("detectUser");
        this.persistenceService.getLoggedUser(this.existsUser.bind(this), this.notExistsUser.bind(this));
    }

    existsUser(user) {
        console.log("existsUser");
        console.log(user);

        var self = this;

        //    self.showToast("UTENTE ESITENTE");
        //    self.showToast(user.id);

        if (user.id == undefined || user.id == null || user.id == 0) {
            this.persistenceService.removeLoggedUser();
            // this.nav.setRoot(FirstTimePage);
            return;

        }



        self.beService.beUserCheck(function (remote) {

            if (remote.exists && remote.enabled) {
                //User exists and enabled
                console.log("User exists and enabled");
                self.remoteUserChecked(user);

            } else {
                if (!remote.exists) {
                    //User not exists
                    console.log("User not exists");
                    self.persistenceService.removeLoggedUser();
                    self.nav.setRoot(RegisterWithEmailPage);

                } else {
                    //User disabled
                    console.log("User disabled");
                    self.nav.setRoot(UserDisabledPage);

                }


            }

        }, function (err) {
            self.nav.setRoot(FatalErrorUnknownPage);


        });


    }

    private remoteUserChecked(user) {

        var self = this;
        self.user = user;
        if (user.loginWith != "fb") {
            self.persistenceService.getFirebaseToken(function (token) {
                var input = { token: token, uid: self.user.id };
                self.beService.createOrUpdateRegistrationId(input, function (remote) {

                }, function () {

                });
                self.nav.setRoot(DashboardPage);
            }, function () {
                alert("errore");
            });

            // self.nav.setRoot(DashboardPage);
            return;
        }
        this.fb.getLoginStatus()
            .then(res => {
                //        console.log("res.status");
                //        console.log(res);
                //      console.log(res.status);
                if (res.status === "connected") {
                    //this.isLoggedIn = true;
                    self.authResponse = res.authResponse;
                    self.fbService.getProfile(res.authResponse, self.existsFBProfile.bind(self), self.notExistsFBProfile.bind(self));


                } else {
                    //this.isLoggedIn = false;
                    //        console.log("getLoginStatus ko");
                    self.nav.setRoot(RegisterWithFbPage);
                }
            })
            .catch(e => {

            });





    }

    notExistsUser() {
        //this.showToast("UTENTE non ESITENTE");

        //this.nav.setRoot(FirstTimePage);
    }

    existsFBProfile(profile) {
        var self = this;
        //      console.log("existsFBProfile ok");
        //      console.log(profile);
        self.user.accessToken = self.authResponse.accessToken;
        self.user.expiresIn = self.authResponse.expiresIn;
        self.user.email = profile.email;
        self.user.username = profile.email;
        self.user.fb_id = self.authResponse.userID;
        self.user.loginWith = "fb";

        if (!self.user.name || self.user.name == "") {
            self.user.name = profile.name;
        }
        //Chiamo il backend per vedere se l'utente è registrato con questa email
        this.beService.findUserWithUsername(self.user.email, this.existsUserOnBE.bind(this), this.notExistsUserOnBE.bind(this));



    }
    /* viene chiamato se non esiste un profilo facebook */
    notExistsFBProfile(err) {
        //      console.log("notExistsFBProfile");
        //      console.log(err);
        this.nav.setRoot(RegisterWithFbPage);



    }
    /* l'utente è salvato su dispositivo e su backedn */
    ifUserSavedAndExistsOnBE() {
        //      console.log("ifUserSavedAndExistsOnBE");
        var self = this;
        self.persistenceService.getFirebaseToken(function (token) {
            //          console.log("recupero token da locale "+token);
            var input = { token: token, uid: self.user.id };
            self.beService.createOrUpdateRegistrationId(input, function (remote) {

            }, function () {

            });
            this.nav.setRoot(DashboardPage);
        }, function () {
            alert("errore");
        });

    }
    ifNotUserSavedAndExistsOnBE() {
        //      console.log("ifNotUserSavedAndExistsOnBE");
        alert("errore");//da gestire
    }

    /* l'utente è salvato su dispositivo */
    ifUserSaved() {
        //      console.log("ifUserSaved");
        var self = this;
        this.beService.newUser(this.user, function (data) {
            //            console.log("data");
            //            console.log(data);
            //self.storage.set('user',user);
            //cbOnSuccess();
            self.user.id = data.id;
            self.persistenceService.saveUser(self.user, self.ifUserSavedAndExistsOnBE.bind(self), self.ifNotUserSavedAndExistsOnBE.bind(self));

            self.persistenceService.getFirebaseToken(function (token) {
                //                console.log("recupero token da locale "+token);
                var input = { token: token, uid: self.user.id };
                self.beService.createOrUpdateRegistrationId(input, function (remote) {

                }, function () {

                });
                self.nav.setRoot(DashboardPage);
            }, function () {
                alert("errore");
            });

            // self.nav.setRoot(DashboardPage);
        }, function (err) {

            alert("errore");
        });



    }
    /* errore di salvataggio su dispositivo */
    ifErrorOnSaveUser() {
        alert("errore");
    }
    /* utente registrato su backend */
    existsUserOnBE(userOnBE) {
        //      console.log("existsUserOnBE");
        //Salvo in locale
        this.user.id = userOnBE.id;
        //      console.log(this.user);
        this.persistenceService.saveUser(this.user, this.ifUserSavedAndExistsOnBE.bind(this), this.ifNotUserSavedAndExistsOnBE.bind(this));
        //this.nav.setRoot(DashboardPage);
    }
    /* utente non registrato su backend */
    notExistsUserOnBE() {
        //      console.log("notExistsUserOnBE");
        //salva su dispositivo e in caso di successo salva su backend
        this.persistenceService.saveUser(this.user, this.ifUserSaved.bind(this), this.ifErrorOnSaveUser.bind(this));

    }

    populateNavWhenLogged() {
        //pages: Array<{title: any, icon: string, component: any}>;
        this.pages = [
            { title: 'Home', icon: 'home', component: DashboardPage, parameters: {} },
            { title: 'Eventi', icon: 'home', component: EventsTabPage, parameters: {} },
            { title: 'Richieste', icon: 'home', component: RequestsTabPage, parameters: {} },
            { title: 'Archivio', icon: 'home', component: SoccerFieldBookingArchivePage, parameters: {} },
            { title: 'Impostazioni', icon: 'home', component: SettingsTabPage, parameters: {} },
            { title: 'Contatti', icon: 'home', component: ContactsPage, parameters: {} },




        ];
    }
    populateNavWhenNotLogged() {

    }
    populateEmptyNav() {
        this.pages = [];
    }

}
