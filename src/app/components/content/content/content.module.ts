import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostPageComponent } from './post-page/post-page.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';



@NgModule({
  declarations: [PostPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', redirectTo: '/content/posts', pathMatch: 'full'},
      {path: 'posts', component: PostPageComponent}
    ])
  ],
  providers: []
})
export class ContentModule { }
