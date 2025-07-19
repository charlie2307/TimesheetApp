import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  projectForm!: FormGroup;
  projects: any[] = [];
  clients: any[] = [];
  isEditing: boolean = false;
  editingProjId: number | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      proJ_NAME: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9\s]+$/),
        ],
      ],
      proJ_CODE: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9\s]+$/),
        ],
      ],
      proJ_DESCRIPTION: [
        '',
        [
          Validators.maxLength(200),
        ],
      ],
      clienT_NAME: ['', Validators.required],
    });

    this.loadClients();
    this.loadProjects();

  }

  loadProjects() {
    this.adminService.getProjects().subscribe(
      (data) => {
        this.projects = data;
        console.log(data);
      });
  }

  loadClients() {
    this.adminService.getClients().subscribe(
      (data) => {
        this.clients = data;
        console.log(data);
      });
  }

  get proJ_NAME() {
    return this.projectForm.get('proJ_NAME');
  }

  get proJ_DESCRIPTION() {
    return this.projectForm.get('proJ_DESCRIPTION');
  }

  get proJ_CODE() {
    return this.projectForm.get('proJ_CODE');
  }

  get clienT_NAME() {
    return this.projectForm.get('clienT_NAME');
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();  // show validation errors
      return;
    }

    const projectData = {
      proJ_CODE: this.projectForm.value.proJ_CODE,
      proJ_NAME: this.projectForm.value.proJ_NAME,
      proJ_DESCRIPTION: this.projectForm.value.proJ_DESCRIPTION,
      clienT_NAME: this.projectForm.value.clienT_NAME
    };
    console.log(projectData);
    this.adminService.addProject(projectData).subscribe(
      (response) => {
        console.log('Project added successfully', response);
        alert('Project added successfully!');
        this.projectForm.reset();
      },
      (error) => {
        console.error('Error adding client', error);
        alert('Something went wrong while adding Project.');
      }
    );
  }

  updateEmp() {
    if (this.projectForm.valid) {

      console.log(this.projectForm.value)

      const formData = {
        MOD_ID: this.editingProjId, // 👈 include employee ID
        ...this.projectForm.value
      };
      console.log('Submitting module:', formData);


      this.adminService.updateModule(formData).subscribe({
        next: (res) => {
          console.log("hii " + res.message);
          alert('Module updated successfully!');
          this.projectForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update module');
        }
      });
      this.projectForm.reset();
    }
    else {
      this.projectForm.markAllAsTouched();
    }
  }

  editEmp(proj: any) {
    this.isEditing = true;
    this.editingProjId = proj.proJ_ID; // assuming employee has emP_ID

    this.projectForm.patchValue({
      proJ_NAME: proj.proJ_NAME,
      clienT_ID: proj.clienT_ID
    });
  }

  deleteEmp(funID: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.adminService.deleteFunction(funID).subscribe({
        next: (res) => {
          alert(res);
          this.loadProjects(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete project');
        }
      });
    }
  }

  resetForm() {
    this.projectForm.reset();
    this.isEditing = false;
    this.editingProjId = null;
  }
}
