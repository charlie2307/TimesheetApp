import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

interface TimeslotEntry {
  timeslot: string;
  timestamp: string;
}

@Component({
  selector: 'app-timeslot',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './timeslot.component.html',
  styleUrl: './timeslot.component.css'
})
export class TimeslotComponent implements OnInit {
  timeslotForm!: FormGroup;
  timeslots: string[] = [];
  time: number = 24;
  hours: number[] = [];
 

  addedTimeslots: TimeslotEntry[] = [];

  constructor(private fb: FormBuilder,private adminService:AdminService) {}

  ngOnInit() {
    this.timeslotForm = this.fb.group({
      timeslot1: ['', Validators.required],
      timeslot2: ['', Validators.required],
    });

    this.hours = Array.from({ length: this.time }, (_, i) => i);
  }

  get timeslot1() {
    return this.timeslotForm.get('timeslot1');
  }
  get timeslot2() {
    return this.timeslotForm.get('timeslot2');
  }

  onSubmit():void {
    if (this.timeslotForm.invalid) {
      this.timeslotForm.markAllAsTouched();  // show validation errors
      return;
    }

    const data = this.timeslotForm.value.timeslot1+"-"+this.timeslotForm.value.timeslot2;
    const timeslot = {
    timeslot: data
  };
    console.log(timeslot);

    this.adminService.addTimeslot(timeslot).subscribe(
      (response) => {
        console.log('Client added successfully', response);
        alert('Client added successfully!');
        this.timeslotForm.reset();  // clear the form
      },
      (error) => {
        console.error('Error adding client', error);
        alert('Something went wrong while adding client.');
      }
    );
  }

  editBtn(){}

  deleteBtn(){}
}
