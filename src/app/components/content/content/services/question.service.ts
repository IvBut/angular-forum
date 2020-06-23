import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
  DocumentReference, QueryDocumentSnapshot
} from '@angular/fire/firestore';
import {Question} from '../../../../interfaces';
import {combineLatest, from, Observable, Observer} from 'rxjs';
import {bufferCount, concatMap, map, switchMap, tap} from 'rxjs/operators';
import {AuthFBService} from '../../../../services/auth-fb.service';


@Injectable()
export class QuestionService {
  questionCollection: AngularFirestoreCollection<Question>;

  constructor(public db: AngularFirestore, public auth: AuthFBService) {
    this.questionCollection = this.db.collection<Question>('questions');
  }

  async deleteCollection(path: string): Promise<number> {
    let totalDeleteCount = 0;
    const batchSize = 500;

    return new Promise<number>((resolve, reject) =>
      from(this.db.collection(path).ref.get())
        .pipe(
          concatMap((q) => from(q.docs)),
          bufferCount(batchSize),
          concatMap((docs: Array<QueryDocumentSnapshot<any>>) => new Observable((o: Observer<number>) => {
            const batch = this.db.firestore.batch();
            docs.forEach((doc) => batch.delete(doc.ref));
            batch.commit()
              .then(() => {
                o.next(docs.length);
                o.complete();
              })
              .catch((e) => o.error(e));
          })),
        )
        .subscribe(
          (batchDeleteCount: number) => totalDeleteCount += batchDeleteCount,
          (e) => {
            console.log(e);
            reject(e);
          },
          () => resolve(totalDeleteCount),
        ),
    );
  }

  deleteQuestion(questionId: string): Observable<void> {
    return from(this.deleteCollection(`questions/${questionId}/comments`))
      .pipe(
        tap(res => console.log('RES', res)),
        switchMap(res => from(this.db.doc<Question>(`questions/${questionId}`).delete()))
      );
  }

  updateQuestion(question: Question): Observable<void> {
    return from(this.db.doc<Question>(`questions/${question.uid}`).update(question));
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

  getQuestionById(uid): Observable<Question> {
    return this.db.doc<Question>(`questions/${uid}`).valueChanges();
  }

  getQuestions(): Observable<Question[]> {
    return this.auth.checkUser()
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


  private transformData(obs: Observable<DocumentChangeAction<any>[]>) {
    return obs
      .pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data() as Question;
            let uid = a.payload.doc.id;
            return {uid, ...data};
          });

        }));
  }


}
