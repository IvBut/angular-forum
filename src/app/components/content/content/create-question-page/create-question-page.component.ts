import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {cateGoryList, Question, UserMessage} from '../../../../interfaces';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {QuestionService} from '../services/question.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../../services/spinner.service';

@Component({
  selector: 'app-create-question-page',
  templateUrl: './create-question-page.component.html',
  styleUrls: ['./create-question-page.component.css']
})
export class CreateQuestionPageComponent implements OnInit {
  form: FormGroup;
  categoryList: Array<string> = cateGoryList();
  disableBtn: boolean = false;
  showUserMsg: UserMessage;

  constructor(public router: Router,
              public questionService: QuestionService,
              private _snackBar: MatSnackBar,
              public spinnerService: SpinnerService)
  { this.showUserMsg = new UserMessage(this._snackBar)}

  ngOnInit(): void {
    this.form = new FormGroup({
      title : new FormControl(null,[Validators.required]),
      categories : new FormControl(null,[Validators.required]),
      text : new FormControl(null,[Validators.required])
    });
  }

  handleCancel() {
      this.router.navigate(['content', 'questions']);
  }

  handleAdd() {
    if (this.form.invalid) return null;
    let author: User = <User>JSON.parse(localStorage.getItem('user'));
    let question: Question =  {
      author: {
        authorId: author.uid,
        authorName: !author.email ? author.displayName : author.email,
        authorPhoto: !author.photoURL ? 'https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg' : author.photoURL
      },
      title: this.form.value.title,
      text: this.form.value.text,
      categories: this.form.value.categories,
      date: new Date(),
      onModeration: true,
      isResolved: false
    };

    this.disableBtn = true;
    this.spinnerService.showSpinner();

    this.questionService.addQuestion(question)
      .then(q => {
          this.showUserMsg.showMsg(`Your question: "${q.title}" is accepted. After the administrator checks your question, it will be visible to other users.`)
      })
      .catch(error => {
        this.showUserMsg.showMsg(error.message,'Error');
      })
      .finally(()=>{
        this.form.reset({categories: '', title: '', text: ''});
        this.disableBtn = false;
        this.spinnerService.hideSpinner();
      })
  }
}
