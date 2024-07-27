import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl +  "/users";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;
  private tokenTimer!: NodeJS.Timer;
  private token:string | undefined;
  private userId:string | undefined;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  
  getUserId() {
    return this.userId;
  }
  
  getUserameById(id:string) {
    return this.http.get<{name:string}>(BACKEND_URL +'/'+ id);
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) { 
      return;
    }
    const now = new Date();
    const timeRemaining = authInformation!.expirationDate.getTime() - now.getTime();
    if (timeRemaining > 0) {
      this.token = authInformation?.token;
      this.userId!= authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(timeRemaining/1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  createUser(email: string, name: string, password: string) {
    const authData: {email: string, name: string, password: string} = {email, name, password};
    this.http.post<{ message: string, user:any }>(BACKEND_URL + '/singup', authData)
    .subscribe((result) => {
      this.router.navigate(['/']);
    }, (err) => {
      this.authStatusListener.next(false);
    })
  }

  login(email: string, password: string) {
    const authData: {email:string, password:string} = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + '/login', authData)
    .subscribe((result) => {
      this.token = result.token;
      if (result.token) {
        const expiresInDuration = result.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = result.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, (err)=> {
      this.authStatusListener.next(false);
    })
  }

  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.userId = undefined;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId:string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
