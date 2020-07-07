import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OverlayModule} from '@angular/cdk/overlay';
import {SharedModule} from '../../shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../services/spinner.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {QuestionService} from '../../../components/content/content/services/question.service';
import {CommentsService} from '../../../components/content/content/services/comments.service';
import {EditQuestionDialogComponent} from './edit-question-dialog.component';
import {mUser, Question} from '../../../interfaces';
import {EMPTY, of, throwError} from 'rxjs';


describe('EditQuestionDialogComponent', () => {
  let component: EditQuestionDialogComponent;
  let fixture: ComponentFixture<EditQuestionDialogComponent>;
  let questionService: QuestionService;
  let commentsService: CommentsService;
  let spinnerService: SpinnerService;
  let matDialog: MatDialog;

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
    isSolution: true,
    uid: '0x0000000000001c',
    questionId: question.uid,
    date: new Date(),
    author: {
      authorPhoto: user.photoURL,
      authorName: user.displayName,
      authorId: user.uid
    }
  };

  let questionServiceStub = {
    getQuestionById : () => {},
    updateQuestion: (q: Question) => {return of(q)}
  };

  let commentServStub = {
    getCommentsForQuestion : () => {},
    updateComment: () => {return of(EMPTY)},
    getAnswerCommentForQuestion: () => {return of(comment)}
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditQuestionDialogComponent
      ],
      imports:
        [ OverlayModule,
          SharedModule,
          BrowserAnimationsModule
        ],
      providers: [
        MatSnackBar,
        SpinnerService,
        MatDialog,
        {provide: QuestionService, useValue: questionServiceStub},
        {provide: CommentsService, useValue: commentServStub},
        {provide: MAT_DIALOG_DATA, useValue:  {q: question, u: user}},
        {provide: MatDialogRef, useValue: {close: () => {return null} }}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionDialogComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService);
    commentsService = TestBed.inject(CommentsService);
    spinnerService = TestBed.inject(SpinnerService);
    matDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('Should initialize component', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form).toBeTruthy();
    expect(component.form.valid).toBeTruthy();
  });

  it('should return null if form invalid', () => {
    component.form.setValue({title: null, categories: null, text: null, isResolved: false });
    fixture.detectChanges();
    const result = component.handleEditQuestion();
    expect(result).toBeNull();
  });

  it('should update question', async(() => {
    const  spyOnUpdateQuestion = spyOn(questionService, 'updateQuestion').and.callThrough();
    const spyMsgSer = spyOn(component.showUserMsg, 'showMsg').and.callThrough();
    component.handleEditQuestion();
    expect(spyMsgSer).toHaveBeenCalled();
    expect(spyMsgSer).toHaveBeenCalledWith(`This comment: "${comment.text.substr(0, 25)} ..." is no longer an answer to your question`);
    expect(spyMsgSer).toHaveBeenCalledWith(`Your question "${question.title}" was updated!`);
    expect(spyOnUpdateQuestion).toHaveBeenCalled();
  }));

  it('should throw error while updating question', async(() => {
    let errMsg = 'Error';
    const  spyOnUpdateQuestion = spyOn(questionService, 'updateQuestion').and.returnValue(throwError(new Error(errMsg)));
    const spyMsgSer = spyOn(component.showUserMsg, 'showMsg').and.callThrough();
    const commentsSpy =spyOn(commentsService, 'getAnswerCommentForQuestion').and.callThrough();
    component.form.get('isResolved').setValue(true);
    component.handleEditQuestion();

    expect(commentsSpy).toHaveBeenCalledTimes(0);
    expect(spyOnUpdateQuestion).toHaveBeenCalled();
    expect(spyMsgSer).toHaveBeenCalledWith(errMsg, 'Error');
  }));

});
