import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { CommonModule } from '@angular/common';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { AdminComponent } from "./admin/admin/admin.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TimesheetApp';
}
