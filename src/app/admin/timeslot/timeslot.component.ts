import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

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

  timeslots: string[] = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 18:00',
    '19:00 - 19:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
    '22:00 - 23:00',
    '23:00 - 00:00',
    '00:00 - 01:00',
    '01:00 - 02:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
    '04:00 - 05:00',
    '05:00 - 06:00',
    '06:00 - 07:00',
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
  ];

  addedTimeslots: TimeslotEntry[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.timeslotForm = this.fb.group({
      timeslot: ['', Validators.required],
    });
  }

  get timeslot() {
    return this.timeslotForm.get('timeslot');
  }

  onSubmit() {
    if (this.timeslotForm.valid) {
      const slot = this.timeslot?.value;

      if (this.addedTimeslots.find(t => t.timeslot === slot)) {
        alert('This timeslot is already added!');
        return;
      }

      const timestamp = new Date().toLocaleString();

      this.addedTimeslots.push({ timeslot: slot, timestamp });
      this.timeslotForm.reset();
    } else {
      this.timeslotForm.markAllAsTouched();
    }
  }
}
