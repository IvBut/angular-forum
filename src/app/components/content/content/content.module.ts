import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionPageComponent } from './question-page/question-page.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';



@NgModule({
  declarations: [QuestionPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', redirectTo: '/content/questions', pathMatch: 'full'},
      {path: 'questions', component: QuestionPageComponent}
    ])
  ],
  providers: []
})
export class ContentModule { }
