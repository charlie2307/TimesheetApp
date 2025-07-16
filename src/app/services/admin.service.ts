import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  emP_NAME: string;
  emP_EMAIL_ID: string;
  emP_MOBILE_NO: Number;
  rolE_ID: Number;
  emP_PASSWORD: string;
  // Add other properties here
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http:HttpClient) { }

  getFunctions(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_FUNCTIONS");
  }
  
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_ROLES");
  }

  getModules(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_MODULES");
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_PROJECTS");
  }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_CLIENT");
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_EMPLOYEE");
  }

  addEmployee(empData: any): Observable<any> {
    return this.http.post("https://localhost:7038/api/Admin/INSERT-EMPLOYEE", empData);
  } 
  
  // insertEmployee(employee: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/INSERT-EMPLOYEE`, employee);
  // }

}
