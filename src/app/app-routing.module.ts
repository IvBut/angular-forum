import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {AuthGuard} from './services/auth.guard';
import {NotFoundComponent} from './components/not-found/not-found.component';



const routes: Routes = [

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {
    path: 'content', loadChildren: () => import('./components/content/content/content.module').then(m => m.ContentModule) , canActivate: [AuthGuard]
  },
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
