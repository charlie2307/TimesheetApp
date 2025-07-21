import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

interface Role {
  name: string;
  code: string;
}


@Component({
  selector: 'app-role',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  roleForm!: FormGroup;
  roles: any[] = [];
  private roleCounter: number = 0;
  isEditing: boolean = false;
  editingRoleId: number | null = null;

  constructor(private fb: FormBuilder,private adminService:AdminService) { }

  ngOnInit() {
    this.roleForm = this.fb.group({
      rolE_NAME: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z\s]+$/), // letters & spaces only
        ],
      ],
      rolE_CODE: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z0-9\s]+$/), // letters & spaces only
        ],
      ],
    });

    this.loadRoles()
  }

  get rolE_NAME() {
    return this.roleForm.get('rolE_NAME');
  }
  get rolE_CODE() {
    return this.roleForm.get('rolE_CODE');
  }

  loadRoles() {
    this.adminService.getRoles().subscribe(
      (data) => {
        this.roles = data;
        console.log(data);
      });
  }

  updateBtn() {
    if (this.roleForm.valid) {

      const formData = {
        rolE_ID: this.editingRoleId, // 👈 include employee ID
        ...this.roleForm.value
      };
      console.log('Submitting role:', formData);


      this.adminService.updateRole(formData).subscribe({
        next: (res) => {
          console.log("hii " + res.message);
          alert('Role updated successfully!');
          this.roleForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update role');
        }
      });
      this.roleForm.reset();
    }
    else {
      this.roleForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.roleForm.valid) {

      console.log(this.roleForm.value)

      if (this.roleForm.invalid) {
        this.roleForm.markAllAsTouched();
        return;
      }

      const formData = this.roleForm.value;
      console.log('Submitting role:', formData);


      this.adminService.addEmployee(formData).subscribe({
        next: (res) => {
          alert('Role added successfully!');
          this.roleForm.reset();
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Failed to add role');
        }
      });

      this.roleForm.reset();
    } else {
      this.roleForm.markAllAsTouched();
    }
  }

  editBtn(role: any) {
    this.isEditing = true;
    this.editingRoleId = role.rolE_ID; 

    this.roleForm.patchValue({
      rolE_NAME:role.rolE_NAME,
      rolE_CODE:role.rolE_CODE
    });
  }

  deleteBtn(ID: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.adminService.deleteRole(ID).subscribe({
        next: (res) => {
          alert(res);
          this.loadRoles(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete role');
        }
      });
    }
  }

  resetForm() {
    this.roleForm.reset();
    this.isEditing = false;
    this.editingRoleId = null;
  }
}
