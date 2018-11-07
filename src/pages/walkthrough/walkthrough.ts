import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { FirstTimePage } from '../first-time/first-time';
import { RegisterWithEmailPage } from '../register-with-email/register-with-email';
//import { LoginPage } from '../login/login';
//import { SignupPage } from '../signup/signup';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  lastSlide = false;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController) {

  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
    this.nav.setRoot(RegisterWithEmailPage);
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    this.nav.setRoot(RegisterWithEmailPage);
    
  }

  goToSignup() {
    this.nav.setRoot(RegisterWithEmailPage);
  }
}
