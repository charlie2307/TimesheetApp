import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

interface TimeslotEntry {
  sloT_ID: number;
  timeslot: string;
}

@Component({
  selector: 'app-timeslot',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './timeslot.component.html',
  styleUrl: './timeslot.component.css'
})
export class TimeslotComponent implements OnInit {
  timeslotForm!: FormGroup;
  timeslots: any[] = [];
  time: number = 24;
  hours: number[] = [];
  isEditing: boolean = false;
  editingTimeslotId: number | null = null;


  addedTimeslots: TimeslotEntry[] = [];

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.timeslotForm = this.fb.group({
      timeslot: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/ )]
      ]
    });

    this.loadRoles();
    this.hours = Array.from({ length: this.time }, (_, i) => i);
  }

  get timeslot() {
    return this.timeslotForm.get('timeslot');
  }
  // get timeslot2() {
  //   return this.timeslotForm.get('timeslot2');
  // }

  // onSubmit():void {
  //   if (this.timeslotForm.invalid) {
  //     this.timeslotForm.markAllAsTouched();  // show validation errors
  //     return;
  //   }

  //   const data = this.timeslotForm.value.timeslot1+"-"+this.timeslotForm.value.timeslot2;
  //   const timeslot = {
  //   timeslot: data
  // };
  //   console.log(timeslot);

  //   this.adminService.addTimeslot(timeslot).subscribe(
  //     (response) => {
  //       console.log('Client added successfully', response);
  //       alert('Client added successfully!');
  //       this.timeslotForm.reset();  // clear the form
  //     },
  //     (error) => {
  //       console.error('Error adding client', error);
  //       alert('Something went wrong while adding client.');
  //     }
  //   );
  // }

  loadRoles() {
    this.adminService.getTimeslots().subscribe(
      (data) => {
        this.timeslots = data;
        console.log(data);
      });
  }

  updateBtn() {
    if (this.timeslotForm.valid) {

      console.log("timeslotForm: "+ this.timeslotForm.value(["timeslot"]))

      // const data = this.timeslotForm.value;
      // const timeslot = {
      //   timeslot: data
      // };
      
      const formData = {
        sloT_ID: this.editingTimeslotId, // 👈 include employee ID
        ...this.timeslotForm.value
      };
      console.log('Submitting timeslot:', formData);


      this.adminService.updateTimeslot(formData).subscribe({
        next: (res) => {
          alert('Timeslot updated successfully!');
          this.timeslotForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update timeslot');
        }
      });
      this.timeslotForm.reset();
    }
    else {
      this.timeslotForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.timeslotForm.valid) {

      console.log(this.timeslotForm.value)

      if (this.timeslotForm.invalid) {
        this.timeslotForm.markAllAsTouched();
        return;
      }

      const formData = this.timeslotForm.value;
      console.log('Submitting role:', formData);


      this.adminService.addEmployee(formData).subscribe({
        next: (res) => {
          alert('Role added successfully!');
          this.timeslotForm.reset();
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Failed to add role');
        }
      });

      this.timeslotForm.reset();
    } else {
      this.timeslotForm.markAllAsTouched();
    }
  }

  editBtn(slot: any) {
    this.isEditing = true;
    this.editingTimeslotId = slot.sloT_ID;

    this.timeslotForm.patchValue({
      timeslot: slot.timeslot
    });
  }

  deleteBtn(ID: number) {
    if (confirm('Are you sure you want to delete this timeslot?')) {
      this.adminService.deleteRole(ID).subscribe({
        next: (res) => {
          alert(res);
          this.loadRoles(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete timeslot');
        }
      });
    }
  }

  resetForm() {
    this.timeslotForm.reset();
    this.isEditing = false;
    this.editingTimeslotId = null;
  }
}
