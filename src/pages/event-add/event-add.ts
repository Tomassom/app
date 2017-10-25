import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthService } from '../../providers/auth';
import { LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { PartnerModalPage } from '../partner-modal/partner-modal';
import { EventsListPage } from "../events-list/events-list";



/**
 * Generated class for the EventAddPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-event-add',
  templateUrl: 'event-add.html'
})
export class EventAddPage {
    public pictures:string[] = [];
    public loader = this.loading.create({});
    public options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation:true
    }
    public galleryOption: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }
    types:any = {};
    partnerName:string = "";
    isSuccess:any = false;
    eventData:any = {};
    eventError:any = {};
    partnerList:any = {};
    todo = {
        pid : ""
    };
    data = {
        name : "",
        id : ""
    };


    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public authservice: AuthService,
      public camera: Camera,
      public loading: LoadingController,
      public actionSheetCtrl: ActionSheetController,
      public modalCtrl: ModalController
    ) {
        this.types = JSON.parse(localStorage.getItem('eventTypes'));

    }

    ionViewDidLoad()
    {
    }

    openPartnerModal() {
        let modal = this.modalCtrl.create(PartnerModalPage);
        modal.onDidDismiss(data => {
            // Do things with data coming from modal, for instance :
            if (data) {
                this.partnerName = data.name;
                this.todo.pid = data.pid;
                console.log(this.data.id);

                //localStorage.setItem('phone', this.data.phone);
                //localStorage.setItem('phoneId', this.data.phoneId);
            } else {
                this.data.name = '';
                this.data.id = '';

                //localStorage.setItem('phone', '');
                //localStorage.setItem('phoneId', '');

            }

        });
        modal.present();
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modify your album',
            buttons: [
                {
                    text: 'Fotó készítés',
                    handler: () => {
                        console.log('Destructive clicked');
                        this.takePictureAction();
                    }
                },{
                    text: 'Galériából választás',
                    handler: () => {
                        console.log('Archive clicked');
                        this.takeGalleryAction();
                    }
                },{
                    text: 'Bezárás',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    postEventAction( ){

        console.log(this.todo);
        //this.loader.present();

        let login = this.authservice.postEvent("v1/hu/events", this.todo);
        login.subscribe(
            (response) => {
                this.eventData = response;
                console.log(response);

                this.uploadPictures( response.data.eid );
                console.log('Eid:' + response.data.eid );

                this.todo = {
                    pid : ""
                };

                this.isSuccess = true;
                this.navCtrl.setRoot(EventsListPage,{},{});
            },
            (error) => {
                console.log(error);
               this.eventError = error;

            }
        );
       // this.loader.dismiss();
    }



    takePictureAction(){
        this.camera.getPicture(this.options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.pictures.push(base64Image);
            console.log(this.pictures);
        }, (err) => {
            // Handle error
        });
    }


    takeGalleryAction(){
        this.camera.getPicture(this.galleryOption).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.pictures.push(base64Image);
            console.log(this.pictures);
        }, (err) => {
            // Handle error
        });
    }


    uploadPictures( id ){
            for(let i = 0;i < this.pictures.length;i++){
                let pictureUpload = this.authservice.postPictures("v1/hu/events/"+ id + "/images",{image:this.pictures[i]});
                pictureUpload.subscribe(
                    (response) => {
                        console.log(response);
                        //this.loader.dismiss();
                        this.pictures.splice(i, 1);
                    },
                    (error) => {
                        console.log(error);
                    }
                );

                /*
                if (this.pictures.length == i )
                {
                    this.pictures = [];
                }
                */
            }

    }

    addEventData( data )
    {
        console.log('post hívás');
    }

    /*
    getItems(ev: any) {

        this.filteredPhones = this.allPhones;
        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.filteredPhones = this.allPhones.filter((phone) => {
                let searchValue = phone.manufacturer + phone.name;
                return (searchValue.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }
    */

}
