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


  constructor(private http: HttpClient) { }

  getFunctions(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_FUNCTIONS");
  }
  addFunction(functionData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-FUNCTION", functionData, { responseType: 'text' as 'json' });
  }
  updateFunction(functionData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_FUNCTIONS', functionData);
  }
  deleteFunction(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteFunction/${ID}`,{ responseType: 'text' });
  }


  getRoles(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_ROLES");
  }
  addRole(roleData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-ROLE", roleData, { responseType: 'text' as 'json' });
  }
  updateRole(roleData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_ROLES', roleData);
  }
  deleteRole(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteRole/${ID}`,{ responseType: 'text' });
  }


  getModules(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_MODULES");
  }
  addModule(moduleData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-MODULES", moduleData, { responseType: 'text' as 'json' });
  }
  updateModule(moduleData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_MODULES', moduleData);
  }
  deleteModule(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteModule/${ID}`,{ responseType: 'text' });
  }


  getProjects(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_PROJECTS");
  }
  addProject(projectData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-PROJECT", projectData, { responseType: 'text' as 'json' });
  }
  updateProject(projectData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_PROJECT', projectData);
  }
  deleteProject(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteProject/${ID}`,{ responseType: 'text' });
  }


  getClients(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_CLIENT");
  }
  addClient(clientData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-CLIENT", clientData, { responseType: 'text' as 'json' });
  }
  updateClient(clientData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_CLIENT', clientData);
  }
  deleteClient(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteClient/${ID}`,{ responseType: 'text' });
  }


  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_EMPLOYEE");
  }
  addEmployee(empData: any): Observable<any> {
    return this.http.post("https://localhost:7038/api/Admin/INSERT-EMPLOYEE", empData, { responseType: 'text' as 'json' });
  }
  updateEmployee(employeeData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_EMPLOYEE', employeeData);
  }
  deleteEmployee(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteEmployee/${ID}`,{ responseType: 'text' });
  }  


  getTimeslots(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_TIMESLOT");
  }
  addTimeslot(timeslotData: any = {}): Observable<any> {
    return this.http.post("https://localhost:7038/api/Admin/INSERT-TIMESLOT", timeslotData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateTimeslot(timeslotData: any): Observable<any> {
    return this.http.put<any>('https://localhost:7038/api/Admin/UPDATE_TIMESLOT', timeslotData);
  }
  deleteTimeslot(ID: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteTimeslot/${ID}`,{ responseType: 'text' });
  }  


  getAllDailyTimesheet(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/Get_All_TimeSheet");
  }

  // insertEmployee(employee: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/INSERT-EMPLOYEE`, employee);
  // }

}
