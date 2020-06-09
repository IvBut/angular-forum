import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {from, Observable, Subject} from 'rxjs';
import {auth, User} from 'firebase';
import {catchError, map, tap} from 'rxjs/operators';
import {mUser, Roles} from '../interfaces';
import {Router} from '@angular/router';



export  type AuthType = 'Email' | 'Google' | 'Facebook' | 'Github';
export type AuthState = 'Login' | 'Logout';
export interface LoginData {
  email: string,
  password: string
}


@Injectable()
export class AuthFBService {
  user$: Observable<User>;
  authState$: Subject<AuthState> = new Subject<AuthState>();
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router
  ) {

  }

  login(authType: AuthType, loginData?: LoginData): Observable<User>{
    switch (authType) {
      case 'Email':
           this.user$ = this.handleEmailPasswordSingIn(loginData);
           break;
      case 'Google':
            this.user$ = this.handleGoogleSignIn();
            break;
      case 'Facebook':
            this.user$ = this.handleFacebookSignIn();
            break;
      case 'Github':
            this.user$ = this.handleGithubSingIn();
            break;
    }
    return this.user$;
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.saveSessionData(null);
      this.router.navigate(['login']);
    });
  }

  signUp(data:LoginData):Observable<mUser> {
   const observable = from(this.afAuth.createUserWithEmailAndPassword(data.email, data.password).
      then(result => {
       return this.saveData(result.user);
      })
      .catch(err =>{
        throw new Error(err);
      }));
    return observable;
  }

  private handleEmailPasswordSingIn(data: LoginData): Observable<User> {
   const observable = from(this.afAuth.signInWithEmailAndPassword(data.email, data.password));
    return observable.pipe(
      map((result)=>{return result.user}),
      tap(user =>{this.processData(user)})
    );
  }

  private handleGoogleSignIn():Observable<User> {
     const observable = from(this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()));
     return observable.pipe(
       map(result => {return result.user}),
       tap(user =>{this.processData(user)})
     );
  }

  private handleFacebookSignIn():Observable<User> {
    const observable = from(this.afAuth.signInWithPopup(new auth.FacebookAuthProvider()));
    return observable.pipe(
      map(result => {return result.user}),
      tap(user =>{this.processData(user)})
    )
  }

  private handleGithubSingIn(): Observable<User> {
    const observable = from(this.afAuth.signInWithPopup(new auth.GithubAuthProvider()));
    return observable.pipe(
      map(result => {return result.user}),
      tap(user =>{this.processData(user)})
    )
  }

  private processData(user){
    this.saveData(user);
    this.saveSessionData(user);
  }


  private async saveData(user: User):Promise<mUser>{
    console.log(user);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let checkDoc = await userRef.get().toPromise();
    if (!checkDoc.exists) {
      const userData: mUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        roles: {
          guest: true,
          admin: false
        }
      };
      try {
        await userRef.set(userData, {merge: true});
        return Promise.resolve(userData);
      }catch (e) {
        console.log(e);
        return Promise.reject(e);
      }
    }
  }


  isAuthenticated(): boolean {
    return !!this.sessionData;
  }


  get sessionData():string{
    const user =  localStorage.getItem('user');
    if (user) {
      const expDate = new Date( JSON.parse(user)['stsTokenManager']['expirationTime']);
      if (new Date() > expDate) {
        this.logout();
        return null;
      }
    }
    return user;
  }

  private saveSessionData(user: User | null) {
    if (user) {
      localStorage.setItem('user',JSON.stringify(user));
      this.authState$.next('Login');
    } else {
      localStorage.clear();
      this.authState$.next('Logout');
    }
  }

}
