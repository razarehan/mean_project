import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SideNavService } from '../side-nav/side-nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusListnerSubs: Subscription | undefined;
  isLoggedIn = false;

  showFiller = false;
  
  constructor(private authService: AuthService,
              private navService: SideNavService) { }

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

  openSideNav() {
    if(!this.navService.isNavOpen()) {
      this.navService.hasOpenSideNav.next(true);
      setTimeout(() => {
        this.navService.setNavOpen(true);
      }, 500);
    } else {
      this.navService.hasOpenSideNav.next(false);
      this.navService.setNavOpen(false);
    }

  }
}
