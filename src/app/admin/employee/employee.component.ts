import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

export interface Roles {
  rolE_ID: number;
  rolE_NAME: string;
}
export interface Employee {
  emP_ID: number;
  rolE_ID: number;
  emP_NAME: string;
  emP_CODE: string;
  emP_MOBILE_NO: number;
  emP_EMAIL_ID: string;
  emP_PASSWORD: string;
}
@Component({
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  employees: Employee[] = [];
  roles: Roles[] = [];

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {
    this.employeeForm = this.fb.group({
      emP_NAME: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]+$/)
        ]
      ],
      emP_CODE: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]+$/)
        ]
      ],
      rolE_ID: [
        '',
        [Validators.required]
      ],
      emP_MOBILE_NO: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],
      emP_EMAIL_ID: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      emP_PASSWORD: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]
      ]
    });
  }

  ngOnInit(): void {


    this.adminService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
        console.log(data);
      });

    this.adminService.getRoles().subscribe(
      (data) => {
        this.roles = data;
        console.log(data);
      }
    )
  }

  onSubmit() {
    if (this.employeeForm.valid) {

      console.log(this.employeeForm.value)

      if (this.employeeForm.invalid) {
        this.employeeForm.markAllAsTouched();
        return;
      }

      const formData = this.employeeForm.value;
      console.log('Submitting employee:', formData);

      this.adminService.addEmployee(formData).subscribe({
        next: (res) => {
          alert('Employee added successfully!');
          this.employeeForm.reset();
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Failed to add employee');
        }
      });

      // this.adminService.addEmployee(this.employeeForm.value).subscribe(
      //   (data) => {
      //     console.log('Form Submitted:', this.employeeForm.value);
      //     alert('Employee registered successfully!');
      //     this.employeeForm.reset();
      //   },
      //   (err) => {
      //     this.employeeForm.markAllAsTouched();
      //     console.error('Registration error:', err);
      //     alert('Registration failed. Please try again.');
      //   }
      // );
      this.employeeForm.reset();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  get name() { return this.employeeForm.get('emP_NAME'); }
  get empCode() { return this.employeeForm.get('emP_CODE'); }
  get role() { return this.employeeForm.get('rolE_ID'); }
  get mobileNo() { return this.employeeForm.get('emP_MOBILE_NO'); }
  get email() { return this.employeeForm.get('emP_EMAIL_ID'); }
  get password() { return this.employeeForm.get('emP_PASSWORD'); }
  
}
