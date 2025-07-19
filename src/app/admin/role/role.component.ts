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

    this.adminService.getRoles().subscribe(
      (data)=>{
        this.roles=data;
        console.log(data);
      });
  }

  get rolE_NAME() {
    return this.roleForm.get('rolE_NAME');
  }
  get rolE_CODE() {
    return this.roleForm.get('rolE_CODE');
  }

  // onSubmit() {
  //   if (this.roleForm.valid) {
  //     const name: string = this.roleForm.value.roleName.trim();

  //     // Auto-generate role code
  //     const prefix = name.substring(0, 3).toLowerCase();
  //     this.roleCounter++;
  //     const numberPart = this.roleCounter.toString().padStart(3, '0');
  //     const code = prefix + numberPart;

  //     this.roles.push({ name, code });
  //     this.roleForm.reset();
  //   } else {
  //     this.roleForm.markAllAsTouched();
  //   }
  // }

  onSubmit():void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();  // show validation errors
      return;
    }

    const clientData = {
      rolE_CODE: this.roleForm.value.rolE_CODE, 
      rolE_NAME: this.roleForm.value.rolE_NAME
    };

    this.adminService.addRole(clientData).subscribe(
      (response) => {
        console.log('Role added successfully', response);
        alert('Role added successfully!');
        this.roleForm.reset();  // clear the form
      },
      (error) => {
        console.error('Error adding role', error);
        alert('Something went wrong while adding role.');
      }
    );
  }

  editBtn(){}

  deleteBtn(){}
}
