import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http:HttpClient) { }

  getFunctions(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_FUNCTIONS");
  }
  // getFunctions(): Observable<Function[]> {
  //   return this.http.get<Function[]>("https://localhost:7038/api/Admin/GET_ALL_FUNCTIONS");
  // }
  
  getRoles(): Observable<Function[]> {
    return this.http.get<Function[]>("https://localhost:7038/api/Admin/GET_ALL_ROLES");
  }
}
