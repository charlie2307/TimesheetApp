import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpService, ProjectClient } from '../../services/emp.service';

@Component({
  selector: 'app-emp-dashboard',
  imports: [NavbarComponent, RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css'
})
export class EmpDashboardComponent implements OnInit {
  currentDateTime!: Date;
  today = new Date();
  minutes: number[] = [];
  selectedMinute: number | null = null;
  timesheetForm!: FormGroup;
  isActiveBtn: boolean = false;
  selectedFunc: string = '';
  functions: any[] = [];
  projectClients: ProjectClient[] = [];

  employeeTimesheet = [
    { timeslot: '10AM-11AM', function: 'Button1', projectAndClient: 'ProjectList1', module: 'Module1', minute: 15 },
    { timeslot: '10AM-11AM', function: 'Button2', projectAndClient: 'ProjectList2', module: 'Module2', minute: 20 },
    { timeslot: '11AM-12AM', function: 'Button3', projectAndClient: 'ProjectList3', module: 'Module3', minute: 30 },
    { timeslot: '11AM-12AM', function: 'Button4', projectAndClient: 'ProjectList1', module: 'Module2', minute: 10 },
    { timeslot: '12AM-1PM', function: 'Button1', projectAndClient: 'ProjectList3', module: 'Module1', minute: 25 }
  ];

  groupedTimesheet: { timeslot: string, entries: any[] }[] = [];

  constructor(private fb: FormBuilder, private empService: EmpService) {
    const map = new Map<string, any[]>();
    this.employeeTimesheet.forEach(entry => {
      if (!map.has(entry.timeslot)) {
        map.set(entry.timeslot, []);
      }
      map.get(entry.timeslot)?.push(entry);
    });

    this.groupedTimesheet = Array.from(map.entries()).map(([timeslot, entries]) => ({
      timeslot,
      entries
    }));
  }

  ngOnInit() {
    this.currentDateTime = new Date();
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    this.minutes = Array.from({ length: 60 }, (_, i) => i);

    this.timesheetForm = this.fb.group({
      type: ['', Validators.required],
      minute: [{ value: '', disabled: true }, Validators.required],
      projectAndClient: ['', Validators.required]
    });

    //time visibility
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
      type: [''],
      minute: [''],
      functionBtn: this.selectedFunc
    });

    this.loadFunctions();
    this.loadProjects();
  }

  loadFunctions() {
    this.empService.getFunctions().subscribe(
      (data) => {
        this.functions = data;
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
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

  onButtonClick(button: string) {
    this.timesheetForm.patchValue({ functionBtn: button });
    this.selectedFunc = button;
  }

  onSubmit() {
    console.log(this.timesheetForm.value);
  }
}
