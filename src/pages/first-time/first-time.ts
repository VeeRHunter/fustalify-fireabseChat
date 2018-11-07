import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterWithEmailPage } from '../register-with-email/register-with-email';
import { RegisterWithPhonePage } from '../register-with-phone/register-with-phone';
import { RegisterWithFbPage } from '../register-with-fb/register-with-fb';



/**
 * Generated class for the FirstTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-first-time',
  templateUrl: 'first-time.html',
})
export class FirstTimePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  registerWithFB() {
    this.navCtrl.push(RegisterWithFbPage);
  }

  registerWithEmail() {
    this.navCtrl.push(RegisterWithEmailPage);
  }
  
  registerWithPhone() {
    this.navCtrl.push(RegisterWithPhonePage);
  }
}
