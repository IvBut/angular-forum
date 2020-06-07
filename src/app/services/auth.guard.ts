import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthFBService} from './auth-fb.service';
@Injectable()
export class AuthGuard implements CanActivate{

  constructor(public authService: AuthFBService, public router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {

    if (!this.authService.isAuthenticated()){
      this.router.navigate(['login']);
    }
    return true;
  }

}
