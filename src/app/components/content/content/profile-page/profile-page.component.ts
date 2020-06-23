import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthFBService} from '../../../../services/auth-fb.service';
import {Observable} from 'rxjs';
import {mUser, UserMessage} from '../../../../interfaces';
import {tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpinnerService} from '../../../../services/spinner.service';
import {UserInfoService} from '../services/user-info.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  form: FormGroup;
  user$: Observable<mUser>;
  showUserMsg: UserMessage;

  userList: Array<mUser> = [];
  filteredList: Array<mUser> = [];

  selectedUser: mUser;
  showRole = false;

  constructor(public authService: AuthFBService,
              private _snackBar: MatSnackBar,
              public spinnerService: SpinnerService,
              public userInfoService: UserInfoService
  ) {
    this.showUserMsg = new UserMessage(this._snackBar);
  }

  ngOnInit(): void {
    this.userInfoService.getAllUsers().subscribe(result => {
      this.userList = [...result];
      this.filteredList = [...this.userList];
    });


    this.user$ = this.authService.checkUser().pipe(
      tap(result => this.initForm(result))
    );
  }

  private initForm(u: mUser) {
    this.form = new FormGroup({
      nickName: new FormControl(u.displayName, [Validators.required]),
      photoUrl: new FormControl(u.photoURL, [Validators.required, Validators.pattern('https?://.+')]),
      userPassword: new FormControl(null, [Validators.minLength(6)])
    });
  }

  async updateCurrentUser(user: mUser) {
    if (this.form.invalid) {
      return;
    }
    let password = this.form.value.userPassword;
    let updatedUserValues: mUser = {
      uid: user.uid,
      roles: user.roles,
      photoURL: this.form.value.photoUrl,
      displayName: this.form.value.nickName,
      email: user.email,
      emailVerified: user.emailVerified
    };

    try {
      this.spinnerService.showSpinner();
      let res = await (!password ? this.userInfoService.updateUserProfileInfo(updatedUserValues) : this.userInfoService.updateUserProfileInfo(updatedUserValues, password));
      this.showUserMsg.showMsg(`User: ${res.displayName} / ${res.email} info was updated!`);
    } catch (e) {
      this.showUserMsg.showMsg(`Error: ${e.message}`, 'Error');
    } finally {
      this.spinnerService.hideSpinner();
    }

  }

  async updateUserRole() {
    if (!this.selectedUser) {
      return;
    }
    try {
      this.spinnerService.showSpinner();
      let res = await this.userInfoService.updateUserProfileInfo(this.selectedUser);
      this.showUserMsg.showMsg(`User: ${res.displayName} / ${res.email} ROLES was updated!`);
    } catch (e) {
      this.showUserMsg.showMsg(`Error: ${e.message}`, 'Error');
    } finally {
      this.spinnerService.hideSpinner();
    }
  }

  filterUsers(search: string) {
    this.showRole = false;
    const filterValue = search.trim().toLowerCase();
    this.filteredList = this.userList.filter(el => {
      let emailRes = false;
      let dispNameRes = false;
      if (el.email) {
        emailRes = el.email.toLowerCase().trim().includes(filterValue);
      }
      if (el.displayName) {
        dispNameRes = el.displayName.toLowerCase().trim().includes(filterValue);
      }
      return emailRes || dispNameRes;
    });
  }


  displayRoles(event: MatAutocompleteSelectedEvent) {
    this.selectedUser = this.userList.find(el => el.uid === event.option.id);
    this.showRole = true;
  }
}
