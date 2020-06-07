import { Component, OnInit } from '@angular/core';
import {AuthFBService} from '../../../services/auth-fb.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor( public authService: AuthFBService,
               public router: Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }
}
