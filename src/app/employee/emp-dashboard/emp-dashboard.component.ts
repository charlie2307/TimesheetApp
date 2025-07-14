import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-emp-dashboard',
  imports: [NavbarComponent, RouterOutlet, RouterModule, CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css'
})
export class EmpDashboardComponent implements OnInit {
  currentDateTime!: Date;
  today = new Date();
  minutes: number[] = [];
  selectedMinute: number | null = null;
  timesheetForm!: FormGroup;
  isActiveBtn: boolean=false;
  selectedFunc: string='';

  constructor(private fb: FormBuilder){}

  ngOnInit() {
    this.currentDateTime = new Date();
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    this.minutes = Array.from({ length: 60 }, (_, i) => i);

    this.timesheetForm = this.fb.group({
      type: ['', Validators.required],
      minute: [{ value: '', disabled: true }, Validators.required], 
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
  }

  onButtonClick(button: string) {
    this.timesheetForm.patchValue({ functionBtn: button });
    this.selectedFunc=button;
  }

  onSubmit() {
    console.log(this.timesheetForm.value);
  }
}
