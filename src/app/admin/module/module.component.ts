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
  modules:any[]=[];

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.moduleForm = this.fb.group({
      moduleName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[0-9][A-Za-z\s]+$/)
        ]
      ],
      function: ['', Validators.required]
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

  get moduleName() {
    return this.moduleForm.get('moduleName');
  }

  get function() {
    return this.moduleForm.get('function');
  }

  onSubmit() {
    if (this.moduleForm.valid) {
      const entry: ModuleEntry = {
        moduleName: this.moduleName?.value,
        function: this.function?.value
      };

      // prevent duplicates
      // if (
      // this.addedModules.some(
      // f =>
      // f.moduleName.toLowerCase() === entry.moduleName.toLowerCase() &&
      // f.function === entry.function
      // )
      // ) {
    //   alert('This function & role combination already exists!');
    //   return;
    // }

    // this.addedModules.push(entry);
    this.moduleForm.reset();
  } else {
  this.moduleForm.markAllAsTouched();
}
  }
}
