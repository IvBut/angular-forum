import { Pipe, PipeTransform } from '@angular/core';
import {Question} from '../../../interfaces';

@Pipe({
  name: 'sortQuestions'
})
export class SortQuestionsPipe implements PipeTransform {

  transform(questionList: Array<Question>, sortDirection: boolean): Question[]  {
    let direction = sortDirection=== true? 1 : -1;
    return questionList.sort((a,b)=> {
      let date1 = new Date(a.date['seconds']*1000);
      let date2 = new Date(b.date['seconds']*1000);
      return (Number(date1) - Number(date2)) * direction
    });
  }

}
