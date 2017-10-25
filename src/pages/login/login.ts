import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';
import {RegisterPage} from '../register/register';
import {HomePage} from '../home/home';

import { AuthService } from '../../providers/auth';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    emailAddress:string = "papp.tamas@upsolution.hu";
    password:string = "pappt";

    partners:any = [];
    me:any = [];
    tokenData:any = "";
    responseTokenData:any = [];
    login:any = [];
    loginError:any = [];
    logoutData:any = [];
    user:any = [];
    isSuccess:any = false;
    logoutAid:any = "";
    logoutAidTeszt:any = "";
    eventType:any = {};


  constructor(
      public nav: NavController,
      public menu: MenuController,
      public authservice : AuthService,
      private storage: Storage,
      private push: Push
  ) {
    // disable menu
    this.menu.swipeEnable(false);

      if (!localStorage.getItem('api'))
      {
          this.getAction();
          localStorage.setItem('device_token', this.pushMessage());

          console.log ( localStorage.getItem('device_token') );
      }

  }
/*
  register() {
    this.nav.setRoot(RegisterPage);
  }

  login() {
    // add your check auth here
    this.nav.setRoot(HomePage);
  }
*/

    public postLoginAction( ){


        let formData = {
            'email' : this.emailAddress,
            'encrypted_password' : this.password
        }

        let login = this.authservice.postLogin("v1/hu/login", formData);
        login.subscribe(
            (response) => {
                console.log('Sikeres bejelentkezes');
                this.login = response;

                this.storage.set('user', response);

                this.eventTypeUpdate();

                this.isSuccess = true;
            },
            (error) => {
                console.log(error);
                this.loginError = error;

            }
        );
    }

    getAction(){

        let aid = this.getRandomInt(0, 100000000);
        localStorage.setItem('aid', aid);

        let generator = this.authservice.authGenerator("v1/hu/auth/" + aid);
        generator.subscribe(
            (response) => {
                if (response.token)
                {
                    localStorage.setItem('api', response.token);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    public eventTypeUpdate()
    {

        /*
         let types = [
         { id: 1, name: "Új reklám eszközök igénylése" },
         { id: 2, name: "Hibás reklám eszközök cseréje" },
         { id: 3, name: "Ügyfél hiba bejelentése" },
         ];
         */
        let eventTypes = this.authservice.getPartners("v1/hu/types");
        eventTypes.subscribe(
            (response) => {
                //console.log(response);
                //this.partners = response;
                localStorage.setItem('eventTypes', JSON.stringify(response));
            },
            (error) => {
                console.log(error);
            }
        );



        //console.log("Esemeny adatok feltoltése");

        //let visszAdat = JSON.parse(localStorage.getItem('eventTypes'));
        //console.log(visszAdat);

        //this.eventType
    }

    public getRandomInt (min, max )
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public pushMessage()
    {
        let data : any;
        const options: PushOptions = {
            android: {
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

        pushObject.on('registration').subscribe((registration: any) => data = registration );

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

        return data;
    }
}
