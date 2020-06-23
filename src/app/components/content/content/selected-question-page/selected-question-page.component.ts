import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment, mUser, Question, UserMessage} from '../../../../interfaces';
import {QuestionService} from '../services/question.service';
import {merge, Observable} from 'rxjs';
import {AuthFBService} from '../../../../services/auth-fb.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddCommentDialogComponent} from '../../../../shared/components/add-comment-dialog/add-comment-dialog.component';
import {filter, switchMap, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../../services/spinner.service';
import {CommentsService} from '../services/comments.service';
import {EditQuestionDialogComponent} from '../../../../shared/components/edit-question-dialog/edit-question-dialog.component';

@Component({
  selector: 'app-selected-question-page',
  templateUrl: './selected-question-page.component.html',
  styleUrls: ['./selected-question-page.component.css']
})
export class SelectedQuestionPageComponent implements OnInit {
  userMessage: UserMessage;

  currentQuestion$: Observable<Question>;
  currentUser$: Observable<mUser>;
  comments$: Observable<Comment[]>;
  questionId: string = '';
  authorId: string = '';
  mUser:mUser;


  dialogTitle: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public questionService: QuestionService,
              public commentsService: CommentsService,
              public auth: AuthFBService,
              public dialog: MatDialog,
              private _matSnakBar: MatSnackBar,
              public spinnerService: SpinnerService
  ) {
    this.userMessage = new UserMessage(this._matSnakBar);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.questionId = param['uid'];
      this.currentQuestion$ = this.questionService.getQuestionById(param['uid']);
      this.currentUser$ = this.auth.checkUser().pipe(tap(result => {
        this.authorId = result.uid;
        this.mUser = result;
      }));
      this.comments$ = this.commentsService.getCommentsForQuestion(this.questionId);
    });
  }

  handleAddComment(q: Question, u: mUser) {
    q.uid = this.questionId;
    const createComment = this.dialog.open(AddCommentDialogComponent, {
      data: {q, u},
      minWidth: '300px',
      width: '50%',
      hasBackdrop: true
    });

  }

  dialogRef: MatDialogRef<any>;

  handleApprove(q: Question, temp: TemplateRef<any>) {
    this.dialogTitle = `Approve this question: "${q.title}"?`;
    this.dialogRef = this.dialog.open(temp, {
      data: q
    });

    this.dialogRef.afterClosed().pipe(
      filter(yesNoResult => yesNoResult === 'OK'),
      switchMap(item => {
        this.spinnerService.showSpinner();
        q.uid = this.questionId;
        q.onModeration = false;
        return this.questionService.updateQuestion(q);
      })
    ).subscribe(() => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`You approved this question: ${q.title}`);
    }, (err) => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`Something goes wrong!: ${err.message}`,'Error');
    }, () => {
      this.spinnerService.hideSpinner();
    });
  }

  handleDelete(q: Question, temp: TemplateRef<any>) {
    this.dialogTitle = `Do you want to delete this question: "${q.title}"?`;
    this.dialogRef = this.dialog.open(temp,{data: q});

    this.dialogRef.afterClosed().pipe(
      filter( yesNoResult => yesNoResult === 'OK'),
      switchMap(item => {
        this.spinnerService.showSpinner();
        return this.questionService.deleteQuestion(this.questionId)
      })
    ).subscribe(()=>{
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`You delete this question: ${q.title}`);
      this.router.navigate(['content','questions']);
    }, (error => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`Something goes wrong!: ${error.message}`,'Error');
    }), () => {
      this.spinnerService.hideSpinner();
    })
  }

  handleCommentMark(c: Comment,q: Question, temp: TemplateRef<any>) {
    this.dialogTitle = `Mark as solution?`;
    this.dialogRef = this.dialog.open(temp, {
      data: c
    });

    this.dialogRef.afterClosed().pipe(
      filter(yesNoResult => yesNoResult === 'OK'),
      switchMap(item => {
        q.uid = this.questionId;
        q.isResolved = true;
        c.isSolution = true;
        this.spinnerService.showSpinner();
        const obs1$ = this.questionService.updateQuestion(q);
        const obs2$ = this.commentsService.updateComment(c);
        return merge(obs1$,obs2$)
      })
    ).subscribe(() => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`Your question marked as resolved!`);
    }, (error => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`Something goes wrong!: ${error.message}`,'Error');
    }), ()=>{
      this.spinnerService.hideSpinner();
    })
  }

  handleDeleteComment(c: Comment, q: Question, temp: TemplateRef<any>) {
    this.dialogTitle = `Delete this comment?`;
    this.dialogRef = this.dialog.open(temp, {
      data: c
    });

    this.dialogRef.afterClosed().pipe(
      filter(yesNoResult => yesNoResult === 'OK'),
      switchMap(item => {
        this.spinnerService.showSpinner();
        if (!c.isSolution){
          return this.commentsService.deleteComment(c);
        }
        q.uid = this.questionId;
        q.isResolved = false;
        const obs1$ = this.questionService.updateQuestion(q);
        const obs2$ = this.commentsService.deleteComment(c);
        return merge(obs1$,obs2$);
      })
    ).subscribe(() => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`You successfully delete comment`);
    }, (error => {
      this.spinnerService.hideSpinner();
      this.userMessage.showMsg(`Something goes wrong!: ${error.message}`,'Error');
    }), () => {
      this.spinnerService.hideSpinner();
    })
  }

  handleEditQuestion(q: Question, u: mUser) {
    q.uid = this.questionId;
    const createComment = this.dialog.open(EditQuestionDialogComponent, {
      data: {q, u},
      width: '100%',
      hasBackdrop: true
    });
  }
}
