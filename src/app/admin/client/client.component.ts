import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule,ReactiveFormsModule,RouterOutlet],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

  clientForm!: FormGroup;
  clients:any[]=[];

  constructor(private fb: FormBuilder,private adminService:AdminService) {}

  ngOnInit() {
    this.clientForm = this.fb.group({
      clienName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z\s]+$/),
        ],
      ],
    });

      this.adminService.getClients().subscribe(
      (data)=>{
        this.clients=data;
        console.log(data);
      });
  }


  get clientName() {
    return this.clientForm.get('clientName');
  }

  onSubmit() {
    if (this.clientForm.valid) {
      console.log(this.clientForm.value);
      alert('Client added!');
      this.clientForm.reset();
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
}
