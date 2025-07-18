import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { AdminComponent } from "./admin/admin/admin.component";
import { ClientComponent } from "./admin/client/client.component";
import { EmployeeComponent } from "./admin/employee/employee.component";
import { FunctionComponent } from "./admin/function/function.component";
import { ModuleComponent } from "./admin/module/module.component";
import { ProjectComponent } from "./admin/project/project.component";
import { RoleComponent } from "./admin/role/role.component";
import { EmpDashboardComponent } from "./employee/emp-dashboard/emp-dashboard.component";
import { LoginComponent } from "./login/login/login.component";
import { RegisterComponent } from "./login/register/register.component";
import { TimeslotComponent } from "./admin/timeslot/timeslot.component";

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'empDashboard', component: EmpDashboardComponent 
        
    },
    {
        path: 'admin', component: AdminComponent,
        children: [
            { path: '', redirectTo: 'admindashboard', pathMatch: 'full' },
            { path: 'admindashboard', component: AdminDashboardComponent },
            { path: 'employee', component: EmployeeComponent },
            { path: 'project', component: ProjectComponent },
            { path: 'client', component: ClientComponent },
            { path: 'function', component: FunctionComponent },
            { path: 'module', component: ModuleComponent },
            { path: 'role', component: RoleComponent },
            { path: 'timeslot', component: TimeslotComponent }
        ]
    },
    // { path: '**', redirectTo: 'login' }
];
