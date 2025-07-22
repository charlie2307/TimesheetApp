import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  projectClients: ProjectClient[] = [];
  modules: any[] = [];
  employeeTimesheet: any[] = [];

  SlotDetails: any[] = [];
  EmployeeTasks: any[] = [];

  minutes: number[] = [];
  time = 60;

  currentDateTime = new Date();

  isSlotSelected = false;
  isFunSelected = false;
  isProjectSelected = false;

  selectedFunctionId: number = 0;
  selectedFunc: string = '';
  moduleId: number = 0;
  proJ_ID: number = 0;

  taskApproved = false;
  condition = false;

  timesheetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empService: EmpService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadTimeslots();
    this.loadFunctions();
    this.loadProjects();
    this.GetEmpTaskData();

    this.minutes = Array.from({ length: this.time }, (_, i) => i);
    setInterval(() => this.currentDateTime = new Date(), 1000);

    this.initForm();

    this.SlotDetails = [];
    this.checkTaskApproval();
    this.resetTaskApprovalIfExpired();
  }

  initForm() {
    this.timesheetForm = this.fb.group({
      timeslot: ['', Validators.required],
      functionBtn: [''],
      projectAndClient: ['', Validators.required],
      module: ['', Validators.required],
      type: [0, Validators.required],
      minute: [''],
      description: ['']
    });
  }

  loadTimeslots() {
    this.empService.GetSlot().subscribe(data => {
      this.timeslots = data
      console.log(data)
    }
    );
  }

  loadFunctions() {
    this.empService.getFunctions().subscribe(data => this.functions = data);
  }

  loadProjects() {
    this.empService.getProjectsWithClients().subscribe(data => this.projectClients = data);
  }

  GetEmpTaskData() {
    const empId = Number(sessionStorage.getItem('EMP_ID'));
    this.empService.GetEmpTasksdates(empId).subscribe(data => this.EmployeeTasks = data);
  }

  onfunctionchange(event: Event) {

    this.isSlotSelected = true;
    this.isFunSelected = false;
    this.isProjectSelected = false;

    this.selectedFunctionId = 0;
    this.timesheetForm.reset({ timeslot: (event.target as HTMLSelectElement).value });
  }

  onselectfunction(fun: any) {
    this.selectedFunctionId = fun.fuN_ID;
    this.isFunSelected = true;
    this.isProjectSelected = false;


    this.timesheetForm.patchValue({ functionBtn: fun.fuN_NAME });

    // this.empService.getModules(fun.fuN_ID).subscribe(resp => this.modules = resp);
    this.empService.getModules(fun.fuN_ID).subscribe(
      (data) => {
        this.modules = data;
      }
    )
    this.timesheetForm.get('projectAndClient')?.reset();
    this.timesheetForm.get('module')?.reset();
    this.timesheetForm.get('minute')?.reset();
    this.timesheetForm.get('description')?.reset();
  }

  onprojectselect(event: Event) {
    this.proJ_ID = Number((event.target as HTMLSelectElement).value);
    this.isProjectSelected = true;
  }

  onselectModule(event: Event) {
    this.moduleId = Number((event.target as HTMLSelectElement).value);
  }

  onselectTimeType(event: Event) {
    const type = (event.target as HTMLInputElement).value;
    // this.condition = type === '2';
    this.timesheetForm.patchValue({ type: Number(type) });

    if (type === '2') { // Split
      this.condition = true;

      this.timesheetForm.get('minute')?.setValidators(Validators.required);
      this.timesheetForm.get('minute')?.updateValueAndValidity();

      this.timesheetForm.patchValue({ type: 2 });
      console.log("Type:"+this.timesheetForm.get('type')?.value);

    } else if (type === '1') { // Full
      this.condition = false;

      this.timesheetForm.get('minute')?.clearValidators();
      this.timesheetForm.get('minute')?.setValue(null); // optional: reset
      this.timesheetForm.get('minute')?.updateValueAndValidity();

      this.timesheetForm.patchValue({ type: 1 });
      console.log(this.timesheetForm.get('type')?.value);
    }
  }

  onSubmit() {
    if (this.taskApproved) {
      alert("Task already approved for today.");
      return;
    }

    if (this.timesheetForm.invalid) {
      this.timesheetForm.markAllAsTouched();
      return;
    }

    this.isFunSelected = false;
    const payload = {
      emP_ID: Number(sessionStorage.getItem('EMP_ID')),
      sloT_ID: Number(this.timesheetForm.get('timeslot')?.value),
      fuN_ID: this.selectedFunctionId,
      proJ_ID: this.proJ_ID,
      moD_ID: this.moduleId,
      hours: this.timesheetForm.get('type')?.value,
      timE_FROM: '00',
      timE_TO: '60',
      timesheeT_DESC: this.timesheetForm.get('description')?.value,
      createD_BY: sessionStorage.getItem('EMP_NAME')
    };

    console.log(payload);
    this.empService.SubmitTask(payload).subscribe(
      () => {
        alert("Task submitted successfully.");
        this.isProjectSelected = false;  // go back to function step
        this.timesheetForm.patchValue({
          projectAndClient: '',
          module: '',
          type: 0,
          minute: '',
          description: ''
        });
      },
      error => console.error(error)
    );
  }

  onApproveClick() {
    const now = new Date();
    if (now.getHours() >= 10) {
      const today = now.toISOString().split('T')[0];
      localStorage.setItem('taskApproved', 'true');
      localStorage.setItem('taskApprovalDate', today);
      this.checkTaskApproval();
      alert("Task approved for today.");
    } else {
      alert("You can approve task only after 10AM.");
    }
  }

  checkTaskApproval() {
    const today = new Date().toISOString().split('T')[0];
    const approved = localStorage.getItem('taskApproved');
    const approvalDate = localStorage.getItem('taskApprovalDate');
    this.taskApproved = approved === 'true' && approvalDate === today;
  }

  resetTaskApprovalIfExpired() {
    const { tomorrow10AM } = this.getTodayAndTomorrow10AM();
    const now = new Date();
    if (now >= tomorrow10AM) {
      localStorage.removeItem('taskApproved');
      localStorage.removeItem('taskApprovalDate');
      this.taskApproved = false;
    }
  }

  getTodayAndTomorrow10AM() {
    const today10AM = new Date();
    today10AM.setHours(10, 0, 0, 0);

    const tomorrow10AM = new Date(today10AM);
    tomorrow10AM.setDate(today10AM.getDate() + 1);

    return { today10AM, tomorrow10AM };
  }

  GetEmployeeTask(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    const empId = Number(sessionStorage.getItem('EMP_ID'));
    this.empService.GetEmpTaskDetails({ emp_ID: empId, emp_Work_date: selectedDate }).subscribe(
      data => this.employeeTimesheet = data
    );
  }
}
