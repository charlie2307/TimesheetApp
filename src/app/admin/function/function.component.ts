import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

interface FunctionEntry {
  functionName: string;
  role: string;
}

@Component({
  selector: 'app-function',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './function.component.html',
  styleUrl: './function.component.css'
})
export class FunctionComponent implements OnInit {
  functionForm!: FormGroup;
  functions:any[]=[];
  roles:any[]=[];
  addedFunctions: FunctionEntry[] = [];

  constructor(private fb: FormBuilder, private adminService:AdminService) {}

  ngOnInit() {
    this.functionForm = this.fb.group({
      functionName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z\s]+$/)
        ]
      ],
      role: ['', Validators.required]
    });

    this.adminService.getRoles().subscribe(data => {
      this.roles = data;
      console.log(data);
    });

    this.adminService.getRoles().subscribe(data => {
      this.roles = data;
      console.log(data);
    });


  }

  get functionName() {
    return this.functionForm.get('functionName');
  }

  get role() {
    return this.functionForm.get('role');
  }

  onSubmit() {
    if (this.functionForm.valid) {
      const entry: FunctionEntry = {
        functionName: this.functionName?.value.trim(),
        role: this.role?.value
      };

      // prevent duplicates
      if (
        this.addedFunctions.some(
          f =>
            f.functionName.toLowerCase() === entry.functionName.toLowerCase() &&
            f.role === entry.role
        )
      ) {
        alert('This function & role combination already exists!');
        return;
      }

      this.addedFunctions.push(entry);
      this.functionForm.reset();
    } else {
      this.functionForm.markAllAsTouched();
    }
  }
}
