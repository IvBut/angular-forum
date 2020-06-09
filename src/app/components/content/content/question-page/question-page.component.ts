import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthFBService} from '../../../../services/auth-fb.service';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.css']
})
export class QuestionPageComponent implements OnInit {
  templateStr: any;

  constructor(private authFB: AuthFBService) { }

  ngOnInit(): void {
   this.templateStr = this.authFB.sessionData;
  }

}
