import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import { Success } from "../shared/model/success.model";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginSuccess = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
    // Check if the user is logged in when the service initializes
    const loggedIn = localStorage.getItem('loggedIn');
    this.loginSuccess.next(loggedIn === 'true');
  }

  canActivate(): Observable<boolean> {
    return this.http.get<boolean>('/user/verify', {});
  }

  login(username: string, password: string): boolean {
    return this.http.post<Success>(`/user/login`, {username, password}, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe((result: Success) => {
      console.log(result.message)
      if (result.ok) {
        this.loginSuccess.next(true);
        localStorage.setItem('loggedIn', 'true'); // Store the logged-in state
        this.router.navigate(['/ticket']);
        return true;
      }
      return false;
    }).closed;
  }

  logout() {
    this.loginSuccess.next(false);
    localStorage.setItem('loggedIn', 'false'); // Clear the logged-in state
    this.router.navigate(['/']);
    return this.http.post<Success>('/user/logout', {});
  }
}
