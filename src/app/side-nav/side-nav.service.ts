import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class SideNavService {
    hasOpenSideNav = new Subject<boolean>();
    isSideNavOpen: boolean = false;

    isNavOpen() {
        return this.isSideNavOpen;
    }
    
    setNavOpen(val:boolean) {
        this.isSideNavOpen = val;
    }
}