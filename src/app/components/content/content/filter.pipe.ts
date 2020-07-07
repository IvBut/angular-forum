import { Pipe, PipeTransform } from '@angular/core';
import {mUser, Question} from '../../../interfaces';
import {User} from 'firebase';
import {AuthFBService} from '../../../services/auth-fb.service';

@Pipe({
  name: 'filterQuestions'
})
export class FilterPipe implements PipeTransform {

  constructor(public authService: AuthFBService) {
  }

  transform(questionsList: Array<Question>,
            resolveFilterValue: string | null ,
            categoriesFilterValue: Array<string> ,
            dateFilterValue: string | null,
            adminApproveFilterValue: boolean | null,
            myQuestionsFilterValue: boolean | null,
  ): Question[] | Array<number> {

    if (!resolveFilterValue && !categoriesFilterValue && !dateFilterValue && !adminApproveFilterValue && !myQuestionsFilterValue) {
      return questionsList;
    }
    // let result = [...questionsList];
    let result = questionsList;
    result = this.filterQuestionsByResolve(result,resolveFilterValue);
    result = this.filterQuestionByCategory(result,categoriesFilterValue);
    result = this.filterQuestionByDate(result,dateFilterValue);
    result = this.filterQuestionsByAdminApprove(result,adminApproveFilterValue);
    result = this.filterMyQuestions(result,myQuestionsFilterValue);

    if(result.length === 0) {
      return [-1];
    }

    return result;
  }


  filterQuestionsByResolve(questions: Question[], filterValue: string): Question[]{
    if (!filterValue) return questions;
    let val = filterValue === 'true';
    return questions.filter(item => item.isResolved === val);
  }

  filterQuestionByCategory(questions: Question[], filterValue: Array<string>): Question[] {
    if (!filterValue || filterValue.length == 0) return questions;
     return questions.filter(q => {
       let res = q.categories.filter(category => filterValue.includes(category));
       return res.length > 0 ? q : null;
     })
  }

  filterQuestionByDate(questions: Question[] | any[], filterValue: string):Question[]{
    if (!filterValue) return questions;

    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let result:Question[] = [];

    if (filterValue === 'day') {
      result = questions.filter(item => {
        let itemDate = new Date(item.date['seconds']*1000);
        let dateForCompare = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        return dateForCompare.valueOf() === today.valueOf();
      });
    } else if (filterValue === 'week') {
      result = questions.filter(item => {
        let itemDate = new Date(item.date['seconds']*1000);
        let dateForCompare = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        let startDate = new Date(today.getTime() - 6*3600*24*1000);
        return dateForCompare.valueOf() >= startDate.valueOf();
      });
    } else if (filterValue === 'month') {
      result = questions.filter(item => {
        let itemDate = new Date(item.date['seconds']*1000);
        let dateForCompare = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        return dateForCompare.getMonth() == today.getMonth() && dateForCompare.getFullYear() == today.getFullYear();
      });
    }
    return result;
  }

  filterQuestionsByAdminApprove(questions: Question[], filterValue: boolean): Question[]{
    if (!filterValue) return questions;
    return questions.filter(item => item.onModeration === filterValue);
  }

  filterMyQuestions(questions: Question[], filterValue: boolean): Question[] {
    if (!filterValue) {
      return questions;
    }
    let user = <User> JSON.parse(this.authService.sessionData);
    return questions.filter(item => item.author.authorId === user.uid);
  }
}
