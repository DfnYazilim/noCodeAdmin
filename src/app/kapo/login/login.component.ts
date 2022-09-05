import {menu} from 'app/menu/menu';
import * as _ from 'lodash';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {CoreConfigService} from "../../../@core/services/config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../auth/service";
import {first, takeUntil} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {CoreMenuService} from "../../../@core/components/core-menu/core-menu.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    menu: any;
    //  Public
    public coreConfig: any;
    public loginForm: FormGroup;
    public loading = false;
    public submitted = false;
    public returnUrl: string;
    public error = '';
    public passwordTextType: boolean;
    public languageOptions: any;
    public selectedLanguage: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     */
    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _coreMenuService: CoreMenuService,
        private _authenticationService: AuthenticationService,
        public _translateService: TranslateService
    ) {
        this.languageOptions = {
            en: {
                title: 'English',
                flag: 'us'
            },
            tr: {
                title: 'Türkçe',
                flag: 'tr'
            }
        };
        // redirect to home if already logged in
        if (this._authenticationService.currentUserValue) {
            this._router.navigate(['/']);
        }

        this._unsubscribeAll = new Subject();

        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    setLanguage(language): void {
        // Set the selected language for the navbar on change
        this.selectedLanguage = language;

        // Use the selected language id for translations
        this._translateService.use(language);

        this._coreConfigService.setConfig({app: {appLanguage: language}}, {emitEvent: false});
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        // Login
        this.loading = true;
        this._authenticationService.companyCodeCheck(this.f.companyCode.value).pipe(first()).subscribe(data => {
            console.log(data)
            if (data.err) {
                console.log("hata")
                this.error = data.err
                this.loading = false
            } else {
                localStorage.setItem('kapoSoftServerDatas', JSON.stringify(data));
                if (this.selectedLanguage == undefined)
                    this.selectedLanguage = 'tr'
                this.menu = menu;
                this._coreMenuService.register('main', this.menu);

                // Set the main menu as our current menu

                // Add languages to the translation service

                this._coreMenuService.setCurrentMenu('main');
                this._authenticationService
                    .login(this.f.email.value, this.f.password.value)
                    .pipe(first())
                    .subscribe(
                        data => {
                            this._translateService.use(this.selectedLanguage);
                            this._coreConfigService.setConfig({app: {appLanguage: this.selectedLanguage}}, {emitEvent: true});
                            this._router.navigate([this.returnUrl]);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        }
                    );
            }
        }, error => {
            this.error = error
            this.loading = false
        })

    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.selectedLanguage = _.find(this.languageOptions, {
            id: this._translateService.currentLang
        });
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            companyCode: ['', [Validators.required]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
