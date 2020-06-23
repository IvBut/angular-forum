import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Comment} from '../../../../interfaces';
import {filter, map} from 'rxjs/operators';
import {from, Observable} from 'rxjs';

@Injectable()
export class CommentsService {

  constructor(public db: AngularFirestore) {
  }

  deleteComment(comment: Comment):Observable<void>{
    return from(this.db.doc(`questions/${comment.questionId}/comments/${comment.uid}`).delete());
  }

  updateComment(comment: Comment):Observable<void>{
    return from(this.db.doc<Comment>(`questions/${comment.questionId}/comments/${comment.uid}`).update(comment));
  }

  getCommentsForQuestion(questionId : string):Observable<Comment[]> {
   return this.db.collection<Comment>(`questions/${questionId}/comments`, ref => ref.orderBy('date'))
     .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Comment;
          const uid = a.payload.doc.id;
          return { uid, ...data }
        }))
      )
  }

  getAnswerCommentForQuestion(questionId: string): Observable<Comment> {
    return this.db.collection<Comment>(`questions/${questionId}/comments`, ref => {
      return ref.where('isSolution', '==', true).limit(1);
    })
      .valueChanges()
      .pipe(
        filter(arr => arr.length !== 0),
        map(arr => arr[0])
      );
  }

  async addComment(comment: Comment): Promise<Comment> {
    try {
      let result = await this.db.collection<Comment>(`questions/${comment.questionId}/comments`).add(comment);
      comment.uid = result.id;
      return comment;
    } catch (e) {
      throw  new Error(e);
    }
    // this.db.doc<Comment>(`questions/${comment.questionId}`)
  }
}
