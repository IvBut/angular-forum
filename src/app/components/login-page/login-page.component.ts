import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthFBService, AuthType} from '../../services/auth-fb.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  hide = true;
  showRegistration = false;
  disableSubmitBtn = false;

  constructor(private authFb: AuthFBService, private _snackBar: MatSnackBar, public router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null,[Validators.email, Validators.required]),
      password: new FormControl(null,[ Validators.required, Validators.minLength(6)])
    })
  }

  onSingUp() {
    let email = this.form.value.email;
    let password = this.form.value.password;
    this.disableSubmitBtn = true;

    this.authFb.signUp({email,password}).subscribe(result=> {
      console.log('SIGNUP',result);
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

    this.authFb.login(<AuthType>type,{email,password}).subscribe(result => {
      this.router.navigate(['content','posts']);
    }, error => {
      this.disableSubmitBtn = false;
      this._snackBar.open(error.message,'Error!',{duration: 5000})
    }, () => {
      console.log('aaaaa');
      this.disableSubmitBtn = false;
    });
  }

  @ViewChild('loginIcon',{static: true}) loginIcon: FaIconComponent;
  handleFormState() {
    this.showRegistration = !this.showRegistration;
   if (this.showRegistration) {
     this.loginIcon.rotate = 180;
   } else {
     this.loginIcon.rotate = null;
   }
    this.loginIcon.render();
  }
}
