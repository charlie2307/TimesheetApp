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
    // return this.http.get<string[]>(this.apiUrl+"Employee/TimeSheet_Login");
     return this.http.get<string[]>("https://localhost:7038/api/Admin/get_function");
  }

  getProjectsWithClients(): Observable<ProjectClient[]> {
    // return this.http.get<ProjectClient[]>(this.apiUrl+"Employee/Get_Projects");
    return this.http.get<ProjectClient[]>("https://localhost:7038/api/Employee/Get_Projects");
  }
  getModules( functionname:string): Observable<ProjectClient[]>
  {
return this.http.get<ProjectClient[]>('https://localhost:7038/api/Employee/Get-All_Modules?functionname='+functionname);
  }

GetSlot(): Observable<ProjectClient[]>
{
return this.http.get<ProjectClient[]>("https://localhost:7038/api/Admin/Get_All_SlotDetails");
}


}
