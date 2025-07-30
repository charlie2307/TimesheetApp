import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, NavbarComponent, RouterModule, ReactiveFormsModule, FormsModule],
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
    today!:Date;
  newDateTime = new Date();
  modules: any[] = [{}];
  time: number = 0;
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

  selectedDate: string = '';
  maxSlotTime: number = 0;

  today10am!: Date;
  tommarow10am!: Date;

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
    // this.loadFunctions();
    this.loadProjects();
    this.GetEmpTaskData();
    this.timesheetDate();
    this.getTodayAndTomorrow10AM();

    this.today = new Date();
    this.selectedDate = this.today.toISOString().split('T')[0]; // Format YYYY-MM-DD

    this.employeeTimesheet.sort((a, b) => a.taskTimeSlot.localeCompare(b.taskTimeSlot));

    setInterval(() => this.currentDateTime = new Date(), 1000);

    this.initForm();

    this.SlotDetails = [];
    this.checkTaskApproval();
    this.resetTaskApprovalIfExpired();

    // const storedData = sessionStorage.getItem('employeefun');
    // if (storedData) {
    //   this.functions = JSON.parse(storedData);
    //   console.log('Function list from sessionStorage:', this.functions);
    // }
    const timeChange =
      this.currentDateTime = new Date();
    // setInterval(() => {
    //   this.currentDateTime = new Date();
    // }, 1000);

    this.timesheetForm = this.fb.group({
      timeslot: [''],
      type: ['', Validators.required],
      minute: [{ value: '', disabled: true }, Validators.required],
      projectAndClient: ['', Validators.required],
      functionBtn: this.selectedFunc,
      module: ['', Validators.required],
      description: [''],
      workDate: ['']
    });

    // this.timesheetForm = this.fb.group({
    //   timeslot: [''],
    //   projectAndClient: [''],
    //   module: [''],
    //   type: 0,
    //   minute: [''],
    //   functionBtn: this.selectedFunc,
    //   description: ['']
    // });

    this.timesheetForm.get('type')?.valueChanges.subscribe(value => {
      const minuteControl = this.timesheetForm.get('minute');
      if (value === 'Full') {
        minuteControl?.disable();
        minuteControl?.reset(); // optionally clear value
      } else if (value === 'Split') {
        minuteControl?.enable();
      }
    });

    this.timesheet = this.fb.group({
      emP_ID: Number(sessionStorage.getItem('EMP_ID')),
      sloT_ID: 0,
      hours: 0,
      proJ_ID: 0,
      fuN_ID: 0,
      moD_ID: 0,
      timE_FROM: '',
      timE_TO: '',
      timesheeT_DESC: '',
      createD_BY: '',
    })

    this.taskApproved = Boolean(localStorage.getItem('taskApproved'));

  }


  timesheetDate() {
    const now = new Date();

    // Create 10:00 AM today
    const today10AM = new Date();
    today10AM.setHours(10, 0, 0, 0);

    // Create 10:00 AM tomorrow
    const tomorrow10AM = new Date(today10AM);
    tomorrow10AM.setDate(today10AM.getDate() + 1);



    // Check if now is between 10AM today and 10AM tomorrow
    if (now >= today10AM && now < tomorrow10AM) {
      // Store today's date in yyyy-MM-dd format
      this.selectedDate = today10AM.toISOString().split('T')[0];
      console.log('Selected Date:', this.selectedDate);
    } else {
      console.log('Current time is not in the range.');
    }

  }

  maxMinInSlot() {
    const selectedDate = this.selectedDate;
    const emp_ID = Number(sessionStorage.getItem('EMP_ID'));
    const slot_ID = this.timesheetForm.get('timeslot')?.value;
    const requestData = {
      slotDate: selectedDate,
      emP_ID: emp_ID,
      sloT_ID: slot_ID
    }
    // this.empService.GETMINUTES(requestData).subscribe({
    //   next: (res) => {

    //     this.maxSlotTime = Number(res);
    //     console.log('Max Time:', this.maxSlotTime);
    //     return res;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching max time:', err);
    //   }
    // });
  }

  initForm() {
    this.timesheetForm = this.fb.group({
      timeslot: ['', Validators.required],
      functionBtn: [0],
      projectAndClient: ['', Validators.required],
      module: ['', Validators.required],
      type: [0, Validators.required],
      minute: [''],
      description: [''],
      workDate:['']
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
    const storedData = sessionStorage.getItem('employeefun');
    if (storedData) {
      this.functions = JSON.parse(storedData);
      console.log('Function list from sessionStorage:', this.functions);
    }

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

  ontimeslotchange(event: Event) {
    var maxTime = 0;
    this.slot_id = Number((event.target as HTMLInputElement).value);
    const selectedDate = this.selectedDate;
    const emp_ID = Number(sessionStorage.getItem('EMP_ID'));
    const slot_ID = this.slot_id;
    const requestData = {
      slotDate: selectedDate,
      emP_ID: emp_ID,
      sloT_ID: slot_ID
    }
    console.log(requestData);
    if (this.taskApproved != true) {
      this.empService.GETMINUTES(requestData).subscribe({
        next: (res) => {
          maxTime = Number(res);
          console.log('res:', res);
          console.log('Max Time:', maxTime);

          if (maxTime < 60) {
            this.loadFunctions();
            this.maxSlotTime = maxTime;
            console.log("mxSlot:" + this.maxSlotTime)
            this.isSlotSelected = true;
            this.isFunSelected = false;
            this.isProjectSelected = false;

            this.selectedFunctionId = 0;
            this.timesheetForm.reset({ timeslot: (event.target as HTMLSelectElement).value });
          }
          else {
            alert("This slot is full.");

            this.isSlotSelected = false;
            this.isFunSelected = false;
            this.isProjectSelected = false;

            this.selectedFunctionId = 0;
            this.timesheetForm.reset({ timeslot: (event.target as HTMLSelectElement).value });
          }

        },

        error: (err) => {
          console.error('Error fetching max time:', err);
        }
      });
    }
    else {
      alert("Todays tasks are approved. Come tommarow at 10 am.")
    }

  }

  onselectfunction(fun: any) {

    this.selectedFunctionId = fun.fuN_ID;
    this.isFunSelected = true;
    this.isProjectSelected = false;
    console.log("selectedFunctionId" + this.selectedFunctionId)

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

    if (this.modules.length === 0) {
      this.timesheetForm.get('module')?.clearValidators();
    }
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

    // if (this.maxSlotTime === 0) {
    //   this.condition = true;
    // }

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
    this.timesheetForm.patchValue({ type: (type) });

    if (type === '2') { // Split
      this.condition = true;
      // this.getslotminutes();
      this.time = 60 - this.maxSlotTime;
      console.log("time: " + this.time);
      this.minutes = Array.from({ length: this.time }, (_, i) => i);

      this.timesheetForm.get('minute')?.setValidators(Validators.required);
      this.timesheetForm.get('minute')?.updateValueAndValidity();

      this.timesheetForm.patchValue({ type: 2 });
      console.log("Type:" + this.timesheetForm.get('type')?.value);

    } else if (type === '1') { // Full
      this.condition = false;
      if (this.maxSlotTime === 0) {
        this.TimeFrom = '00';
        this.TimeTO = '60'
        this.timesheetForm.patchValue({ type: 1 });
        console.log("Type:" + this.timesheetForm.get('type')?.value);
      }
      else {
        this.timesheetForm.invalid;
        alert("You already Used Some minutes From This Slot So you not used The Full Time Type for this slot.");
      }

      this.timesheetForm.get('minute')?.clearValidators();
      this.timesheetForm.get('minute')?.setValue(null); // optional: reset
      this.timesheetForm.get('minute')?.updateValueAndValidity();

      // const minval = Math.min(...this.minutes.map(emp => emp.min));
      // if (minval > 0) {
      //   alert("You already Used Some minutes From This Slot So you not used The Full Time Type for this slot.");
      // }

      this.timesheetForm.patchValue({ type: 1 });
      console.log(this.timesheetForm.get('type')?.value);
    }
  }

  onSubmit() {

    const taskApproved = Boolean(localStorage.getItem('taskApproved'));

    if (this.timesheetForm.get('type')?.value == '2') {
      let selectedMinute = Number(this.timesheetForm.get('minute')?.value);

      this.TimeFrom = this.maxSlotTime.toString();
      this.TimeTO = (this.maxSlotTime + selectedMinute).toString();
      console.log("SelectMin=" + this.selectedMinute);
      console.log("TimeFrom=" + this.TimeFrom);
      console.log("TimeTo=" + this.TimeTO);
    }

    this.timesheet.patchValue({
      sloT_ID: this.slot_id,
      hours: this.timesheetForm.get('type')?.value,
      proJ_ID: this.proJ_ID,
      fuN_ID: this.selectedFunctionId,
      moD_ID: this.moduleId,
      timE_TO: this.TimeTO,
      timE_FROM: this.TimeFrom,
      timesheeT_DESC: this.timesheetForm.get('description')?.value,
      createD_BY: sessionStorage.getItem('EMP_NAME')
    });

    // if (this.timesheet.get('hours')?.value == 1) { //full
    //   if (this.maxSlotTime == 0) {
    //     this.timesheet.patchValue({
    //       timE_TO: '60',
    //       timE_FROM: '00'
    //     })
    //   }
    //   else {
    //     alert("You Can't Used Full Hours.you already Used Some Minutes.\n Used Slit mode To Select minutes.");
    //   }

    // }
    // else {
    //   this.timesheet.patchValue({
    //     timE_TO: this.TimeTO,
    //     timE_FROM: this.TimeFrom,

    //   })
    // }
    const FullTimesheet = this.timesheet.value;

    if (!taskApproved) {
      console.log(this.timesheet.value);
      this.empService.SubmitTask(FullTimesheet).subscribe(response => {
        console.log(this.timesheet.value);
        alert("Task Added SuccessFully.");
      },
        error => {
          console.error(error);
        });
    }
    else {
      alert("You have already approved todays task.!\n Come Tomorrow For Add The Tomorrow Tasks.");
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
    this.maxSlotTime = 0;

    if (this.maxSlotTime === 60) {
      this.isSlotSelected = false;
    }
    this.GetEmpTaskData();
  }

  // getslotminutes() {
  //   const now = new Date();

  //   const today10AM = new Date();
  //   today10AM.setHours(10, 0, 0, 0);

  //   const tomorrow10AM = new Date(today10AM);
  //   tomorrow10AM.setDate(today10AM.getDate() + 1);

  //   console.log("Today 10AM:", today10AM);
  //   console.log("Tomorrow 10AM:", tomorrow10AM);
  //   today10AM.toISOString().split('T')[0];

  //   // this.empService.GETMINUTES({ slotDate: today10AM, emP_ID: Number(sessionStorage.getItem('EMP_ID')), sloT_ID: this.slot_id }).subscribe(response => {
  //   //   this.minutes = response;
  //   //   console.log(response)
  //   // }, error => {
  //   //   console.log(error);
  //   // }
  //   // )
  // }

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

    this.today10am=today10AM;

    const tomorrow10AM = new Date(today10AM);
    tomorrow10AM.setDate(today10AM.getDate() + 1);
    this.tommarow10am = tomorrow10AM;

    console.log("Today 10AM:", today10AM);
    console.log("Tomorrow 10AM:", tomorrow10AM);

    return { today10AM, tomorrow10AM };
  }

  GetEmployeeTask() {

    let emp_id = Number(sessionStorage.getItem('EMP_ID'));
    const selectedDate = this.timesheetForm.get('workDate')?.value;
    if (!selectedDate) return;
    console.log("SelectedDate:"+selectedDate);

    this.empService.GetEmpTaskDetails({ emp_ID: emp_id, emp_Work_date: selectedDate }).subscribe(response => {
      console.log(response);
      this.employeeTimesheet = response;
    }, error => {
      console.log(error);
    });
  }
}
