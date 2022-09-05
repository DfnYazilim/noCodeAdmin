import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {loadMessages, locale} from 'devextreme/localization';
// @ts-ignore
import * as trMessages from 'devextreme/localization/messages/tr.json';
// @ts-ignore
import * as enMessages from 'devextreme/localization/messages/en.json';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { formatDate } from 'devextreme/localization';
import DataSource from "devextreme/data/data_source";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {CoreConfigService} from "../../@core/services/config.service";
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    url = 'http://localhost:1481/api/'
    header: HttpHeaders;
    dataSource: any;
    lang = 'tr'
    requests: string[] = [];
    constructor(private http: HttpClient,  private _toastrService: ToastrService, private translate : TranslateService,private _coreConfigService: CoreConfigService,) {
        _coreConfigService.getConfig().subscribe(a=>{

            this.lang = a.app.appLanguage
            console.log("dil geldi : " + this.lang)
            console.log(a)
            this.getLanguage()
        })
    }

    headersWithoutToken() {
        this.header = new HttpHeaders()
            .set('Content-Type', 'application/json')
    }
    getLanguage(){
        loadMessages(trMessages)
        loadMessages(enMessages)
        locale(this.lang);
    }
    getSettings(){
        this.getLanguage()
        const q  = JSON.parse(localStorage.getItem('kapoSoftServerDatas'))
        this.url = q.api
    }
    headers() {
        this.getSettings()

        // @ts-ignore
        let token = localStorage.getItem('currentUser')
        this.header = new HttpHeaders()
            .set('Authorization', `Bearer ${(token)}`)
            // @ts-ignore
            // .set('dbIp', JSON.parse(localStorage.getItem('dbIp')))
            .set('Content-Type', 'application/json');
    }

    // headers() {
    //     let q = localStorage.getItem('loginKapoApp')
    //     let key =""
    //     let serverUrl = ""
    //     if(q){
    //         let d = JSON.parse(q)
    //         this.url = d.api + '/api/';
    //     }
    //     this.header = new HttpHeaders()
    //         .set('Content-Type', 'application/json')
    //         .set('key', key)
    //         .set('url', serverUrl)
    //
    //     ;
    // }
    login(): Observable<any> {
        return this.http.post(this.url + 'user/login', {
            "phone": "+905545734846",
            "password": "Hodorr1742.,*"
        });
    }

    get(ext: string): Observable<any> {
        this.headers()
        return this.http.get(this.url + ext, {headers: this.header});
    }
    devx(primaryKey: string, ext: string,f?: any) {
        this.getSettings()
        ext = this.url  + ext
        let token = localStorage.getItem('currentUser')
        let tokenCheck = ""
        if(token != null){
            tokenCheck = 'Bearer ' + (JSON.parse(token)).token
        }
        // if(!f ||f.length == 0){
        //     f = ['company', 'equalsObjectId', companyToken._id];
        // }
        this.dataSource = new DataSource({
            store : AspNetData.createStore({
                key: primaryKey,
                loadUrl: ext,
                insertUrl: ext,
                updateUrl: ext,
                deleteUrl: ext,
                onBeforeSend(method, ajaxOptions) {
                    ajaxOptions.headers = {
                        'Authorization': tokenCheck,
                    };
                    // ajaxOptions.contentType = "application/json";
                    ajaxOptions.xhrFields = {withCredentials: false};
                    // ajaxOptions.dataType = 'json';
                },
                // tslint:disable-next-line:only-arrow-functions
                onInserting: function(values) {
                    // @ts-ignore
                    // values.mainId = localStorage.getItem('apmRotaSema');
                },
                onInserted : (values, key) => {
                    this._toastrService.success(
                        'You have successfully logged in as an ' +
                        ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                        '👋 Welcome, ' + 'user.firstName' + '!',
                        { toastClass: 'toast ngx-toastr', closeButton: true }
                    );
                }
            }),
            map : dataItem=>{
                return dataItem
            },


        });
        return this.dataSource;
    }
    sendRequest(url: string, method = 'GET', data: any = {}): any {
        this.logRequest(method, url, data);
        this.headers()
        const httpParams = new HttpParams({fromObject: data});
        const httpOptions = {headers: this.header}
        let result;

        switch (method) {
            case 'GET':
                result = this.http.get(url, httpOptions);
                break;
            case 'PUT':
                result = this.http.put(url, httpParams, httpOptions);
                break;
            case 'POST':
                result = this.http.post(url, data.values, httpOptions);
                break;
            case 'DELETE':
                result = this.http.delete(url, httpOptions);
                break;
        }

        return result
            .toPromise()
            .then((data: any) => (method === 'GET' ? data : data))
            .catch((e) => {
                throw e && e.error && e.error.Message;
            });
    }

    logRequest(method: string, url: string, data: object): void {
        const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');

        const time = formatDate(new Date(), 'HH:mm:ss');

        this.requests.unshift([time, method, url.slice(URL.length), args].join(' '));
    }
}
