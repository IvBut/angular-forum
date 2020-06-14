import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentReference
} from '@angular/fire/firestore';
import {mUser, Question} from '../../../../interfaces';
import {User} from 'firebase';
import {combineLatest, Observable} from 'rxjs';
import {map,switchMap} from 'rxjs/operators';





@Injectable()
export class QuestionService {
  questionCollection: AngularFirestoreCollection<Question>;

  constructor(public db: AngularFirestore) {
    this.questionCollection = this.db.collection<Question>('questions');
  }


  async addQuestion(question: Question): Promise<Question> {
    try {
      let result: DocumentReference = await this.questionCollection.add(question);
      question.uid = result.id;
      return question;
    } catch (err) {
      throw new Error(err);
    }
  }

  getQuestions(): Observable<Question[]> {
    return this.checkUser()
      .pipe(
        switchMap(user => {
          if (user.roles.guest) {
            const moderatedQuestions$ = this.transformData(this.db.collection<Question>('questions', ref => {
              return ref.where('onModeration', '==', false);
            }).snapshotChanges());

            const currentUserQuestions$ = this.transformData(this.db.collection<Question>('questions', ref => {
              return ref.where('author.authorId', '==', user.uid);
            }).snapshotChanges());

            return combineLatest<any[]>(moderatedQuestions$, currentUserQuestions$)
              .pipe(
                map(arr => arr.reduce((acc, cur) => acc.concat(cur))),
              );
          }
          return this.transformData(this.db.collection<Question>('questions').snapshotChanges());
        })
      );
  }


  private transformData(obs:  Observable<DocumentChangeAction<any>[]>) {
    return  obs
      .pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data() as Question;
            let uid = a.payload.doc.id;
            return { uid, ...data };
          });

        }))
  }

  checkUser(): Observable<mUser> {
    let candidate = <User>JSON.parse(localStorage.getItem('user'));
    let candidateId = candidate.uid;
    return this.db.doc<mUser>(`users/${candidateId}`).valueChanges();
  }


}
