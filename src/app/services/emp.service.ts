import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProjectClient {
  proJ_ID: number;
  client_code: string;
  proj_name: string;
}
export interface EmployeeDetails{
  
employeeWorkDate:Date;
}

@Injectable({
  providedIn: 'root'
})
export class EmpService {

  constructor(private http: HttpClient) { }

  apiUrl: string = "https://localhost:7038/api/"

  getFunctions(): Observable<string[]> {
    // return this.http.get<string[]>(this.apiUrl+"Employee/TimeSheet_Login");
    return this.http.get<string[]>("https://localhost:7038/api/Admin/get_function");
  }

  getProjectsWithClients(): Observable<ProjectClient[]> {
    // return this.http.get<ProjectClient[]>(this.apiUrl+"Employee/Get_Projects");
    return this.http.get<ProjectClient[]>("https://localhost:7038/api/Employee/Get_Projects");
  }
  // getModules(funId: number): Observable<ProjectClient[]> {
  //   return this.http.get<ProjectClient[]>(`https://localhost:7038/api/Employee/Get-All_Modules/${funId}` );
  // }

  getModules(funId: number): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7038/api/Employee/Get-All_Modules?F_ID='+funId );
  }

   

  // GetSlot(): Observable<ProjectClient[]> {
  //   return this.http.get<ProjectClient[]>("https://localhost:7038/api/Admin/Get_All_SlotDetails");
  // }
  GetSlot(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/Get_All_SlotDetails");
  }

  SubmitTask(SubmitTask: {}) {
    // return this.http.post("https://localhost:7038/api/Employee/Insert_daily_timesheet", SubmitTask);
    return this.http.post("https://localhost:7038/api/Employee/Insert_daily_timesheet", SubmitTask);
  }
  GetEmpTasksdates(empId: number): Observable<EmployeeDetails[]> {
    return this.http.get<EmployeeDetails[]>('https://localhost:7038/api/Employee/Employee-Work-Dates?employeeId=' + empId);
  }
  GetEmpTaskDetails(empdetails: {}): Observable<ProjectClient[]> {
    return this.http.post<ProjectClient[]>("https://localhost:7038/api/Employee/GetEmployee_Work_details_by_dateAnd_Id", empdetails);
  }
  GETMINUTES(empoyeedetails: {}): Observable<ProjectClient[]> {
    return this.http.post<ProjectClient[]>("https://localhost:7038/api/Employee/GetMinutes", empoyeedetails);
  }
}
