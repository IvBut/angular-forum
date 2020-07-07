import {AddCommentDialogComponent} from './add-comment-dialog.component';
import {CommentsService} from '../../../components/content/content/services/comments.service';
import {mUser, Question} from '../../../interfaces';
import {SpinnerService} from '../../../services/spinner.service';
import {fakeAsync, tick} from '@angular/core/testing';

describe('AddCommentDialogComponent ', () => {
  let user: mUser = {
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

  let question: Question = {
    title: 'test',
    uid: 'ox000000001q',
    isResolved: false,
    onModeration: false,
    text: 'test',
    author: {
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL
    },
    categories: ['Java'],
    date: new Date()
  };

  let comment = {
      text: 'comment1',
      isSolution: false,
      uid: '0x0000000000001c',
      questionId: question.uid,
      date: new Date(),
      author: {
        authorPhoto: user.photoURL,
        authorName: user.displayName,
        authorId: user.uid
      }
    };


  let spyServObj = jasmine.createSpyObj({
    db: {},
    addComment: null
  });

  let commentsService = new CommentsService(spyServObj);
  let spinnerService = new SpinnerService();
  let dialogRefSpyObj = jasmine.createSpyObj({
    close: null,
    componentInstance: {
      body: ''
    }
  });

  let snackBarSpyObj = jasmine.createSpyObj({
      open: null
  });
  let dialog = new AddCommentDialogComponent(commentsService, dialogRefSpyObj, spinnerService, snackBarSpyObj, {q: question, u: user});


  it('should init component', () => {
    const spy = spyOn(dialog, 'ngOnInit').and.callThrough();
    dialog.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should add comment', fakeAsync (() => {
    dialog.commentText = 'test comment';
    const spyOnService = spyOn(commentsService, 'addComment').and.returnValue(Promise.resolve(comment));
    const spyOnMsg = spyOn(dialog.showUserMsg, 'showMsg').and.callThrough();
    dialog.handleAddComment();
    tick();
    expect(spyOnService).toHaveBeenCalled();
    expect(spyOnMsg).toHaveBeenCalled();
    expect(spyOnMsg).toHaveBeenCalledWith(`Thank you, ${comment.author.authorName} for response!`)
  }));

  it('should throw error', fakeAsync (() => {
    dialog.commentText = 'test comment';
    let errMsg = 'Error';
    const spyOnService = spyOn(commentsService, 'addComment').and.returnValue(Promise.reject(new Error(errMsg)));
    const spyOnMsg = spyOn(dialog.showUserMsg, 'showMsg').and.callThrough();
    dialog.handleAddComment();
    tick();
    expect(spyOnService).toHaveBeenCalled();
    expect(spyOnMsg).toHaveBeenCalled();
    expect(spyOnMsg).toHaveBeenCalledWith(`${errMsg}`,'Error');
    expect(dialogRefSpyObj.close).toHaveBeenCalled();
  }));
});
