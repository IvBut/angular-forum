import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionPageComponent } from './question-page/question-page.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import { CreateQuestionPageComponent } from './create-question-page/create-question-page.component';
import {QuestionService} from './services/question.service';
import { FilterPipe } from './filter.pipe';
import { SortQuestionsPipe } from './sort-questions.pipe';
import { SelectedQuestionPageComponent } from './selected-question-page/selected-question-page.component';
import {CommentsService} from './services/comments.service';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import {UserInfoService} from './services/user-info.service';



@NgModule({
  declarations: [QuestionPageComponent, CreateQuestionPageComponent, FilterPipe, SortQuestionsPipe, SelectedQuestionPageComponent, ProfilePageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', redirectTo: '/content/questions', pathMatch: 'full'},
      {path: 'questions', component: QuestionPageComponent},
      {path: 'questions/create', component: CreateQuestionPageComponent, pathMatch: 'full'},
      {path: 'question/:uid', component: SelectedQuestionPageComponent, pathMatch: 'full'},
      {path: 'profile', component: ProfilePageComponent}
    ])
  ],
  providers: [QuestionService, CommentsService, UserInfoService]
})
export class ContentModule { }
