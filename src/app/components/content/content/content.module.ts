import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionPageComponent } from './question-page/question-page.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import { CreateQuestionPageComponent } from './create-question-page/create-question-page.component';
import {QuestionService} from './services/question.service';
import { FilterPipe } from './filter.pipe';
import { SortQuestionsPipe } from './sort-questions.pipe';



@NgModule({
  declarations: [QuestionPageComponent, CreateQuestionPageComponent, FilterPipe, SortQuestionsPipe],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', redirectTo: '/content/questions', pathMatch: 'full'},
      {path: 'questions', component: QuestionPageComponent},
      {path: 'questions/create', component: CreateQuestionPageComponent, pathMatch: 'full'}
    ])
  ],
  providers: [QuestionService]
})
export class ContentModule { }
