import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false; 
  private authStatusSub!: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (authStatus)=>{
        if(!authStatus) {
          this.isLoading = false;
        }
      }
    )
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onSignup(form: NgForm) {
    if(form.invalid)  return;
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.name, form.value.password);
  }

}
