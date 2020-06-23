import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CommentsService} from '../../../components/content/content/services/comments.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {cateGoryList, Comment, mUser, Question, UserMessage} from '../../../interfaces';
import {MatSnackBar} from '@angular/material/snack-bar';
import {QuestionService} from '../../../components/content/content/services/question.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {filter, switchMap} from 'rxjs/operators';
import {SpinnerService} from '../../../services/spinner.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.css']
})
export class EditQuestionDialogComponent implements OnInit, OnDestroy {
  showUserMsg: UserMessage;
  form: FormGroup;
  categoryList: Array<string> = cateGoryList();

  updQSub: Subscription;
  updCSub: Subscription;

  constructor(
    public questionService: QuestionService,
    public commentsService: CommentsService,
    public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
    public spinnerService: SpinnerService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { q: Question, u: mUser }
  ) {
    this.showUserMsg = new UserMessage(this._snackBar);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(this.data.q.title, [Validators.required]),
      categories: new FormControl(this.data.q.categories, [Validators.required]),
      text: new FormControl(this.data.q.text, [Validators.required]),
      isResolved: new FormControl(this.data.q.isResolved)
    });
  }

  handleEditQuestion() {
    if (this.form.invalid) {
      return null;
    }
    let question: Question = {
      uid: this.data.q.uid,
      title: this.form.value.title,
      categories: this.form.value.categories,
      text: this.form.value.text,
      isResolved: this.form.value.isResolved,
      author: this.data.q.author,
      onModeration: this.data.q.onModeration,
      date: this.data.q.date
    };

    this.spinnerService.showSpinner();
   this.updQSub = this.questionService.updateQuestion(question).subscribe(() => {
      if (!question.isResolved) {
        let com: Comment;
       this.updCSub = this.commentsService.getAnswerCommentForQuestion(question.uid)
          .pipe(
            switchMap(comment => {
              comment.isSolution = false;
              com = comment;
              return this.commentsService.updateComment(comment);
            })
          ).subscribe(() => {
          this.showUserMsg.showMsg(`This comment: "${com.text.substr(0, 25)} ..." is no longer an answer to your question`);
        }, (error => {
          this.showUserMsg.showMsg(error.message, 'Error');
        }));
      }
      this.spinnerService.hideSpinner();
      this.showUserMsg.showMsg(`Your question "${question.title}" was updated!`);
    }, (error => {
      this.spinnerService.hideSpinner();
      this.showUserMsg.showMsg(error.message, 'Error');
      this.dialogRef.close();
    }), () => {
      this.spinnerService.hideSpinner();
      this.dialogRef.close();
    });

  }

  ngOnDestroy(): void {
    if (this.updQSub) {
      this.updQSub.unsubscribe();
    }

    if (this.updCSub) {
      this.updCSub.unsubscribe();
    }
  }
}
