import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthFBService} from '../../../services/auth-fb.service';
import {Router} from '@angular/router';
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
               public router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.configInit();
    }

    this.authSubscription = this.authService.authState$.subscribe(value => {
      if (value === 'Login') {
          this.configInit();
      }
    })
  }

  private configInit(): void{
    this.authService.checkUser().subscribe(user => {
      this.userImage = user.photoURL;
      this.userName = user.displayName
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  navigateHome() {
    this.router.navigate(['content','questions']);
  }

  handleAddQuestion() {
    this.router.navigate(['content','questions', 'create']);
  }

  navigateProfile() {
    this.router.navigate(['content','profile']);
  }
}
