import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

  clientForm!: FormGroup;
  clients:any[]=[];
  isEditing: boolean = false;
  editingClientId: number | null = null;

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

  

  get clienT_CODE() {
    return this.clientForm.get('clienT_CODE');
  }
  get clienT_NAME() {
    return this.clientForm.get('clienT_NAME');
  }

  loadClient(){
    this.adminService.getClients().subscribe(
      (data)=>{
        this.clients=data;
        console.log(data);
      });
  }

  onSubmit() {
    if (this.clientForm.valid) {

      console.log(this.clientForm.value)

      if (this.clientForm.invalid) {
        this.clientForm.markAllAsTouched();
        return;
      }

      const formData = this.clientForm.value;
      console.log('Submitting client:', formData);


      this.adminService.addClient(formData).subscribe({
        next: (res) => {
          alert('Client added successfully!');
          this.clientForm.reset();
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Failed to add client');
        }
      });

      // this.adminService.addEmployee(this.employeeForm.value).subscribe(
      //   (data) => {
      //     console.log('Form Submitted:', this.employeeForm.value);
      //     alert('Employee registered successfully!');
      //     this.employeeForm.reset();
      //   },
      //   (err) => {
      //     this.employeeForm.markAllAsTouched();
      //     console.error('Registration error:', err);
      //     alert('Registration failed. Please try again.');
      //   }
      // );
      this.clientForm.reset();
    } else {
      this.clientForm.markAllAsTouched();
    }
  }

  updateBtn() {
    if (this.clientForm.valid) {

      console.log(this.clientForm.value)

      const formData = {
        clienT_ID: this.editingClientId, // 👈 include employee ID
        ...this.clientForm.value
      };
      console.log('Submitting client:', formData);


      this.adminService.updateClient(formData).subscribe({
        next: (res) => {
          console.log("hii " + res.message);
          alert('Client updated successfully!');
          this.clientForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update client');
        }
      });
      this.clientForm.reset();
    }
    else {
      this.clientForm.markAllAsTouched();
    }
  }

  editBtn(client: any) {
    this.isEditing = true;
    this.editingClientId = client.client_ID;

    this.clientForm.patchValue({
      clienT_NAME: client.clienT_NAME,
      clienT_CODE: client.clienT_CODE
    });
  }

  deleteBtn(ID: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.adminService.deleteClient(ID).subscribe({
        next: (res) => {
          alert(res);
          this.loadClient(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete client');
        }
      });
    }
  }

  resetForm() {
    this.clientForm.reset();
    this.isEditing = false;
    this.editingClientId = null;
  }

}
