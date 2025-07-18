import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminComponent } from '../../admin/admin/admin.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule,FormsModule,AdminComponent,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  email = '';
  password = '';
  error: string = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,Validators.maxLength(100)]],
      pass: ['', [Validators.required,Validators.minLength(8),
      Validators.maxLength(20)]]
    });
    // this.router.navigate(['/empDashboard']);
  }

  login(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.pass;
    

    if (email === 'admin123@gmail.com' && password === 'admin123') {
      window.location.href = '/admin';

      // this.authService.login(email, password).subscribe(
      //   () => {
      //     this.router.navigate(['/admin']);
      //   },
      //   (err) => {
      //     this.error = 'Login failed';
      //   }
      // );
    } else {
      
      this.authService.login(email, password).subscribe(
        (res: any) => {
          console.log("hiii "+res);
          if (res.role !== 'admin') {
              sessionStorage.setItem('EMP_NAME',res.emP_NAME);
            sessionStorage.setItem('EMP_ID',res.emP_ID);
            sessionStorage.setItem('EMP_ROLE',res.emP_ROLE);
            console.log(sessionStorage.getItem('EMP_ROLE'));
            console.log(sessionStorage.getItem('EMP_ID'));
            //console.log(sessionStorage.getItem('EMP_NAME'));
            this.router.navigate(['/empDashboard']);
              
          } else {
            this.error = 'Invalid login attempt';
          }
        },
        (err) => {
          this.error = 'Login failed';
          this.router.navigate(['/login']);
        }
      );
    }
  }

  // onLogin() {
  //   this.authService.login(this.email, this.password).subscribe({
  //     next: (res: any) => {
  //       // Here you can store in localStorage if you want
  //       localStorage.setItem('empId', res.empId);
  //       localStorage.setItem('roleId', res.roleId);
  //       this.router.navigate(['/empDashboard']);
  //     },
  //     error: err => {
  //       this.error = err.error.message || 'Login failed';
  //     }
  //   });
  // }

  
}
