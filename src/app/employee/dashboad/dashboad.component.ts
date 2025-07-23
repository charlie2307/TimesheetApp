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
  employeeTimesheet: any[] = [];
  SlotDetails: any[] = [];
  EmployeeTasks: any[] = [];
  isSlotSelected = false;
  isFunSelected = false;
  isProjectSelected = false;
  selectedFunctionId: number = 0;
  selectedFunc: string = '';
  moduleId: number = 0;
  proJ_ID: number = 0;
  timesheetForm!: FormGroup;
  taskApproved: boolean = false;
  condition: boolean = false;
  currentDateTime!: Date;
  today = new Date();
  newDateTime = new Date();
  modules: any[] = [{}];
  time: number = 60;
  minutes: any[] = [];
  selectedMinute: number | null = null;
  isActiveBtn: boolean = false;
  functiondetails: string = ''
  timesheet!: FormGroup;
  slot_id: number = 0;
  TimeFrom: string = '';
  TimeTO: string = '';
  timefrom = 0;
  timeto = 0;

  groupedTimesheet: { timeslot: string, entries: any[] }[] = [];

  constructor(
    private fb: FormBuilder,
    private empService: EmpService,
    private router: Router
  ) {
    const map = new Map<string, any[]>();

    console.log(sessionStorage.getItem('EMP_ROLE'));
    // this.employeeTimesheet.forEach(entry => {
    //   if (!map.has(entry.timeslot)) {
    //     map.set(entry.timeslot, []);
    //   }
    //   map.get(entry.timeslot)?.push(entry);
    // });

    this.groupedTimesheet = Array.from(map.entries()).map(([timeslot, entries]) => ({
      timeslot,
      entries
    }));
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

    const storedData = sessionStorage.getItem('employeefun');
    if (storedData) {
      this.functions = JSON.parse(storedData);
      console.log('Function list from sessionStorage:', this.functions);
    }
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
      hours: this.timesheetForm.get('type')?.value,
      proJ_ID: 0,
      fuN_ID: this.functiondetails,
      moD_ID: 0,
      timE_FROM: this.TimeFrom,
      timE_TO: this.TimeTO,
      timesheeT_DESC: this.timesheetForm.get('description')?.value,
      createD_BY: sessionStorage.getItem('EMP_NAME')
    })

    this.taskApproved = Boolean(localStorage.getItem('taskApproved'));

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

  GetEmpTaskData() {
    const empId = Number(sessionStorage.getItem('EMP_ID'));
    this.empService.GetEmpTasksdates(empId).subscribe(data => {
      this.EmployeeTasks = data;
      console.log(this.EmployeeTasks);
    }, (error) => {
      console.error(error);
    });
  }

  onfunctionchange(event: Event) {
    this.slot_id = Number((event.target as HTMLInputElement).value);
    this.getslotminutes();
    const minval = Math.min(...this.minutes.map(emp => emp.min));
    if (minval > 0) {
      alert("You already Used Some minutes From This Slot So you not used The Full Time Type for this slot.");
    }

    this.isSlotSelected = true;
    this.isFunSelected = false;
    this.isProjectSelected = false;

    this.selectedFunctionId = 0;
    // this.timesheetForm.reset({ timeslot: (event.target as HTMLSelectElement).value });
  }

  onselectfunction(fun: any) {
    this.selectedFunctionId = fun.fuN_ID;
    this.isFunSelected = true;
    this.isProjectSelected = false;

    this.timesheetForm.patchValue({ functionBtn: fun.fuN_NAME });

    this.empService.getModules(fun.fuN_ID).subscribe(
      (data) => {
        this.modules = data;
      },
      error => {
        console.log(error);
      });

    this.timesheetForm.get('projectAndClient')?.reset();
    this.timesheetForm.get('module')?.reset();
    this.timesheetForm.get('minute')?.reset();
    this.timesheetForm.get('description')?.reset();
  }

  onprojectselect(event: Event) {
    this.proJ_ID = Number((event.target as HTMLSelectElement).value);
    this.timesheet.patchValue({
      proJ_ID: this.proJ_ID
    })
    console.log("Proj_ID=" + this.proJ_ID);
    this.isProjectSelected = true;
    if (this.modules.length === 0) {
      this.timesheetForm.get('module')?.setValidators(Validators.required);
      this.timesheetForm.get('module')?.updateValueAndValidity();
      this.timesheetForm.get('module')?.disable();
    }
  }

  onselectModule(e: Event) {
    this.timesheet.patchValue({
      moD_ID: Number((e.target as HTMLInputElement).value)
    })
    this.moduleId = Number((e.target as HTMLInputElement).value);
    console.log(this.moduleId);
  }

  onselectTimeType(event: Event) {
    const type = (event.target as HTMLInputElement).value;
    // this.condition = type === '2';
    this.timesheetForm.patchValue({ type: Number(type) });

    if (type === '2') { // Split
      this.condition = true;
      this.getslotminutes();
      this.timesheetForm.get('minute')?.setValidators(Validators.required);
      this.timesheetForm.get('minute')?.updateValueAndValidity();

      this.timesheetForm.patchValue({ type: 2 });
      console.log("Type:" + this.timesheetForm.get('type')?.value);

    } else if (type === '1') { // Full
      this.condition = false;

      this.timesheetForm.get('minute')?.clearValidators();
      this.timesheetForm.get('minute')?.setValue(null); // optional: reset
      this.timesheetForm.get('minute')?.updateValueAndValidity();

      const minval = Math.min(...this.minutes.map(emp => emp.min));
      if (minval > 0) {
        alert("You already Used Some minutes From This Slot So you not used The Full Time Type for this slot.");
      }

      this.timesheetForm.patchValue({ type: 1 });
      console.log(this.timesheetForm.get('type')?.value);
    }
  }

  onSubmit() {
    const taskApproved = Boolean(localStorage.getItem('taskApproved'));
    const description = this.timesheetForm.get('description')?.value;
    console.log("Description:", description);

    let from = this.timefrom.toString();
    let to = this.timeto.toString();
    let selectedMinute = Number(this.timesheetForm.get('minute')?.value);

    this.timefrom = this.timeto;
    this.timeto = this.timefrom + selectedMinute;

    this.TimeFrom = from;
    this.TimeTO = to;
    this.timesheet.patchValue({

      timesheeT_DESC: this.timesheetForm.get('description')?.value,
      sloT_ID: this.slot_id
    });


    this.time = this.time - selectedMinute;
    this.minutes = Array.from({ length: this.time }, (_, i) => i);
    this.timesheet.patchValue({
      hours: Number(this.timesheetForm.get('type')?.value)

    })
    if (this.timesheet.get('hours')?.value == 1) {
      if (this.timefrom == 0) {
        this.timesheet.patchValue({
          timE_TO: '60',
          timE_FROM: '00'
        })
      }
      else {
        alert("You Can't Used Full Hours.you already Used Some Minutes.\n Used Slit mode To Select minutes.");
      }

    }
    else {
      this.timesheet.patchValue({
        timE_TO: this.timeto.toString(),
        timE_FROM: this.timefrom.toString()

      })
    }

    console.log(this.timesheet.value);
    console.log("---------------------------");
    if (!taskApproved) {
      this.empService.SubmitTask(this.timesheet.value).subscribe(response => {
        console.log(response);
        this.getslotminutes();
      },
        error => {
          console.log(error);
        });
    }
    else {
      alert("You have already approved todays task.!\n Come Tomorrow For Add The Tomorrow Tasks.")
    }

    // if (this.taskApproved) {
    //   alert("Task already approved for today.");
    //   return;
    // }

    // if (this.timesheetForm.invalid) {
    //   this.timesheetForm.markAllAsTouched();
    //   return;
    // }

    this.isFunSelected = false;
    
  }

  getslotminutes() {
    const now = new Date();

    const today10AM = new Date();
    today10AM.setHours(10, 0, 0, 0);

    const tomorrow10AM = new Date(today10AM);
    tomorrow10AM.setDate(today10AM.getDate() + 1);

    console.log("Today 10AM:", today10AM);
    console.log("Tomorrow 10AM:", tomorrow10AM);
    today10AM.toISOString().split('T')[0];

    this.empService.GETMINUTES({ slotDate: today10AM, emP_ID: Number(sessionStorage.getItem('EMP_ID')), sloT_ID: this.slot_id }).subscribe(response => {
      this.minutes = response;
      console.log(response)
    }, error => {
      console.log(error);
    }
    )
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
    if (approved && approved === 'true' && approvalDate === today) {
      this.taskApproved = true;
    } else {
      this.taskApproved = false;
    }
  }

  resetTaskApprovalIfExpired() {
    const { today10AM } = this.getTodayAndTomorrow10AM();
    const now = new Date();
    const taskApproved = Boolean(localStorage.getItem('taskApproved'));
    console.log("type of true false:" + taskApproved);
    if (taskApproved === true && now >= today10AM) {
      console.log("Task approval expired. Resetting...");
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

    console.log("Today 10AM:", today10AM);
    console.log("Tomorrow 10AM:", tomorrow10AM);

    return { today10AM, tomorrow10AM };
  }

  GetEmployeeTask(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    console.log("Selected Date: "+selectedDate);
    let emp_id = Number(sessionStorage.getItem('EMP_ID'));
    this.empService.GetEmpTaskDetails({ emp_ID: emp_id, emp_Work_date: selectedDate }).subscribe(response => {
      console.log(response);
      this.employeeTimesheet = response;
    }, error => {
      console.log(error);
    });
  }

}
