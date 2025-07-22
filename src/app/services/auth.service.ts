import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
export class AuthService {

  baseUrl = 'https://localhost:7038/api/auth';
  
  constructor(private http: HttpClient, private router: Router) { }

//  login(email: string, password: string): Observable<any> {
//     return this.http.post<any>('https://localhost:7252/api/Login/login', {
//       email: email,
//       password: password
//     });
//   }

  login(email: string, password: string){
    return this.http.post(`https://localhost:7038/api/Employee/TimeSheet_Login`, { email, password });
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
