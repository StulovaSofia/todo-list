import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})

export class TokenGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  canActivate(): boolean | UrlTree {
    return this.authCheckResult();
  }

  private authCheckResult() {
    return this.authService.isLogged ? true : this.router.parseUrl('/login');
  }
}
