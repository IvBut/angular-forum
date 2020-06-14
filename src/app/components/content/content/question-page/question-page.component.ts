import { Component, OnInit } from '@angular/core';
import {AuthFBService} from '../../../../services/auth-fb.service';
import {cateGoryList, mUser, Question} from '../../../../interfaces';
import {Router} from '@angular/router';
import {QuestionService} from '../services/question.service';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.css']
})
export class QuestionPageComponent implements OnInit {
  templateStr: any;
  questionsList: Array<Question> = [];
  user$: Observable<mUser>;

  panelOpenState: boolean = false;
  form: FormGroup;
  resolveFilterValue: string | null = null;
  categoryList: Array<string> = cateGoryList();
  categoriesFilterValue: Array<string> = [];
  displayAsCards: boolean = true;
  dateFilterValue: string | null = null;
  adminApproveFilterValue: boolean | null = false;
  myQuestionsFilterValue: boolean | null = false;
  sortDirection: boolean = true;

  constructor(private authFB: AuthFBService,
              private router: Router,
              public questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.user$ = this.questionService.checkUser();
    this.questionService.getQuestions().subscribe(q=>{
        let filteredList = new Set<string>();
        q.forEach(item => filteredList.add(JSON.stringify(item)));

        let buffer = [];
        filteredList.forEach(element => buffer.push(<Question>JSON.parse(element)));
         this.questionsList = [...buffer];
      console.log(this.questionsList);
    });

    this.form = new FormGroup({
      questionResolveGroup: new FormControl(null),
      questionCategoryGroup: new FormControl(null),
      questionDateGroup: new FormControl(null),
      questionApproveGroup: new FormControl(null),
      questionMineGroup: new FormControl(null)
    })
  }

  handleAddClick() {
    this.router.navigate(['content','questions', 'create']);
  }

  handleSortBtnClick() {
    this.sortDirection = !this.sortDirection;
  }

  resetFilters() {
    this.form.controls['questionResolveGroup'].reset();
    this.form.controls['questionCategoryGroup'].reset();
    this.form.controls['questionDateGroup'].reset();
    this.form.controls['questionApproveGroup'].reset();
    this.form.controls['questionMineGroup'].reset();
  }


}
