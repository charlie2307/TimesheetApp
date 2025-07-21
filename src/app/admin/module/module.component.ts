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
  isEditing: boolean = false;
  editingModId: number | null = null;

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

    this.loadFunctions();
    this.loadModule();

  }

  loadModule() {
    this.adminService.getModules().subscribe(data => {
      this.modules = data;
      console.log(data);
    });
  }

  loadFunctions() {
    this.adminService.getFunctions().subscribe(data => {
      this.functions = data;
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

  onSubmit(): void {
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

  updateBtn() {
    if (this.moduleForm.valid) {

      console.log(this.moduleForm.value)

      const formData = {
        MOD_ID: this.editingModId, // 👈 include employee ID
        ...this.moduleForm.value
      };
      console.log('Submitting module:', formData);


      this.adminService.updateModule(formData).subscribe({
        next: (res) => {
          console.log("hii " + res.message);
          alert('Module updated successfully!');
          this.moduleForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update module');
        }
      });
      this.moduleForm.reset();
    }
    else {
      this.moduleForm.markAllAsTouched();
    }
  }

  editEmp(mod: any) {
    this.isEditing = true;
    this.editingModId = mod.moD_ID; // assuming employee has emP_ID

    const funcId = mod.fuN_ID
      ? mod.fuN_ID
      : this.functions.find(f => f.fuN_NAME === mod.fuN_NAME)?.fuN_ID;

    this.moduleForm.patchValue({
      moD_NAME: mod.moD_NAME,
      moD_CODE: mod.moD_CODE,
      fuN_NAME: funcId || ''
    });
  }

  deleteEmp(modID: number) {
    if (confirm('Are you sure you want to delete this module?')) {
      this.adminService.deleteModule(modID).subscribe({
        next: (res) => {
          alert(res);
          this.loadModule(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete module');
        }
      });
    }
  }

  resetForm() {
    this.moduleForm.reset();
    this.isEditing = false;
    this.editingModId = null;
  }
}
