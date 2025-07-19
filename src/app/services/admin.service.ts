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


  getRoles(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_ROLES");
  }
  addRole(roleData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-ROLE", roleData, { responseType: 'text' as 'json' });
  }


  getModules(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_MODULES");
  }
  addModule(moduleData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-MODULES", moduleData, { responseType: 'text' as 'json' });
  }


  getProjects(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_PROJECTS");
  }
  addProject(projectData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-PROJECT", projectData, { responseType: 'text' as 'json' });
  }


  getClients(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/GET_ALL_CLIENT");
  }
  addClient(clientData: any): Observable<any> {
    return this.http.post<any>("https://localhost:7038/api/Admin/INSERT-CLIENT", clientData, { responseType: 'text' as 'json' });
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
  deleteEmployee(empId: number): Observable<any> {
    return this.http.delete(`https://localhost:7038/api/Admin/DeleteEmployee/${empId}`,{ responseType: 'text' });
  }
  


  addTimeslot(timeslotData: any = {}): Observable<any> {
    return this.http.post("https://localhost:7038/api/Admin/INSERT-TIMESLOT", timeslotData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  getAllDailyTimesheet(): Observable<any[]> {
    return this.http.get<any[]>("https://localhost:7038/api/Admin/Get_All_TimeSheet");
  }


  // insertEmployee(employee: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/INSERT-EMPLOYEE`, employee);
  // }





  // registerManager(managerData: any): Observable<any> {
  //   return this.http.post<any>(this.managerUrl + "register", managerData);
  // }

  // registerManagerByAdmin(managerData: any): Observable<any> {
  //   return this.http.post<any>(this.managerUrl + "registerByAdmin", managerData);
  // }

  // getManagers(): Observable<any[]> {
  //   return this.http.get<any[]>(this.managerUrl + "get");
  // }

  // updateManager(manager: any): Observable<any> {
  //   return this.http.put<any>(`${this.managerUrl}update/${manager.mId}`, manager);
  // }


  // getManagerById(mId: any): Observable<any> {
  //   console.log(mId);

  //   return this.http.get<any>(this.managerUrl + `getById/${mId}`);
  // }

  // deleteManager(mId: number): Observable<any> {
  //   return this.http.delete(this.managerUrl + `delete/${mId}`);
  // }


}
