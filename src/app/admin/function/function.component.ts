import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

interface FunctionEntry {
  fuN_NAME: string;
  rolE_NAME: string;
}

@Component({
  selector: 'app-function',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './function.component.html',
  styleUrl: './function.component.css'
})
export class FunctionComponent implements OnInit {
  functionForm!: FormGroup;
  functions: any[] = [];
  roles: any[] = [];
  isEditing: boolean = false;
  editingFunId: number | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.functionForm = this.fb.group({
      fuN_NAME: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z\s]+$/)
        ]
      ],
      rolE_NAME: ['', Validators.required]
    });

    this.loadFunctions();
    this.loadRoles();

    
  }

  loadFunctions(){
    this.adminService.getFunctions().subscribe(data => {
      this.functions = data;
      console.log(data);
    });
  }
  loadRoles(){
    this.adminService.getRoles().subscribe(data => {
      this.roles = data;
      console.log(data);
    });
  }

  get fuN_NAME() {
    return this.functionForm.get('fuN_NAME');
  }

  get rolE_NAME() {
    return this.functionForm.get('rolE_NAME');
  }

  // onSubmit() {
  //   if (this.functionForm.valid) {
  //     const entry: FunctionEntry = {
  //       functionName: this.functionName?.value.trim(),
  //       role: this.role?.value
  //     };

  //     // prevent duplicates
  //     if (
  //       this.functions.some(
  //         f =>
  //           f.functionName.toLowerCase() === entry.functionName.toLowerCase() &&
  //           f.role === entry.role
  //       )
  //     ) {
  //       alert('This function & role combination already exists!');
  //       return;
  //     }

  //     this.functions.push(entry);
  //     this.functionForm.reset();
  //   } else {
  //     this.functionForm.markAllAsTouched();
  //   }
  // }


  
  onSubmit(): void {
    if (this.functionForm.valid) {
      const entry: FunctionEntry = {
        fuN_NAME: this.fuN_NAME?.value.trim(),
        rolE_NAME: this.rolE_NAME?.value
      };
      
      // prevent duplicates
      if (
        this.functions.some(
          f =>
            f.fuN_NAME.toLowerCase() === entry.fuN_NAME.toLowerCase() &&
            f.rolE_NAME === entry.rolE_NAME
        )
      ) {
        alert('This function & role combination already exists!');
        return;
      }
      this.adminService.addFunction(this.functionForm.value).subscribe(
      (response) => {
        console.log('Function added successfully', response);
        alert('Function added successfully!');
        this.functionForm.reset();  // clear the form
      },
      (error) => {
        console.error('Error adding function', error);
        alert('Something went wrong while adding function.');
      }
    );
    }
    else{
      this.functionForm.markAllAsTouched();  // show validation errors
    }        
  }

  updateEmp() {
    if (this.functionForm.valid) {

      console.log(this.functionForm.value)

      const formData = {
        FUN_ID: this.editingFunId, // 👈 include employee ID
        ...this.functionForm.value
      };
      console.log('Submitting employee:', formData);


      this.adminService.updateFunction(formData).subscribe({
        next: (res) => {
          console.log("hii " + res.message);
          alert('Function updated successfully!');
          this.functionForm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update function');
        }
      });
      this.functionForm.reset();
    }
    else {
      this.functionForm.markAllAsTouched();
    }
  }

  editEmp(fun: any) {
    this.isEditing = true;
    this.editingFunId = fun.funN_ID; // assuming employee has emP_ID

    this.functionForm.patchValue({
      fuN_NAME: fun.fuN_NAME,
      rolE_ID: fun.rolE_ID
    });
  }

  deleteEmp(funID: number) {
    if (confirm('Are you sure you want to delete this function?')) {
      this.adminService.deleteFunction(funID).subscribe({
        next: (res) => {
          alert(res);
          this.loadFunctions(); // reload list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete function');
        }
      });
    }
  }

  resetForm() {
    this.functionForm.reset();
    this.isEditing = false;
    this.editingFunId = null;
  }
}
