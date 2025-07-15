import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProjectClient {
  client_code: string;
  proj_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpService {

  constructor(private http:HttpClient) { }

  apiUrl:string = "https://localhost:7038/api/"
  
  getFunctions(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl+"Employee/TimeSheet_Login");
  }

  getProjectsWithClients(): Observable<ProjectClient[]> {
    return this.http.get<ProjectClient[]>(this.apiUrl+"Employee/Get_Projects");
  }

}
