import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
emp_name:string | null=''
constructor()
{
this.emp_name=sessionStorage.getItem('EMP_NAME');
}
  logout(): void {
    sessionStorage.clear();
    window.location.href = '/login';
  }

}
