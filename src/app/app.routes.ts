import { Routes } from '@angular/router';
import { RegisterComponent } from './login/register/register.component';
import { LoginComponent } from './login/login/login.component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent }
];
