import { Component, OnInit } from '@angular/core';
import { EmpService } from '../../services/emp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-timesheet',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent implements OnInit {
  employeeTimesheet: any[] = [];
  EmployeeTasks: any[] = [];

  constructor(private empService: EmpService) { }

  ngOnInit(): void {
    
    this.loadTimesheetById();
  }

  loadTimesheetById(){
    
  }

  GetEmployeeTask(E: Event) {
    const selectedDate = (E.target as HTMLInputElement).value;
    console.log(selectedDate);
    let emp_id = Number(sessionStorage.getItem('EMP_ID'));
    this.empService.GetEmpTaskDetails({ emp_ID: emp_id, emp_Work_date: selectedDate }).subscribe(response => {
      console.log(response);
      this.employeeTimesheet = response;
    }, error => {
      console.log(error);
    }
    )
  }
}
