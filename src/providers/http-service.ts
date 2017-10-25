import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Storage } from '@ionic/storage';


//import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
/*
  Generated class for the Users provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpService {
    private _apiScheme = 'http';
    private _apiUrl = 'saleshelpdesk.upsolution.hu';
    public _token = '';
    constructor(
        protected http: Http, public storage: Storage
    ) {

    }
    protected post(url: string, data: Object){
        const vars = this._setupVars({url:url, data:data});
        return this.http.post(vars.url, vars.data, vars.options)
            .map(this._extractData)
            .catch(this._handleError);
    }
    protected put(url: string, data: Object){
        const vars = this._setupVars({url:url, data:data});
        return this.http.put(vars.url, vars.data, vars.options)
            .map(this._extractData)
            .catch(this._handleError);
    }
    protected delete(url: string, data: Object){
        const vars = this._setupVars({url:url, data:data});
        return this.http.delete(vars.url, vars.options)
            .map(this._extractData)
            .catch(this._handleError);
    }
    protected get(url: string){
        const vars = this._setupVars({url:url});
        return this.http.get(vars.url, vars.options)
            .map(this._extractData)
            .catch(this._handleError);
    }
    private _url(uriPath : string): string{

        this._token = localStorage.getItem('api');
        let url = `${this._apiScheme}://${this._apiUrl}/${uriPath}`;
        if(this._token){
            console.log('befut az ifbe');
            url += '?token=' + this._token;
        }
        //let token = this.storage.get('api_token');
        //let token = '013eb9fe784fefaf5e819f87d154490530cb6aae28cced4bfbf1f89935150445';

        return url;
    }
    private _setupVars(vars: any){

        if(vars.url){
            vars.url = this._url(vars.url);
        }
        if(vars.data){
            vars.data = Object.keys(vars.data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(vars.data[k])}`).join('&');
        }
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Cache-Control': 'no-store; no-cache; must-revalidate'
        });
        vars.options = new RequestOptions({ headers: headers });
        return vars;
    }
    private _extractData(res: Response) {
        return res.json() || { };
    }
    private _handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
          const body = error.json() || '';
          const err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}