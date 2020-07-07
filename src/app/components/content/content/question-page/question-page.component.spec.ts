import {QuestionPageComponent} from './question-page.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthFBService} from '../../../../services/auth-fb.service';
import {QuestionService} from '../services/question.service';
import {OverlayModule} from '@angular/cdk/overlay';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {cateGoryList, mUser, Question} from '../../../../interfaces';
import {of} from 'rxjs';
import {FilterPipe} from '../filter.pipe';
import {SortQuestionsPipe} from '../sort-questions.pipe';
import {Renderer2, Type} from '@angular/core';
import {SelectedQuestionPageComponent} from '../selected-question-page/selected-question-page.component';
import {Router} from '@angular/router';
import {CreateQuestionPageComponent} from '../create-question-page/create-question-page.component';

describe('QuestionPageComponent', () => {
  let component: QuestionPageComponent;
  let fixture: ComponentFixture<QuestionPageComponent>;
  let authFBService: AuthFBService;
  let questionService: QuestionService;
  let renderer2: Renderer2;
  let router: Router;

  const author1:mUser = {
    uid: '0x00000001u',
    email: 'user1@test.com',
    emailVerified: true,
    photoURL: '',
    roles: {
      admin: true,
      guest: false
    },
    displayName:'admin_test_user'
  };

  const author2:mUser = {
    uid: '0x00000002u',
    email: 'user2@test.com',
    emailVerified: true,
    photoURL: '',
    roles: {
      admin: false,
      guest: true
    },
    displayName:'test_user'
  };

  let questionList:Array<Question> = [
    {
      title: 'question1',
      isResolved: false,
      date: new Date(),
      onModeration: true,
      text: 'test text',
      categories: cateGoryList(),
      uid: '0x0000000001q',
      author: {
        authorId: author2.uid,
        authorName: author2.displayName,
        authorPhoto: author2.photoURL
      }
    },
    {
      title: 'question2',
      isResolved: false,
      date: new Date(),
      onModeration: false,
      text: 'test text',
      categories: cateGoryList(),
      uid: '0x0000000002q',
      author: {
        authorId: author1.uid,
        authorName: author1.displayName,
        authorPhoto: author1.photoURL
      }
    },
    {
      title: 'question3',
      isResolved: true,
      date: new Date(),
      onModeration: false,
      text: 'test text',
      categories: cateGoryList(),
      uid: '0x0000000003q',
      author: {
        authorId: author2.uid,
        authorName: author2.displayName,
        authorPhoto: author2.photoURL
      }
    },
  ];

  let authServiceStub = {
    checkUser: () => {
      return of(author1);
    },
    get sessionData() {
      return '{\n' +
        `  "uid": "${author1.uid}",\n` +
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
    }
  };

  let questionServiceStub = {
    getQuestions: () => {
        return of(questionList);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionPageComponent,
        FilterPipe,
        SortQuestionsPipe
      ],
      imports: [OverlayModule,
        RouterTestingModule.withRoutes(
          [
            {path: 'content/question/:uid', component: SelectedQuestionPageComponent},
            {path: 'content/questions/create', component: CreateQuestionPageComponent}
          ]),
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: AuthFBService, useValue: authServiceStub},
        {provide: QuestionService, useValue: questionServiceStub},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPageComponent);
    component = fixture.componentInstance;
    authFBService = TestBed.inject(AuthFBService);
    questionService = TestBed.inject(QuestionService);
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create the question-page component', () => {
    expect(component).toBeTruthy();
  });

  it('check component initialization', () => {
    component.ngOnInit();
    expect(component.user$).toBeTruthy();
    expect(component.queSerSub).toBeTruthy();
    expect(component.questionsList.length).toBeGreaterThan(0);
    expect(component.form).toBeTruthy();
  });

  it('check application changing color', () => {
    component.appColor = "#ccc";
    let renderSpy = spyOn(renderer2, 'setStyle').and.callThrough();
    component.handleChangeAppColor();
    expect(renderSpy).toHaveBeenCalled();
    fixture.detectChanges();
  });

  it('checking navigation to the selected component', () => {
     let routerSpy = spyOn(router, 'navigate').and.callThrough();
      component.handleNavigate(questionList[0].uid, author1);
      expect(routerSpy).toHaveBeenCalled();
      expect(routerSpy).toBeTruthy();
  });

  it('checking navigation to the create question page component', () => {
    let routerSpy = spyOn(router, 'navigate').and.callThrough();
    component.handleAddClick();
    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy).toBeTruthy();
  });

  it('check component detect sorting direction', () => {
    component.handleSortBtnClick();
    expect(component.sortDirection).toBeFalsy();
  });

  it('check for reseting filter values', () => {
    component.form.setValue({
      questionResolveGroup: 'false',
      questionCategoryGroup: [questionList[0].categories],
      questionDateGroup: 'day',
      questionApproveGroup: true,
      questionMineGroup: true
    });
    component.resetFilters();
    expect(component.form.controls.questionResolveGroup.value).toBeNull();
    expect(component.form.controls.questionCategoryGroup.value).toBeNull();
    expect(component.form.controls.questionDateGroup.value).toBeNull();
    expect(component.form.controls.questionApproveGroup.value).toBeNull();
    expect(component.form.controls.questionMineGroup.value).toBeNull();
  });

  it('check filter pipe', () => {
    let result = [];
    let filterPipe = new FilterPipe(authFBService);
      /*filter questions that belong to the current user*/
    result = filterPipe.filterMyQuestions(questionList,true);
    expect(result.length).toBe(1);
    result = filterPipe.filterMyQuestions(questionList, false);
    expect(result.length).toBe(3);
      /*check questions that should be approved*/
    result = filterPipe.filterQuestionsByAdminApprove(questionList, true);
    expect(result.length).toBe(1);
    result = filterPipe.filterQuestionsByAdminApprove(questionList, false);
    expect(result.length).toBe(3);

      /*check date filter*/
    interface modifyQuestion extends Omit<Question,'date'> {
      date: {
        seconds: number
      }
    }
    let modifyiedList = questionList.map(item => {
      let convert: modifyQuestion = {
        ...item,
        date: {
          seconds: new Date().getTime() / 1000
        }
      };
      return convert;
    });

    result = filterPipe.filterQuestionByDate(modifyiedList, 'day');
    expect(result.length).toBe(3);
    result = filterPipe.filterQuestionByDate(modifyiedList,'month');
    expect(result.length).toBe(3);
    result = filterPipe.filterQuestionByDate(modifyiedList,'week');
    expect(result.length).toBe(3);
    result = filterPipe.filterQuestionByDate(questionList,'');
    expect(result.length).toBe(3);

    /*filter by category*/
    result = filterPipe.filterQuestionByCategory(questionList, ['Java']);
    expect(result.length > 0).toBeTruthy();
    result = filterPipe.filterQuestionByCategory(questionList, []);
    expect(result.length).toBe(3);

    /*filter questions that have answer*/
    result = filterPipe.filterQuestionsByResolve(questionList,'false');
    expect(result.length).toBe(2);
    result = filterPipe.filterQuestionsByResolve(questionList, null);
    expect(result.length).toBe(3);

    /*check transform*/
    result = filterPipe.transform(questionList,'false',['Java'], null,true, true);
    expect(result.length > 0).toBeTruthy();
    result = filterPipe.transform([questionList[0]],'false',['Java'], null,true, true);
    expect(result[0]).toBe(-1);
  });

  it('check sort-pipe', () =>{
      let sortQuestionPipe = new SortQuestionsPipe();
      let result = [];
      let compareList = questionList.map((item, index) => {
        return  {...item, date: new Date(item.date.getTime() + (index + 1) * 24 * 3600 * 1000)}
      });
      result = sortQuestionPipe.transform(compareList,true);
      expect(result.length > 0).toBeTruthy();
  });

});
