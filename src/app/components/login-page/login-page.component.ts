import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthFBService, AuthType} from '../../services/auth-fb.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  hide = true;
  userNickName = '';
  showRegistration = false;
  disableSubmitBtn = false;

  lSub: Subscription;
  sSub: Subscription;

  constructor(public authFb: AuthFBService, private _snackBar: MatSnackBar, public router: Router) { }

  ngOnInit(): void {
    if (this.authFb.isAuthenticated()) {
      let user =  <User>JSON.parse(this.authFb.sessionData);
      this.userNickName = user.displayName || user.email;
    }


    this.form = new FormGroup({
      email: new FormControl(null,[ Validators.email,
                                                            Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

      ]),
      password: new FormControl(null,
        [ Validators.required,
                        Validators.minLength(6),
        ])
    })
  }

  onSingUp() {
    let email = this.form.value.email;
    let password = this.form.value.password;
    this.disableSubmitBtn = true;

    this.sSub =this.authFb.signUp({email,password}).subscribe(result=> {
      let username = !result.email ? result.displayName : result.email;
      this._snackBar.open(`You are registered as ${username}`,'Success!',{duration: 5000})
      this.handleFormState();
    }, error => {
      this.disableSubmitBtn = false;
      this._snackBar.open(error.message,'Error!',{duration: 5000})
    }, () => {
      this.disableSubmitBtn = false;
    })
  }

  onLogin(type: String ) {
    let email = this.form.value.email;
    let password = this.form.value.password;
    this.disableSubmitBtn = true;

   this.lSub = this.authFb.login(<AuthType>type,{email,password}).subscribe(result => {
      this.router.navigate(['content','questions']);
      let username = !result.email ? result.displayName : result.email;
      this.userNickName = username;
      this._snackBar.open(`You are login as ${username}`,'Success!',{duration: 5000})
    }, error => {
      this.disableSubmitBtn = false;
      this._snackBar.open(error.message,'Error!',{duration: 5000})
    }, () => {
      this.disableSubmitBtn = false;
    });
  }

  @ViewChild('loginIcon',{static: false}) loginIcon: FaIconComponent;
  handleFormState() {
    this.showRegistration = !this.showRegistration;
   if (this.showRegistration) {
     this.loginIcon.rotate = 180;
   } else {
     this.loginIcon.rotate = null;
   }
    this.loginIcon.render();
  }

  ngOnDestroy(): void {
    if (this.lSub){
      this.lSub.unsubscribe();
    }

    if (this.sSub){
      this.sSub.unsubscribe();
    }
  }
}
