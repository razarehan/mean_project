import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  private isAuthenticate: boolean = false; 
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    this.isAuthenticate = this.authService.getIsAuth();
    if (!this.isAuthenticate) {
      this.router.navigate(['/login']);
    }
    return this.isAuthenticate;
  }

}