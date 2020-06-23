import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {mUser} from '../../../../interfaces';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class UserInfoService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { }

  getAllUsers(): Observable<mUser[]> {
   return  this.db.collection<mUser>('users').snapshotChanges().pipe(
     map(actions => actions.map(a => {
       const data = a.payload.doc.data() as mUser;
       const uid = a.payload.doc.id;
       return { uid, ...data };
     }))
   );
 }


  async updateUserProfileInfo(dbUser: mUser, password?: string):Promise<mUser> {
    try {
      let fbUser = await this.afAuth.currentUser;
      if (dbUser.uid === fbUser.uid) {
        if (password) {
          await fbUser.updatePassword(password)
        }
        await fbUser.updateProfile({
          displayName: dbUser.displayName,
          photoURL: dbUser.photoURL
        });
      }
      await this.db.doc<mUser>(`users/${dbUser.uid}`).update(dbUser);
      return dbUser
    } catch (e) {
      throw new Error(e);
    }

  }
}
