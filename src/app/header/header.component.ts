import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusListnerSubs: Subscription | undefined;
  isLoggedIn = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsAuth();
    this.authStatusListnerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      })
  }

  ngOnDestroy(): void {
    this.authStatusListnerSubs?.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
