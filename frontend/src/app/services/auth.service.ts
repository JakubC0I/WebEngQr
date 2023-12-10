import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  canActivate(): Observable<boolean> {
    return this.http.get<boolean>('/user/verify', {})
  }
}
