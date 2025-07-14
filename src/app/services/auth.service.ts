import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

 login(email: string, password: string): Observable<any> {
    return this.http.post<any>('https://localhost:7252/api/Login/login', {
      email: email,
      password: password
    });
  }
}
