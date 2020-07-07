import {SelectedQuestionPageComponent} from './selected-question-page.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {QuestionService} from '../services/question.service';
import {CommentsService} from '../services/comments.service';
import {OverlayModule} from '@angular/cdk/overlay';
import {RouterTestingModule} from '@angular/router/testing';
import {QuestionPageComponent} from '../question-page/question-page.component';
import {SharedModule} from '../../../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../../services/spinner.service';
import {ActivatedRoute, convertToParamMap, ParamMap, Params} from '@angular/router';
import {EMPTY, of, ReplaySubject, throwError} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Comment, mUser, Question} from '../../../../interfaces';
import {AuthFBService} from '../../../../services/auth-fb.service';



export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();
  readonly params = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}

describe('SelectedQuestionPageComponent', () => {
  let componet: SelectedQuestionPageComponent;
  let fixture: ComponentFixture<SelectedQuestionPageComponent>;
  let questionService: QuestionService;
  let commentsService: CommentsService;
  let authService: AuthFBService;
  let spinnerService: SpinnerService;
  let matDialog: MatDialog;

  let activatedRoute: ActivatedRouteStub;
  let route: ActivatedRoute;

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

  let comments: Array<Comment> = [
    {
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
    },
    {
      text: 'comment2',
      isSolution: false,
      uid: '0x0000000000002c',
      questionId: question.uid,
      date: new Date(),
      author: {
        authorPhoto: user.photoURL,
        authorName: user.displayName,
        authorId: user.uid
      }
    }
  ];

  let questionServiceStub = {
    getQuestionById : () => {},
    updateQuestion: (q: Question) => {return of(q)},
    deleteQuestion: (uid: string) => {return of(EMPTY)}
  };

  let commentServStub = {
    getCommentsForQuestion : () => {},
    updateComment: () => {return of(comments[0])},
    deleteComment: () => {return of(EMPTY)}
  };

  let authServiceStub = {
    checkUser: () => {return of(user).pipe()}
  };

  let setup = (cmp) => {
    let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of('OK'), close: null });
    dialogRefSpyObj.componentInstance = { body: '' };
    return  spyOn(cmp.dialog, 'open').and.callFake(() => cmp.dialogRef = dialogRefSpyObj);
  };

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({uid: question.uid})
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectedQuestionPageComponent
      ],
      imports:
        [ OverlayModule,
          RouterTestingModule.withRoutes(
            [
              {path: 'content/questions', component: QuestionPageComponent}
            ]),
          SharedModule,
          BrowserAnimationsModule
        ],
      providers: [
        MatSnackBar,
        SpinnerService,
        MatDialog,
        {provide: ActivatedRoute , useValue: activatedRoute},
        {provide: QuestionService, useValue: questionServiceStub},
        {provide: CommentsService, useValue: commentServStub},
        {provide: AuthFBService, useValue: authServiceStub},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedQuestionPageComponent);
    componet = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService);
    commentsService = TestBed.inject(CommentsService);
    authService = TestBed.inject(AuthFBService);
    spinnerService = TestBed.inject(SpinnerService);
    matDialog = TestBed.inject(MatDialog);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should initialize component', () => {
    const spyGetQuestion = spyOn(questionService, 'getQuestionById').and.returnValue(of(question));
    const spyAuthCheck = spyOn(authService, 'checkUser').and.returnValue(of(user));
    const spyGetComments = spyOn(commentsService, 'getCommentsForQuestion').and.returnValue(of(comments));

    fixture.detectChanges();
    componet.ngOnInit();
    fixture.detectChanges();

    expect(spyGetQuestion).toHaveBeenCalled();
    expect(spyAuthCheck).toHaveBeenCalled();
    expect(spyGetComments).toHaveBeenCalled();

    expect(componet.authorId).toEqual(user.uid);
    expect(componet.currentUser$).toBeTruthy();
    expect(componet.currentQuestion$).toBeTruthy();
    expect(componet.mUser).toEqual(user);

  });

  it('should add comment to db', () => {
    const spyOnDialog = spyOn(componet.dialog, 'open').and.callThrough();
    componet.handleAddComment(question, user);
    expect(spyOnDialog).toHaveBeenCalled()
  });

  it('should approve question', async(() => {
    const spyOnDialog = setup(componet);
    const  spyOnUpdate = spyOn(questionService, 'updateQuestion').and.callThrough();

    componet.handleApprove(question, null);
    expect(componet.dialogTitle).toContain(question.title);
    expect(componet.dialogRef).toBeTruthy();
    expect(spyOnDialog).toHaveBeenCalled();
    expect(spyOnUpdate).toHaveBeenCalled();
  }));

  it('should return error while approving question', async (() => {
    let errMsg = 'Error msg';
    const spyOnDialog = setup(componet);
    const  spyOnUpdate = spyOn(questionService, 'updateQuestion').and.returnValue(throwError(new Error(errMsg)));
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleApprove(question, null);
    expect(spyOnDialog).toHaveBeenCalled();
    expect(spyOnUpdate).toHaveBeenCalled();
    expect(spyMsgSer).toHaveBeenCalledWith(`Something goes wrong!: ${errMsg}`,'Error');
  }));

  it('should select comment as solving', async(() => {
    const spyOnDialog = setup(componet);
    const  spyOnUpdateQuestion = spyOn(questionService, 'updateQuestion').and.callThrough();
    const  spyOnUpdateComment = spyOn(commentsService, 'updateComment').and.callThrough();
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleCommentMark(comments[0],question,null);
    expect(spyOnDialog).toHaveBeenCalled();
    expect(spyOnUpdateComment).toHaveBeenCalled();
    expect(spyOnUpdateQuestion).toHaveBeenCalled();
    expect(componet.dialogTitle).toContain('Mark as');
    expect(componet.dialogRef).toBeTruthy();
    expect(spyMsgSer).toHaveBeenCalledWith(`Your question marked as resolved!`);

  }));

  it('should return error while checking comment as solution ', async (() => {
    let errMsg = 'Error msg';
     setup(componet);
    const  spyOnUpdate = spyOn(questionService, 'updateQuestion').and.returnValue(throwError(new Error(errMsg)));
    const  spyOnUpdateComment = spyOn(commentsService, 'updateComment').and.returnValue(throwError(new Error(errMsg)));
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleCommentMark(comments[0],question, null);
    expect(spyOnUpdate).toHaveBeenCalled();
    expect(spyOnUpdateComment).toHaveBeenCalled();
    expect(spyMsgSer).toHaveBeenCalledWith(`Something goes wrong!: ${errMsg}`,'Error');
  }));

  it('should delete question', async(() => {
    const spyOnDialog = setup(componet);
    componet.questionId = question.uid;
    const  spyOnDeleteQuestion = spyOn(questionService, 'deleteQuestion').and.callThrough();
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleDelete(question,null);
    expect(spyOnDialog).toHaveBeenCalled();
    expect(spyOnDeleteQuestion).toHaveBeenCalled();
    expect(componet.dialogTitle).toContain(`Do you want to delete this question: "${question.title}"?`);
    expect(componet.dialogRef).toBeTruthy();
    expect(spyMsgSer).toHaveBeenCalledWith(`You delete this question: ${question.title}`);

  }));

  it('should throw error while deleting question', async(() => {
    let errMsg = 'Delete error';
    setup(componet);
    componet.questionId = question.uid;
    const  spyOnDeleteQuestion = spyOn(questionService, 'deleteQuestion').and.returnValue(throwError(new Error(errMsg)));
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleDelete(question,null);
    expect(spyOnDeleteQuestion).toHaveBeenCalled();
    expect(spyMsgSer).toHaveBeenCalledWith(`Something goes wrong!: ${errMsg}`,'Error');

  }));


  it('should delete comment', async(() => {
    const spyOnDialog = setup(componet);
    const  spyOnUpdateQuestion = spyOn(questionService, 'updateQuestion').and.callThrough();
    const  spyOnDeleteComment = spyOn(commentsService, 'deleteComment').and.callThrough();
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleDeleteComment({...(comments[0]),isSolution: true },question,null);
    expect(spyOnDialog).toHaveBeenCalled();
    expect(spyOnUpdateQuestion).toHaveBeenCalled();
    expect(spyOnDeleteComment).toHaveBeenCalled();
    expect(componet.dialogTitle).toContain(`Delete this comment?`);
    expect(componet.dialogRef).toBeTruthy();
    expect(spyMsgSer).toHaveBeenCalledWith(`You successfully delete comment`);

    componet.handleDeleteComment({...(comments[0]),isSolution: false },question,null);
    expect(spyOnUpdateQuestion).toHaveBeenCalledTimes(1);
  }));

  it('should throw error while deleting comment', async(() => {
    let errMsg = 'Delete comment error';
    setup(componet);
    const  spyOnUpdateQuestion = spyOn(questionService, 'updateQuestion').and.returnValue(throwError(new Error(errMsg)));
    const  spyOnDeleteComment = spyOn(commentsService, 'deleteComment').and.returnValue(throwError(new Error(errMsg)));
    const spyMsgSer = spyOn(componet.userMessage, 'showMsg').and.callThrough();

    componet.handleDeleteComment({...(comments[0]),isSolution: true },question,null);
    expect(spyOnUpdateQuestion).toHaveBeenCalled();
    expect(spyOnDeleteComment).toHaveBeenCalled();
    expect(spyMsgSer).toHaveBeenCalledWith(`Something goes wrong!: ${errMsg}`,'Error');

  }));

  it('should edit question to db', () => {
    const spyOnDialog = spyOn(componet.dialog, 'open').and.callThrough();
    componet.handleEditQuestion(question, user);
    expect(spyOnDialog).toHaveBeenCalled()
  });

});
