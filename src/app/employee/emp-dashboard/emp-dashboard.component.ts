// import { Component, OnInit } from '@angular/core';
// import { NavbarComponent } from '../../navbar/navbar.component';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { EmpService, ProjectClient } from '../../services/emp.service';

// @Component({
//   selector: 'app-emp-dashboard',
//   imports: [NavbarComponent, RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './emp-dashboard.component.html',
//   styleUrl: './emp-dashboard.component.css'
// })
// export class EmpDashboardComponent implements OnInit {
//   moduleId: number = 0;
//   taskApproved: boolean = false;
//   condition: boolean = false;
//   currentDateTime!: Date;
//   today = new Date();
//   modules: any[] = [{}];
//   time: number = 60;
//   minutes: number[] = [];
//   selectedMinute: number | null = null;
//   timesheetForm!: FormGroup;
//   isActiveBtn: boolean = false;
//   selectedFunc: string = '';
//   functions: any[] = [];
//   projectClients: ProjectClient[] = [];
//   functiondetails: string = ''
//   timesheet!: FormGroup;
//   slot_id: number = 0;
//   proJ_ID: number = 0;
//   TimeFrom: string = '';
//   TimeTO: string = '';


//   SlotDetails: any[] = [];


//   employeeTimesheet = [
//     { timeslot: '10AM-11AM', function: 'Button1', projectAndClient: 'ProjectList1', module: 'Module1', minute: 15 },
//     { timeslot: '10AM-11AM', function: 'Button2', projectAndClient: 'ProjectList2', module: 'Module2', minute: 20 },
//     { timeslot: '11AM-12AM', function: 'Button3', projectAndClient: 'ProjectList3', module: 'Module3', minute: 30 },
//     { timeslot: '11AM-12AM', function: 'Button4', projectAndClient: 'ProjectList1', module: 'Module2', minute: 10 },
//     { timeslot: '12AM-1PM', function: 'Button1', projectAndClient: 'ProjectList3', module: 'Module1', minute: 25 }
//   ];

//   groupedTimesheet: { timeslot: string, entries: any[] }[] = [];

//   constructor(private fb: FormBuilder, private empService: EmpService, private router: Router) {
//     const map = new Map<string, any[]>();

//     console.log(sessionStorage.getItem('EMP_ROLE'));
//     this.employeeTimesheet.forEach(entry => {
//       if (!map.has(entry.timeslot)) {
//         map.set(entry.timeslot, []);
//       }
//       map.get(entry.timeslot)?.push(entry);
//     });

//     this.groupedTimesheet = Array.from(map.entries()).map(([timeslot, entries]) => ({
//       timeslot,
//       entries
//     }));
//   }

//   ngOnInit() {

//     const timeChange =
//       this.currentDateTime = new Date();
//     setInterval(() => {
//       this.currentDateTime = new Date();
//     }, 1000);

//     this.minutes = Array.from({ length: this.time }, (_, i) => i);

//     this.timesheetForm = this.fb.group({
//       type: ['', Validators.required],
//       minute: [{ value: '', disabled: true }, Validators.required],
//       projectAndClient: ['', Validators.required]
//     });


//     this.timesheetForm.get('type')?.valueChanges.subscribe(value => {
//       const minuteControl = this.timesheetForm.get('minute');
//       if (value === 'Full') {
//         minuteControl?.disable();
//         minuteControl?.reset(); // optionally clear value
//       } else if (value === 'Split') {
//         minuteControl?.enable();
//       }
//     });




//     this.timesheetForm = this.fb.group({

//       timeslot: [''],
//       projectAndClient: [''],
//       module: [''],
//       type: 0,
//       minute: [''],
//       functionBtn: this.selectedFunc,
//       description: ['']
//     });

//     this.timesheet = this.fb.group({
//       emP_ID: Number(sessionStorage.getItem('EMP_ID')),
//       sloT_ID: 0,
//       hourse: this.timesheetForm.get('type')?.value,
//       proJ_ID: 0,
//       fuN_ID: this.functiondetails,
//       moD_ID: 0,
//       timE_FROM: this.TimeFrom,
//       timE_TO: this.TimeTO,
//       timesheeT_DESC: this.timesheetForm.get('description')?.value,
//       createD_BY: sessionStorage.getItem('EMP_NAME')
//     })



//     this.loadFunctions();
//     this.loadProjects();
//     this.empService.GetSlot().subscribe(response => {

//       this.SlotDetails = response;
//       console.log(this.SlotDetails);
//     }, error => {
//       console.log(error);
//     }
//     );
//     this.checkTaskApproval();


//     this.taskApproved =Boolean (localStorage.getItem('taskApproved'));
//   }


//   loadFunctions() {
//     this.empService.getFunctions().subscribe(
//       (data) => {
//         this.functions = data;
//         console.log(data);
//       },
//       (error) => {
//         console.error(error);
//       }
//     );
//   }
//   onprojectselect(E: Event) {
//     this.proJ_ID = Number((E.target as HTMLInputElement).value);
//     this.timesheet.patchValue({
//       proJ_ID: this.proJ_ID

//     })
//     console.log(this.proJ_ID);

//   }
//   loadProjects() {
//     this.empService.getProjectsWithClients().subscribe(
//       (data) => {
//         this.projectClients = data;
//         console.log(data);
//       },
//       (error) => {
//         console.error(error)
//       });
//   }

//   onButtonClick(button: string) {
//     this.timesheetForm.patchValue({ functionBtn: button });
//     this.selectedFunc = button;
//   }


//   timefrom = 0;
//   timeto = 0;

//   onSubmit() {
//     const taskApproved = Boolean(localStorage.getItem('taskApproved'));
//     const description = this.timesheetForm.get('description')?.value;
//     console.log("Description:", description);



//     let selectedMinute = Number(this.timesheetForm.get('minute')?.value);


//     this.timefrom = this.timeto;
//     this.timeto = this.timefrom + selectedMinute;
//     let from = this.timefrom.toString();
//     let to = this.timeto.toString();
//     this.TimeFrom = from;
//     this.TimeTO = to;
//     this.timesheet.patchValue({
//       timE_TO: to,
//       timE_FROM: from,
//       timesheeT_DESC: this.timesheetForm.get('description')?.value,
//       sloT_ID: this.slot_id
//     });


//     this.time = this.time - selectedMinute;
//     this.minutes = Array.from({ length: this.time }, (_, i) => i);
//     this.timesheet.patchValue({
//       hourse: Number(this.timesheetForm.get('type')?.value)

//     })
//     console.log(this.timesheet.value);
//     console.log("---------------------------");
//     if(!taskApproved){
//     this.empService.SubmitTask(this.timesheet.value).subscribe(response => {
//       console.log(response);
//     },
//       error => {
//         console.log(error);
//       });
//     }
//     else{
//       alert("You have already approved todays task.!\n Come Tomorrow For Add The Tomorrow Tasks.")
//     }

//   }
//   onselectModule(e: Event) {
//     this.timesheet.patchValue({
//       moD_ID: Number((e.target as HTMLInputElement).value)
//     })
//     this.moduleId = Number((e.target as HTMLInputElement).value);
//     console.log(this.moduleId);
//   }
//   onselectfunction(e: Event) {
//     const index = +(e.target as HTMLSelectElement).value;
//     const selectedFunc = this.functions[index];
//     this.functiondetails = selectedFunc.fuN_ID;
//     console.log("Selected Name:", selectedFunc.fuN_NAME);
//     console.log("Selected ID:", selectedFunc.fuN_ID);
//     this.timesheet.patchValue({
//       fuN_ID: selectedFunc.fuN_ID
//     })
//     this.empService.getModules(selectedFunc.fuN_NAME).subscribe(resp => {
//       this.modules = resp;
//     },
//       error => {
//         console.log(error);
//       });
//   }
//   onselectTimeType(e: Event) {
//     const confirm = (e.target as HTMLInputElement).value;
//     if (confirm == '2') {
//       this.condition = true;
//     }
//     this.timesheetForm.patchValue({
//       type: 2
//     })
//     if (confirm == '1') {
//       this.condition = false;
//       this.timesheetForm.patchValue({
//         type: 1
//       })
//     }
//   }
//   onfunctionchage(e: Event) {
//     this.slot_id = Number((e.target as HTMLInputElement).value);
//   }

//   onApproveClick(): void {
//     const currentDate = new Date();
//     const currentHour = currentDate.getHours();
//     const todayDate = currentDate.toISOString().split('T')[0];


//     if (currentHour >= 10) {
//       localStorage.setItem('taskApproved', 'true');
//       localStorage.setItem('taskApprovalDate', todayDate);
//       this.checkTaskApproval();
//       alert('Task Approved for today!');
//     } else {
//       alert('You can approve the task only after 10 AM.');
//     }
//   }
//   checkTaskApproval(): void {
//     const todayDate = new Date().toISOString().split('T')[0];
//     const taskApproved = localStorage.getItem('taskApproved');
//     const taskApprovalDate = localStorage.getItem('taskApprovalDate');


//     if (taskApproved && taskApproved === 'true' && taskApprovalDate === todayDate) {
//       this.taskApproved = true;
//     } else {
//       this.taskApproved = false;
//     }
//   }
// }







import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpService, ProjectClient } from '../../services/emp.service';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-emp-dashboard',
  imports: [NavbarComponent, RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css'
})


export class EmpDashboardComponent implements OnInit {

  moduleId: number = 0;
  taskApproved: boolean = false;
  condition: boolean = false;
  currentDateTime!: Date;
  today = new Date();
  newDateTime = new Date();
  modules: any[] = [{}];
  time: number = 60;
  minutes: any[] = [];
  selectedMinute: number | null = null;
  timesheetForm!: FormGroup;
  isActiveBtn: boolean = false;
  selectedFunc: string = '';
  functions: any[] = [];
  projectClients: ProjectClient[] = [];
  functiondetails: string = ''
  timesheet!: FormGroup;
  slot_id: number = 0;
  proJ_ID: number = 0;
  TimeFrom: string = '';
  TimeTO: string = '';
  EmployeeTasks: any[] = [];

  SlotDetails: any[] = [];


  employeeTimesheet: any[] = [];

  

  groupedTimesheet: { timeslot: string, entries: any[] }[] = [];

  constructor(private fb: FormBuilder, private empService: EmpService, private router: Router) {
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

  ngOnInit() {

    this.checkTaskApproval();
    this.resetTaskApprovalIfExpired();
    this.GetEmpTaskData();
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

  GetEmpTaskData() {
    const empId = Number(sessionStorage.getItem('EMP_ID'));
    this.empService.GetEmpTasksdates(empId).subscribe(
      response => {
        this.EmployeeTasks = response;
        // this.EmployeeTasks = this.EmployeeTasks.map(date => date.split('T')[0]);
        console.log(response);
      }, error => {
        console.log(error);
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
  onprojectselect(E: Event) {
    this.proJ_ID = Number((E.target as HTMLInputElement).value);
    this.timesheet.patchValue({
      proJ_ID: this.proJ_ID

    })
    console.log(this.proJ_ID);

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


  timefrom = 0;
  timeto = 0;

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

  }
  onselectModule(e: Event) {
    this.timesheet.patchValue({
      moD_ID: Number((e.target as HTMLInputElement).value)
    })
    this.moduleId = Number((e.target as HTMLInputElement).value);
    console.log(this.moduleId);
  }
  onselectfunction(e: Event) {
    const index = +(e.target as HTMLSelectElement).value;
    const selectedFunc = this.functions[index];
    this.functiondetails = selectedFunc.fuN_ID;
    console.log("Selected Name:", selectedFunc.fuN_NAME);
    console.log("Selected ID:", selectedFunc.fuN_ID);
    this.timesheet.patchValue({
      fuN_ID: selectedFunc.fuN_ID
    })
    this.empService.getModules(selectedFunc.fuN_ID).subscribe(resp => {
      this.modules = resp;
    },
      error => {
        console.log(error);
      });
  }
  onselectTimeType(e: Event) {
    const confirm = (e.target as HTMLInputElement).value;
    console.log(confirm);
    if (confirm == '2') {
      this.getslotminutes();
      this.condition = true;
    }
    this.timesheetForm.patchValue({
      type: 2
    })
    if (confirm == '1') {
      this.condition = false;
      const minval=Math.min(...this.minutes.map(emp=>emp.min));
      if(minval>0 )
      {
       
alert("You already Used Some minutes From This Slot So you not used The Full Time Type for this slot.");

       
      }
      
      this.timesheetForm.patchValue({
        type: 1,

      })
    }
  }
  onfunctionchange(e: Event) {
    this.slot_id = Number((e.target as HTMLInputElement).value);
    this.getslotminutes();
     const minval=Math.min(...this.minutes.map(emp=>emp.min));
        if(minval>0 )
      {
        alert("You already Used Some minutes From This Slot So you not used The Full Time Type for this slot.");
       
      }
      
  }

  onApproveClick(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const todayDate = currentDate.toISOString().split('T')[0];


    if (currentHour >= 10) {
      localStorage.setItem('taskApproved', 'true');
      localStorage.setItem('taskApprovalDate', todayDate);
      this.checkTaskApproval();
      alert('Task Approved for today!');
    } else {
      alert('You can approve the task only after 10 AM.');
    }
  }
  checkTaskApproval(): void {
    const todayDate = new Date().toISOString().split('T')[0];
    const taskApproved = localStorage.getItem('taskApproved');
    const taskApprovalDate = localStorage.getItem('taskApprovalDate');


    if (taskApproved && taskApproved === 'true' && taskApprovalDate === todayDate) {
      this.taskApproved = true;
    } else {
      this.taskApproved = false;
    }
  }


  getTodayAndTomorrow10AM() {
    const now = new Date();

    const today10AM = new Date();
    today10AM.setHours(10, 0, 0, 0);

    const tomorrow10AM = new Date(today10AM);
    tomorrow10AM.setDate(today10AM.getDate() + 1);

    console.log("Today 10AM:", today10AM);
    console.log("Tomorrow 10AM:", tomorrow10AM);

    return { today10AM, tomorrow10AM };

  }

  resetTaskApprovalIfExpired() {
    // const { tomorrow10AM } = this.getTodayAndTomorrow10AM();
    const { today10AM } = this.getTodayAndTomorrow10AM();
    const now = new Date();
    console.log(now);
    const taskApproved = Boolean(localStorage.getItem('taskApproved'));
    console.log("type of true false:" + taskApproved);
    if (taskApproved === true && now >= today10AM) {
      console.log("Task approval expired. Resetting...");
      localStorage.removeItem('taskApproved');
      localStorage.removeItem('taskApprovalDate');
      this.taskApproved = false;
    }
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
  getslotminutes()
  {
 const now = new Date();

    const today10AM = new Date();
    today10AM.setHours(10, 0, 0, 0);

    const tomorrow10AM = new Date(today10AM);
    tomorrow10AM.setDate(today10AM.getDate() + 1);

    console.log("Today 10AM:", today10AM);
    console.log("Tomorrow 10AM:", tomorrow10AM);
today10AM.toISOString().split('T')[0];
   
    this.empService.GETMINUTES({slotDate:today10AM,emP_ID:Number(sessionStorage.getItem('EMP_ID')),sloT_ID:this.slot_id}).subscribe(response=>{
    this.minutes=response;
      console.log(response)
    },error=>{
      console.log(error);
    }
  )
  }
}


