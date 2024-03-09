import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    return this.authCheckResult();
  }

  private authCheckResult() {
    return this.authService.isLogged ? true : this.router.parseUrl('/login');
  }
}
