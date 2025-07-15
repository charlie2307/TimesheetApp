import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{
  projectForm!: FormGroup;

  // Example client list for dropdown
  clients: string[] = ['Client A', 'Client B', 'Client C'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      projectName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9\s]+$/),
        ],
      ],
      projectDescription: [
        '',
        [
          Validators.maxLength(200),
        ],
      ],
      clientName: ['', Validators.required],
    });
  }

  get projectName() {
    return this.projectForm.get('projectName');
  }

  get projectDescription() {
    return this.projectForm.get('projectDescription');
  }

  get clientName() {
    return this.projectForm.get('clientName');
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log(this.projectForm.value);
      alert('Project added!');
      this.projectForm.reset();
    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}
