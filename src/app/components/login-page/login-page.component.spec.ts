import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginPageComponent} from './login-page.component';
import {Observable, of, throwError} from 'rxjs';
import {mUser} from '../../interfaces';
import {AuthFBService, LoginData} from '../../services/auth-fb.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OverlayModule} from '@angular/cdk/overlay';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {FontAwesomeTestingModule} from '@fortawesome/angular-fontawesome/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../../shared/shared.module';
import {User} from 'firebase';



describe('Login Page', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthFBService;
  let mUser: mUser = {
    uid: '0x000000000000001',
    displayName: 'testDisplayName',
    email: 'testEmail@test.com',
    roles: {
      admin: true,
      guest: false
    },
    photoURL: null,
    emailVerified: true
  };

  let authServiceStub = {
    isAuthenticated: () => {

    },
    signUp: (loginData: LoginData): Observable<mUser> => {
      return of(mUser);
    },

    login: (loginType: string, loginData: LoginData): Observable<any> => {
      return of(mUser);
    },
    get sessionData() {
      return '{\n' +
        '  "uid": "0x000000000000001",\n' +
        '  "displayName": "testuser1@test.com",\n' +
        '  "photoURL": "https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg",\n' +
        '  "email": "testuser1@test.com",\n' +
        '  "emailVerified": false,\n' +
        '  "phoneNumber": null,\n' +
        '  "isAnonymous": false,\n' +
        '  "tenantId": null,\n' +
        '  "providerData": [\n' +
        '    {\n' +
        '      "uid": "testuser@test.com",\n' +
        '      "displayName": "testuser@test.com",\n' +
        '      "photoURL": "https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg",\n' +
        '      "email": "testuser1@test.com",\n' +
        '      "phoneNumber": null,\n' +
        '      "providerId": "password"\n' +
        '    }\n' +
        '  ],\n' +
        '  "apiKey": "",\n' +
        '  "appName": "[DEFAULT]",\n' +
        '  "authDomain": "",\n' +
        '  "stsTokenManager": {\n' +
        '    "apiKey": "",\n' +
        '    "refreshToken": "",\n' +
        '    "accessToken": "",\n' +
        '    "expirationTime": 1593546667000\n' +
        '  },\n' +
        '  "redirectEventId": null,\n' +
        '  "lastLoginAt": "1593543067910",\n' +
        '  "createdAt": "1591606173067",\n' +
        '  "multiFactor": {\n' +
        '    "enrolledFactors": []\n' +
        '  }\n' +
        '}';
    }
  };

  const setup = (loginState: boolean = false) => {
    spyOn(authService, 'isAuthenticated').and.callFake(() => {
      return loginState;
    });
    component.ngOnInit();
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent
      ],
      imports: [OverlayModule,
                RouterTestingModule.withRoutes([{path: 'content/questions', loadChildren: () => import('../content/content/content.module').then(m => m.ContentModule)}]),
                SharedModule,
                BrowserAnimationsModule
      ],
      providers: [
        {provide: AuthFBService, useValue: authServiceStub},
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthFBService);
    fixture.detectChanges();
  });

  it('should create the login-page component', () => {
    expect(component).toBeTruthy();
    setup(false);
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(component.form).toBeTruthy();
  });

  it('check for authorized user return to the login page', () => {
    setup(true);
    const spySessionData = spyOnProperty(component.authFb, 'sessionData');
    expect(component.userNickName).toBe('testuser1@test.com');
  });

  it('check user has been signUp', () => {
    setup(false);
    component.handleFormState();
    component.form.setValue({email: mUser.email, password: 'qwerty'});
    expect(component.showRegistration).toBeTrue();
    fixture.detectChanges();

    const spySignUp = spyOn(component.authFb, 'signUp').and.callThrough();
    const spyFormState = spyOn(component, 'handleFormState');
    const spySnackBar = spyOn(component['_snackBar'], 'open');

    component.onSingUp();
    expect(spySignUp).toHaveBeenCalled();
    expect(spyFormState).toHaveBeenCalled();
    expect(spySnackBar).toHaveBeenCalled();

    fixture.detectChanges();
  });

  it('check sign up error', () =>{
    setup(false);
    component.form.setValue({email: mUser.email, password: 'qwerty'});
    const loginSpy = spyOn(component.authFb, 'signUp').and.returnValue(throwError('Login Error'));
    const spySnackBar = spyOn(component['_snackBar'], 'open');

    component.onSingUp();

    expect(loginSpy).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBeFalsy();
    expect(spySnackBar).toHaveBeenCalled();
  });


  it('check user login', () => {
    setup(false);
    component.form.setValue({email: mUser.email, password: 'qwerty'});
    const loginSpy = spyOn(component.authFb, 'login').and.callThrough();
    const spySnackBar = spyOn(component['_snackBar'], 'open');
    component.onLogin('Email');

    expect(loginSpy).toHaveBeenCalled();
    expect(component.userNickName).toBe(mUser.email);
    expect(spySnackBar).toHaveBeenCalled();
  });

  it('check login error', () =>{
    setup(false);
    component.form.setValue({email: mUser.email, password: 'qwerty'});
    const loginSpy = spyOn(component.authFb, 'login').and.returnValue(throwError('Login Error'));
    const spySnackBar = spyOn(component['_snackBar'], 'open');

    component.onLogin('Email');

    expect(loginSpy).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBeFalsy();
    expect(spySnackBar).toHaveBeenCalled();
  });

  it('form invalid if fields empty', async(() => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    const submitBtn = fixture.debugElement.query(By.css('.submit-btn')).nativeElement;
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
    expect(submitBtn.disabled).toBeTruthy();

  }));

  it ('form should be valid', async(() => {
    component.form.controls['email'].setValue(mUser.email);
    component.form.controls['password'].setValue('qwerty');
    const submitBtn = fixture.debugElement.query(By.css('.submit-btn')).nativeElement;
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
    expect(submitBtn.disabled).toBeFalsy();
  }))

});
