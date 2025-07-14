import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  error: string = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,Validators.maxLength(100)]],
      pass: ['', [Validators.required,Validators.minLength(8),
      Validators.maxLength(20)]]
    });
  }

  login(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.pass;

    if (email === 'admin123@gmail.com' && password === 'admin123') {

      this.authService.login(email, password).subscribe(
        () => {
          this.router.navigate(['/admin']);
        },
        (err) => {
          this.error = 'Login failed';
        }
      );
    } else {
      this.authService.login(email, password).subscribe(
        (res: any) => {
          if (res.status === 'success') {
            
          } else {
            this.error = 'Invalid login attempt';
          }
        },
        (err) => {
          this.error = 'Login failed';
        }
      );
    }
  }
}
