import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let user;
    this.authService.user.pipe().subscribe((firebaseuser) => {
      user = firebaseuser;
    });
    if (user != null) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
