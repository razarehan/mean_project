import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { SideNavService } from './side-nav/side-nav.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isSideNavVisiable = false;
  constructor(private authService: AuthService, private navService: SideNavService) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.navService.hasOpenSideNav.subscribe((data) => {      
      this.isSideNavVisiable = data;
    })
  }
}
