import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from 'environments/environment';
import {User, Role} from 'app/auth/models';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    //public
    public currentUser: Observable<User>;

    //private
    private currentUserSubject: BehaviorSubject<User>;

    /**
     *
     * @param {HttpClient} _http
     * @param {ToastrService} _toastrService
     */
    constructor(private _http: HttpClient, private _toastrService: ToastrService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // getter: currentUserValue
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     *  Confirms if user is admin
     */
    get isAdmin() {
        return true;
        return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
    }

    /**
     *  Confirms if user is client
     */
    get isClient() {
        return this.currentUser && this.currentUserSubject.value.role === Role.Client;
    }

    companyCodeCheck(companyCode: string) {
        return this._http.post<any>(`${environment.kapoUrl}apps/checkApp`, {'code': companyCode});

    }

    /**
     * User login
     *
     * @param email
     * @param password
     * @returns user
     */
    login(email: string, password: string) {
        const q = localStorage.getItem('kapoSoftServerDatas')
        console.log(JSON.parse(q))

        return this._http
            .post<any>(`${JSON.parse(q).api}user/login`, {'phone': email, password})
            .pipe(
                map(user => {
                    if (user && user.token) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        setTimeout(() => {
                            this._toastrService.success(
                                'You have successfully logged in as an ' +
                                user.role +
                                ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                                '👋 Welcome, ' + user.firstName + '!',
                                {toastClass: 'toast ngx-toastr', closeButton: true}
                            );
                        }, 2500);
                        this.currentUserSubject.next(user);
                    }
                    return user;
                })
            );

    }

    /**
     * User logout
     *
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        // notify
        this.currentUserSubject.next(null);
    }
}
