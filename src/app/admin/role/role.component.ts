import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  roles: Role[] = [];
  private roleCounter: number = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.roleForm = this.fb.group({
      roleName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z\s]+$/), // letters & spaces only
        ],
      ],
    });
  }

  get roleName() {
    return this.roleForm.get('roleName');
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const name: string = this.roleForm.value.roleName.trim();

      // Auto-generate role code
      const prefix = name.substring(0, 3).toLowerCase();
      this.roleCounter++;
      const numberPart = this.roleCounter.toString().padStart(3, '0');
      const code = prefix + numberPart;

      this.roles.push({ name, code });
      this.roleForm.reset();
    } else {
      this.roleForm.markAllAsTouched();
    }
  }
}
