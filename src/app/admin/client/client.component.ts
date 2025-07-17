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
      client_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z\s]+$/),
        ],
      ],
      client_code: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9\s]+$/),
        ],
      ]
    });

    this.loadClient();
  }

  loadClient(){
    this.adminService.getClients().subscribe(
      (data)=>{
        this.clients=data;
        console.log(data);
      });
  }

  get client_code() {
    return this.clientForm.get('client_code');
  }
  get client_name() {
    return this.clientForm.get('client_name');
  }

  onSubmit():void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();  // show validation errors
      return;
    }

    const clientData = {
      client_code: this.clientForm.value.client_code, 
      client_name: this.clientForm.value.client_name
    };

    this.adminService.addClient(clientData).subscribe(
      (response) => {
        console.log('Client added successfully', response);
        alert('Client added successfully!');
        this.clientForm.reset();  // clear the form
      },
      (error) => {
        console.error('Error adding client', error);
        alert('Something went wrong while adding client.');
      }
    );
  }

  editBtn(){}

  deleteBtn(){}

}
