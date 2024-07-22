import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SideNavService } from './side-nav.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  private authStatusListnerSubs: Subscription | undefined;
  isLoggedIn = false;
  showFiller = false;

  constructor(private authService: AuthService, 
              private elementRef: ElementRef,
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
    this.closeSideNav();
  }
  
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if(this.navService.isNavOpen())
        this.closeSideNav();  
    }
  }
    
  closeSideNav() {
    this.navService.hasOpenSideNav.next(false);
    this.navService.setNavOpen(false);
  }
}