import {User} from 'firebase';
import {of} from 'rxjs';
import {AuthFBService, AuthType} from './auth-fb.service';
import {async} from '@angular/core/testing';
import {mUser} from '../interfaces';

describe('AuthFBService', () => {
  let authService: AuthFBService;
  let mUser: mUser = {
    uid: '0x00000000001u',
    photoURL: '',
    displayName: 'test_author',
    roles: {
      guest: false,
      admin: true
    },
    emailVerified: true,
    email: 'test@test.com'
  };
  let user = '{\n' +
    `  "uid": "0x0000000000001u",\n` +
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

  let router = jasmine.createSpyObj({
    navigate: null
  });

  let angularFireAuth = jasmine.createSpyObj({
    signOut: Promise.resolve(null),
    createUserWithEmailAndPassword: Promise.resolve({
      user: <User>JSON.parse(user)
    }),
    signInWithPopup: Promise.resolve({
      user: <User>JSON.parse(user)
    }),
    signInWithEmailAndPassword: Promise.resolve({
      user: <User>JSON.parse(user)
    }),
    handleFacebookSignIn: Promise.resolve({
      user: <User>JSON.parse(user)
    }),
    handleGithubSingIn: Promise.resolve({
      user: <User>JSON.parse(user)
    }),
  });

  let angFSDoc = jasmine.createSpyObj({
    get: of({exists: false}),
    set: Promise.resolve(null),
    valueChanges: of(mUser)
  });

  let angularFireStore = jasmine.createSpyObj({
      doc : {
        ...angFSDoc
      }
  });

  beforeEach(() => {
    authService = new AuthFBService(angularFireAuth,angularFireStore, router);
  });

  it('should login with Google', async (() => {
    let authType: AuthType = 'Google';
    const spy = spyOn<any>(authService, 'handleGoogleSignIn').and.callThrough();
    authService.login(authType);
    expect(authService.user$).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should login with Facebook', async (() => {
    let authType: AuthType = 'Facebook';
    const spy = spyOn<any>(authService, 'handleFacebookSignIn').and.callThrough();
    authService.login(authType);
    expect(authService.user$).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should login with Github', async (() => {
    let authType: AuthType = 'Github';
    const spy = spyOn<any>(authService, 'handleGithubSingIn').and.callThrough();
    authService.login(authType);
    expect(authService.user$).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should login with Email and Password', async (() => {
    let authType: AuthType = 'Email';
    const spy = spyOn<any>(authService, 'handleEmailPasswordSingIn').and.callThrough();
    authService.login(authType, {password:'testpassword', email: 'email@test.com'});
    expect(authService.user$).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should logout', () => {
    localStorage.setItem('user', user);
    let result = authService.sessionData;
    expect(result).toBeNull();
  });

  it('should return session data', () => {
    let u: User = <User>JSON.parse(user);
    u['stsTokenManager']['expirationTime'] = new Date().getTime() + 3600 * 1000;
    localStorage.setItem('user', JSON.stringify(u));
    let result = authService.sessionData;
    expect(result).toBeTruthy();
  });

  it('should return current user', async(() => {
    localStorage.setItem('user', user);
    authService.checkUser().subscribe(res=> {
      expect(res).toBeTruthy();
      expect(res).toEqual(mUser);
    });

  }));
});
