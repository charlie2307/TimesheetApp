import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from '../../admin/admin/admin.component';
import { AdminService } from '../../services/admin.service';
import { EmpService } from '../../services/emp.service';

export interface Timeslot {
  timeslot: string;
  sloT_ID: number;
}
export interface ProjectClient {
  proJ_ID: number;
  client_code: string;
  proj_name: string;
}

@Component({
  selector: 'app-dashboad',
  imports: [CommonModule, NavbarComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './dashboad.component.html',
  styleUrl: './dashboad.component.css'
})
export class DashboadComponent implements OnInit {
  timeslots: any[] = [];
  functions: any[] = [];
  projects: any[] = [];
  projectClients: ProjectClient[] = [];
  moduleId: number = 0;
  taskApproved: boolean = false;
  condition: boolean = false;
  currentDateTime!: Date;
  today = new Date();
  modules: any[] = [{}];
  time: number = 60;
  minutes: number[] = [];
  selectedMinute: number | null = null;
  timesheetForm!: FormGroup;
  isActiveBtn: boolean = false;
  selectedFunc: string = '';
  functiondetails: string = ''
  timesheet!: FormGroup;
  slot_id: number = 0;
  proJ_ID: number = 0;
  TimeFrom: string = '';
  TimeTO: string = '';
  EmployeeTasks: any[] = [];

  SlotDetails: any[] = [];

  constructor(private fb: FormBuilder, private empService: EmpService, private router: Router) {
    console.log(sessionStorage.getItem('EMP_ROLE'));
  }

  ngOnInit(): void {
    this.checkTaskApproval();
    this.resetTaskApprovalIfExpired();
    this.GetEmpTaskData();
    const timeChange =
      this.currentDateTime = new Date();
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    this.minutes = Array.from({ length: this.time }, (_, i) => i);

    this.timesheetForm = this.fb.group({
      type: ['', Validators.required],
      minute: [{ value: '', disabled: true }, Validators.required],
      projectAndClient: ['', Validators.required]
    });


    this.timesheetForm.get('type')?.valueChanges.subscribe(value => {
      const minuteControl = this.timesheetForm.get('minute');
      if (value === 'Full') {
        minuteControl?.disable();
        minuteControl?.reset(); // optionally clear value
      } else if (value === 'Split') {
        minuteControl?.enable();
      }
    });




    this.timesheetForm = this.fb.group({

      timeslot: [''],
      projectAndClient: [''],
      module: [''],
      type: 0,
      minute: [''],
      functionBtn: this.selectedFunc,
      description: ['']
    });

    this.timesheet = this.fb.group({
      emP_ID: Number(sessionStorage.getItem('EMP_ID')),
      sloT_ID: 0,
      hourse: this.timesheetForm.get('type')?.value,
      proJ_ID: 0,
      fuN_ID: this.functiondetails,
      moD_ID: 0,
      timE_FROM: this.TimeFrom,
      timE_TO: this.TimeTO,
      timesheeT_DESC: this.timesheetForm.get('description')?.value,
      createD_BY: sessionStorage.getItem('EMP_NAME')
    })



    this.loadFunctions();
    this.loadProjects();
    this.empService.GetSlot().subscribe(response => {

      this.SlotDetails = response;
      console.log(this.SlotDetails);
    }, error => {
      console.log(error);
    }
    );
    this.checkTaskApproval();


    this.taskApproved = Boolean(localStorage.getItem('taskApproved'));

  }

  loadTimeslot() {
    this.adminService.getTimeslots().subscribe(
      (data) => {
        this.timeslots = data;
        console.log(data);
      }, (error) => {
        console.error(error);
      })
  }

  loadFunctions() {
    this.adminService.getFunctions().subscribe(
      (data) => {
        this.functions = data;
        console.log(data);
      }, (error) => {
        console.error(error);
      }
    )
  }

  loadProjects() {
    this.empService.getProjectsWithClients().subscribe(
      (data) => {
        this.projectClients = data;
        console.log(data);
      },
      (error) => {
        console.error(error)
      });
  }
  onprojectselect(E: Event) {
    this.proJ_ID = Number((E.target as HTMLInputElement).value);
    this.timesheet.patchValue({
      proJ_ID: this.proJ_ID

    })
    console.log(this.proJ_ID);
  }

  selectFunc(fuN_ID: number) {
    console.log(fuN_ID);
  }

}
