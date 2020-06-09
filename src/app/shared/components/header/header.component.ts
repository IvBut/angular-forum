import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthFBService} from '../../../services/auth-fb.service';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationStart, Router} from '@angular/router';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string;
  userImage: string = '';
  authSubscription: Subscription;

  constructor( public authService: AuthFBService,
               public afh: AngularFireAuth,
               public router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      let user: User = <User> JSON.parse(this.authService.sessionData);
      this.userName = !user.email ? user.displayName : user.email;
      this.userImage = !user.photoURL ? `https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg` : user.photoURL;
    }

    this.authSubscription = this.authService.authState$.subscribe(value => {
      if (value === 'Login') {
        let user: User = <User> JSON.parse(this.authService.sessionData);
        this.userName = !user.email ? user.displayName : user.email;
        this.userImage = !user.photoURL ? `https://cdn3.vectorstock.com/i/1000x1000/05/37/error-message-skull-vector-3320537.jpg` : user.photoURL;
      }
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
