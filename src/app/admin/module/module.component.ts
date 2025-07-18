import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from '../admin/admin.component';
import { AdminService } from '../../services/admin.service';

interface ModuleEntry {
  moduleName: string;
  function: string;
}
@Component({
  selector: 'app-module',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent implements OnInit {
  moduleForm!: FormGroup;

  functions: any[] = [];
  modules: any[] = [];

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.moduleForm = this.fb.group({
      moD_NAME: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9\s]+$/)
        ]
      ],
      moD_CODE: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9\s]+$/)
        ]
      ],
      fuN_NAME: ['', Validators.required]
    });

    this.adminService.getFunctions().subscribe(data => {
      this.functions = data;
      console.log(data);
    });

    this.adminService.getModules().subscribe(data => {
      this.modules = data;
      console.log(data);
    });
  }

  get moD_NAME() {
    return this.moduleForm.get('moD_NAME');
  }

  get moD_CODE() {
    return this.moduleForm.get('moD_CODE');
  }

  get fuN_NAME() {
    return this.moduleForm.get('fuN_NAME');
  }

  onSubmit():void {
    if (this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();  // show validation errors
      return;
    }

    const clientData = {
      moD_CODE: this.moduleForm.value.moD_CODE, 
      moD_NAME: this.moduleForm.value.moD_NAME
    };

    this.adminService.addClient(clientData).subscribe(
      (response) => {
        console.log('Module added successfully', response);
        alert('Module added successfully!');
        this.moduleForm.reset();  // clear the form
      },
      (error) => {
        console.error('Error adding module', error);
        alert('Something went wrong while adding module.');
      }
    );
  }

  editBtn(){}

  deleteBtn(){}
}
