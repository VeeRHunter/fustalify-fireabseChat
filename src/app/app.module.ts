import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP } from '@ionic-native/http';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureAudioOptions } from '@ionic-native/media-capture';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Media, MediaObject } from '@ionic-native/media';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { Network } from '@ionic-native/network';
import { HomePage } from '../pages/home/home';

/* pagine */
import { ActivateByCodePage } from '../pages/activate-by-code/activate-by-code';
import { AddOrEditMyTransportPage } from '../pages/add-or-edit-my-transport/add-or-edit-my-transport';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { EventDetailsTabPage } from '../pages/event-details-tab/event-details-tab';
import { EventDetailsInvitedPage } from '../pages/event-details-invited/event-details-invited';
import { EventDetailsPaymentSummaryPage } from '../pages/event-details-payment-summary/event-details-payment-summary';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { FirstTimePage } from '../pages/first-time/first-time';
import { RegisterWithEmailPage } from '../pages/register-with-email/register-with-email';
import { RegisterWithPhonePage } from '../pages/register-with-phone/register-with-phone';
import { RegisterWithFbPage } from '../pages/register-with-fb/register-with-fb';
import { InviteToMyEventPage } from '../pages/invite-to-my-event/invite-to-my-event';
import { InvitedToEventsPage } from '../pages/invited-to-events/invited-to-events';
import { MyEventsPage } from '../pages/my-events/my-events';
import { MyTransportsPage } from '../pages/my-transports/my-transports';
import { ProfilePage } from '../pages/profile/profile';
import { SelectSoccerFieldForEventPage } from '../pages/select-soccer-field-for-event/select-soccer-field-for-event';
import { SelectSoccerFieldForEventUsingMapPage } from '../pages/select-soccer-field-for-event-using-map/select-soccer-field-for-event-using-map';
import { SelectSoccerFieldForEventUsingTabsPage } from '../pages/select-soccer-field-for-event-using-tabs/select-soccer-field-for-event-using-tabs';
import { SoccerFieldDetailsPage } from '../pages/soccer-field-details/soccer-field-details';
import { CheckSoccerFieldAvailabilityPage } from '../pages/check-soccer-field-availability/check-soccer-field-availability';
import { ComposePlayerTeamPage } from '../pages/compose-player-team/compose-player-team';
import { SelectContactForComposePlayerTeamPage } from '../pages/select-contact-for-compose-player-team/select-contact-for-compose-player-team';
import { EventSummaryPage } from '../pages/event-summary/event-summary';
import { AddNotesForEventPage } from '../pages/add-notes-for-event/add-notes-for-event';
import { AcceptOrNotInviteSentPage } from '../pages/accept-or-not-invite-sent/accept-or-not-invite-sent';
import { BuyYourPartPage } from '../pages/buy-your-part/buy-your-part';
//import { MapsPage } from '../pages/maps/maps';
import { TransportBookingRequestsPage } from '../pages/transport-booking-requests/transport-booking-requests';
import { TransportBookingRequestAcceptOrDeclinePage } from '../pages/transport-booking-request-accept-or-decline/transport-booking-request-accept-or-decline';
import { EventDetailsTransportAvailabilityPage } from '../pages/event-details-transport-availability/event-details-transport-availability';
import { EventDetailsTransportBookingPage } from '../pages/event-details-transport-booking/event-details-transport-booking';
import { ContactDetailsWhenInBookingPage } from '../pages/contact-details-when-in-booking/contact-details-when-in-booking';
import { ContactDetailsPage } from '../pages/contact-details/contact-details';
import { EventsTabPage } from '../pages/events-tab/events-tab';
import { RequestsTabPage } from '../pages/requests-tab/requests-tab';
import { SettingsTabPage } from '../pages/settings-tab/settings-tab';
import { IncomingEventsPage } from '../pages/incoming-events/incoming-events';
import { SettingsPaypalPage } from '../pages/settings-paypal/settings-paypal';
import { SettingsPrivacyPage } from '../pages/settings-privacy/settings-privacy';
import { SoccerFieldBookingArchivePage } from '../pages/soccer-field-booking-archive/soccer-field-booking-archive';
import { CreateTeamsCompositionPage } from '../pages/create-teams-composition/create-teams-composition';
import { TeamsCompositionPage } from '../pages/teams-composition/teams-composition';
import { SelectContactsForBookingPage } from '../pages/select-contacts-for-booking/select-contacts-for-booking';
import { AddContactPage } from '../pages/add-contact/add-contact';
import { ContactsPage } from '../pages/contacts/contacts';
import { ChatOneToOnePage } from '../pages/chat-one-to-one/chat-one-to-one';

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { UserDisabledPage } from '../pages/user-disabled/user-disabled';
import { FatalErrorUnknownPage } from '../pages/fatal-error-unknown/fatal-error-unknown';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { GoogleMapsService } from '../pages/maps/maps.service';
import { Keyboard } from '@ionic-native/keyboard';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { PersistenceService, FBService, UtilsService, BEService, FirebaseChatService } from './services';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const firebaseConfig = {
  // apiKey: "AIzaSyA0wohzI7tSpUwO2SjrT9Z-l57AXhcXX2o",
  // authDomain: "fir-cbe04.firebaseapp.com",
  // databaseURL: "https://fir-cbe04.firebaseio.com",
  // projectId: "fir-cbe04",
  // storageBucket: "",
  // messagingSenderId: "691595735665"
  apiKey: "AIzaSyBq_NRIX-3j9WL23V1U7jZS6Dq_9AyA1ek",
  authDomain: "fuality-app.firebaseapp.com",
  databaseURL: "https://fuality-app.firebaseio.com",
  projectId: "fuality-app",
  storageBucket: "fuality-app.appspot.com",
  messagingSenderId: "890064930607"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    //rimuovere in prod
    ActivateByCodePage,
    FirstTimePage,
    RegisterWithEmailPage,
    RegisterWithPhonePage,
    RegisterWithFbPage,
    DashboardPage,
    AddOrEditMyTransportPage,
    EventDetailsPage,
    InviteToMyEventPage,
    InvitedToEventsPage,
    MyEventsPage,
    MyTransportsPage,
    ProfilePage,
    SelectSoccerFieldForEventPage,
    SelectSoccerFieldForEventUsingMapPage,
    SelectSoccerFieldForEventUsingTabsPage,
    SoccerFieldDetailsPage,
    CheckSoccerFieldAvailabilityPage,
    ComposePlayerTeamPage,
    SelectContactForComposePlayerTeamPage,
    EventSummaryPage,
    AddNotesForEventPage,
    AcceptOrNotInviteSentPage,
    BuyYourPartPage,
    EventDetailsTabPage,
    EventDetailsInvitedPage,
    EventDetailsPaymentSummaryPage,
    TransportBookingRequestsPage,
    TransportBookingRequestAcceptOrDeclinePage,
    EventDetailsTransportAvailabilityPage,
    EventDetailsTransportBookingPage,
    ContactDetailsWhenInBookingPage,
    ContactDetailsPage,
    EventsTabPage,
    RequestsTabPage,
    SettingsTabPage,
    IncomingEventsPage,
    SettingsPaypalPage,
    SettingsPrivacyPage,
    SoccerFieldBookingArchivePage,
    CreateTeamsCompositionPage,
    TeamsCompositionPage,
    SelectContactsForBookingPage,
    AddContactPage,
    ContactsPage,
    ChatOneToOnePage,
    UserDisabledPage,
    FatalErrorUnknownPage,
    //
    WalkthroughPage,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    IonicModule.forRoot(MyApp, {
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      pageTransition: 'ios-transition',
      swipeBackEnabled: false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ActivateByCodePage,
    FirstTimePage,
    RegisterWithEmailPage,
    RegisterWithPhonePage,
    RegisterWithFbPage,
    DashboardPage,
    AddOrEditMyTransportPage,
    EventDetailsPage,
    InviteToMyEventPage,
    InvitedToEventsPage,
    MyEventsPage,
    MyTransportsPage,
    ProfilePage,
    SelectSoccerFieldForEventPage,
    SelectSoccerFieldForEventUsingMapPage,
    SelectSoccerFieldForEventUsingTabsPage,
    SoccerFieldDetailsPage,
    CheckSoccerFieldAvailabilityPage,
    ComposePlayerTeamPage,
    SelectContactForComposePlayerTeamPage,
    EventSummaryPage,
    AddNotesForEventPage,
    AcceptOrNotInviteSentPage,
    BuyYourPartPage,
    //MapsPage,
    EventDetailsTabPage,
    EventDetailsInvitedPage,
    EventDetailsPaymentSummaryPage,
    TransportBookingRequestsPage,
    TransportBookingRequestAcceptOrDeclinePage,
    EventDetailsTransportAvailabilityPage,
    EventDetailsTransportBookingPage,
    ContactDetailsWhenInBookingPage,
    ContactDetailsPage,
    EventsTabPage,
    RequestsTabPage,
    SettingsTabPage,
    IncomingEventsPage,
    SettingsPaypalPage,
    SettingsPrivacyPage,
    SoccerFieldBookingArchivePage,
    CreateTeamsCompositionPage,
    TeamsCompositionPage,
    SelectContactsForBookingPage,
    AddContactPage,
    ContactsPage,
    ChatOneToOnePage,
    WalkthroughPage,
    UserDisabledPage,
    FatalErrorUnknownPage,



  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
    , HTTP
    , IonicStorageModule
    , PersistenceService,
    Facebook,
    FBService,
    UtilsService,
    BEService,
    FirebaseChatService,
    AndroidPermissions,
    Geolocation,
    CallNumber,
    Contacts,
    // GoogleMapsService,
    Keyboard,
    PayPal,
    Firebase,
    EmailComposer,
    InAppBrowser,
    MediaCapture,
    FileTransfer,
    FileTransferObject,
    Media,
    StreamingMedia,



  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
