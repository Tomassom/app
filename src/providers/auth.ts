import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';

import { HttpService } from './http-service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthService extends HttpService {
    
    constructor(
        public http: Http,
        public storage: Storage
    )
    {     
        super (http, storage);
    }
    
    public authGenerator ( data : any ) : Observable <any>
    {
        return this.get(data);
    }

    public postLogin ( data : any, postData : any ) : Observable <any>
    {
        return this.post( data, postData )
    }
    public postEvent ( data : any, postData : any ) : Observable <any>
    {
        return this.post( data, postData )
    }
    public postPictures (url:any,postData:any) : Observable <any>
    {
        return this.post(url,postData);
    }

    public getLogout ( data : any ) : Observable <any>
    {
        return this.delete(data, {})
    }

    public registration ( data : any ) : Observable <any>
    {
        return this.post( 'v1/hu/auth', {} )
    }
    public getPartners ( data : any ) : Observable <any>
    {
        return this.get(data)
    }
    public getMe ( data : any ) : Observable <any>
    {
        return this.get(data)
    }

    public getRandomInt (min, max )
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
