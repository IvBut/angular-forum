import {CreateQuestionPageComponent} from './create-question-page.component';
import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {QuestionPageComponent} from '../question-page/question-page.component';
import {QuestionService} from '../services/question.service';
import {Router} from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Question} from '../../../../interfaces';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../../services/spinner.service';


describe('CreateQuestionPageComponent', () => {
  let component: CreateQuestionPageComponent;
  let fixture: ComponentFixture<CreateQuestionPageComponent>;
  let questionService: QuestionService;
  let spinnerService: SpinnerService;
  let router: Router;

  let sessionData =  '{\n' +
    `  "uid": "0x00000001u",\n` +
    '  "displayName": "testuser1@test.com",\n' +
    '  "photoURL": "https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg",\n' +
    '  "email": "testuser1@test.com",\n' +
    '  "emailVerified": false,\n' +
    '  "phoneNumber": null,\n' +
    '  "isAnonymous": false,\n' +
    '  "tenantId": null,\n' +
    '  "providerData": [\n' +
    '    {\n' +
    '      "uid": "testuser@test.com",\n' +
    '      "displayName": "testuser@test.com",\n' +
    '      "photoURL": "https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg",\n' +
    '      "email": "testuser1@test.com",\n' +
    '      "phoneNumber": null,\n' +
    '      "providerId": "password"\n' +
    '    }\n' +
    '  ],\n' +
    '  "apiKey": "",\n' +
    '  "appName": "[DEFAULT]",\n' +
    '  "authDomain": "",\n' +
    '  "stsTokenManager": {\n' +
    '    "apiKey": "",\n' +
    '    "refreshToken": "",\n' +
    '    "accessToken": "",\n' +
    '    "expirationTime": 1593546667000\n' +
    '  },\n' +
    '  "redirectEventId": null,\n' +
    '  "lastLoginAt": "1593543067910",\n' +
    '  "createdAt": "1591606173067",\n' +
    '  "multiFactor": {\n' +
    '    "enrolledFactors": []\n' +
    '  }\n' +
    '}';

  let questionServiceStub = {
    addQuestion: (question: Question): Promise<Question> => {
      try {
        return Promise.resolve(question);
      }catch (e) {
        return Promise.reject(e);
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateQuestionPageComponent
      ],
      imports: [OverlayModule,
        RouterTestingModule.withRoutes(
          [
            {path: 'content/questions', component: QuestionPageComponent}
          ]),
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: QuestionService, useValue: questionServiceStub},
        MatSnackBar,
        SpinnerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionPageComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService);
    spinnerService = TestBed.inject(SpinnerService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('check component init', () => {
    component.ngOnInit();
    expect(component.form).toBeTruthy();
  });

  it('check navigation to main components page', () => {
    let routerSpy = spyOn(router, 'navigate').and.callThrough();
    component.handleCancel();
    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy).toBeTruthy();
  });

  it('check for invalid form', () => {
      component.form.setValue({
        title: 'test',
        categories: null,
        text: ''
      });
    fixture.detectChanges();
    expect(component.form.get('categories').hasError('required')).toBeTruthy();
    expect(component.form.get('text').hasError('required')).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
    let result = component.handleAdd();
    expect(result).toBeNull();
  });

  it('check adding question to db', async(() => {
    localStorage.setItem('user', sessionData);
    component.form.setValue({
      title: 'test',
      categories: ['Java', 'JS'],
      text: 'test'
    });
    let resolver = spyOn(questionService, 'addQuestion').and.callThrough();
    let spinnerShowSpy = spyOn(spinnerService, 'showSpinner').and.callThrough();
    component.handleAdd();
    expect(resolver).toHaveBeenCalled();
    expect(spinnerShowSpy).toHaveBeenCalled();
  }));

  it('check error after addQuestion method failed', (done) => {
    let serviceMethodSpy = spyOn(component.questionService, 'addQuestion').and.returnValue(Promise.reject(new Error('Error')));
    localStorage.setItem('user', sessionData);
    component.form.setValue({
      title: 'test',
      categories: ['Java', 'JS'],
      text: 'test'
    });
    component.handleAdd();
    done();
    fixture.detectChanges();
    expect(serviceMethodSpy).toHaveBeenCalled();
  });

});
