import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Comment, mUser, Question, UserMessage} from '../../../interfaces';
import {CommentsService} from '../../../components/content/content/services/comments.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../services/spinner.service';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.css']
})
export class AddCommentDialogComponent implements OnInit {
  commentText: string = '';
  showUserMsg: UserMessage;
  constructor(
    public commentsService: CommentsService,
    public dialogRef: MatDialogRef<AddCommentDialogComponent>,
    public spinnerService: SpinnerService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {q: Question , u: mUser}
  ) { this.showUserMsg = new UserMessage(this._snackBar)}

  ngOnInit(): void {
  }

  handleAddComment() {
    const comment: Comment = {
      author: {
        authorName: this.data.u.displayName || this.data.u.email,
        authorId: this.data.u.uid,
        authorPhoto: this.data.u.photoURL || 'https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg'
      },
      date: new Date(),
      isSolution: false,
      questionId: this.data.q.uid,
      text: this.commentText
    };

    this.spinnerService.showSpinner();
    this.commentsService.addComment(comment)
      .then(result => {
        this.showUserMsg.showMsg(`Thank you, ${result.author.authorName} for response!`);
      })
      .catch(err => {
        this.showUserMsg.showMsg(err.message,'Error');
      })
      .finally(() => {
        this.spinnerService.hideSpinner();
        this.dialogRef.close()
      })
  }
}

