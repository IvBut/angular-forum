import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {HeaderComponent} from './shared/components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginPageComponent } from './components/login-page/login-page.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AuthGuard} from './services/auth.guard';
import {SpinnerService} from './services/spinner.service';
import {AddCommentDialogComponent} from './shared/components/add-comment-dialog/add-comment-dialog.component';
import {EditQuestionDialogComponent} from './shared/components/edit-question-dialog/edit-question-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HeaderComponent,
    LoginPageComponent,
    AddCommentDialogComponent,
    EditQuestionDialogComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FontAwesomeModule
  ],
  providers: [AuthGuard, SpinnerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
