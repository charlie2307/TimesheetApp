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
  rolE_NAME: string;
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
  isEditing: boolean = false;
  editingEmpId: number | null = null;

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
          Validators.pattern(/^[a-zA-Z0-9]+$/)
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




    this.adminService.getRoles().subscribe(
      (data) => {
        this.roles = data;
        console.log(data);
      });

    this.loadEmployees();
  }

  loadEmployees() {
    this.adminService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
        console.log(data);
      });
  }

  updateEmp() {
    if (this.employeeForm.valid) {

      console.log(this.employeeForm.value)

      const formData = {
        emP_ID: this.editingEmpId, // 👈 include employee ID
        emP_NAME: this.employeeForm.get('emP_NAME')?.value,
        emP_CODE: this.employeeForm.get('emP_CODE')?.value,
        emP_MOBILE_NO: this.employeeForm.get('emP_MOBILE_NO')?.value,
        rolE_ID: this.employeeForm.get('rolE_ID')?.value
      };
      console.log('Submitting employee:', formData);


      this.adminService.updateEmployee(formData).subscribe({
        next: (res) => {
          console.log("hii " + res.message);
          alert('Employee updated successfully!');
          this.employeeForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update employee');
        }
      });
      this.employeeForm.reset();
    }
    else {
      this.employeeForm.markAllAsTouched();
    }
    this.isEditing=false;
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

      this.employeeForm.reset();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  editEmp(emp: any) {
    this.isEditing = true;
    this.editingEmpId = emp.emP_ID; // assuming employee has emP_ID

    this.employeeForm.patchValue({
      emP_NAME: emp.emP_NAME,
      emP_CODE: emp.emP_CODE,
      rolE_ID: emp.rolE_ID,
      emP_MOBILE_NO: emp.emP_MOBILE_NO,
      emP_EMAIL_ID: emp.emP_EMAIL_ID,
      emP_PASSWORD: emp.emP_PASSWORD  // usually leave password blank
    });
  }

  deleteEmp(empID: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.adminService.deleteEmployee(empID).subscribe({
        next: (res) => {
          alert(res);
          this.loadEmployees(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete employee');
        }
      });
    }
  }

  resetForm() {
    this.employeeForm.reset();
    this.isEditing = false;
    this.editingEmpId = null;
  }

  get emP_NAME() { return this.employeeForm.get('emP_NAME'); }
  get emP_CODE() { return this.employeeForm.get('emP_CODE'); }
  get rolE_ID() { return this.employeeForm.get('rolE_ID'); }
  get emP_MOBILE_NO() { return this.employeeForm.get('emP_MOBILE_NO'); }
  get emP_EMAIL_ID() { return this.employeeForm.get('emP_EMAIL_ID'); }
  get emP_PASSWORD() { return this.employeeForm.get('emP_PASSWORD'); }
}
