import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
    standalone: true,
})
export class AdminDashboardComponent implements OnInit{

  dailyTimesheet:any[]=[];
  hours:number=0;
  constructor(private adminService:AdminService){}

  ngOnInit(): void {
    this.adminService.getAllDailyTimesheet().subscribe(
      (data)=>{
        this.dailyTimesheet=data;
        this.dailyTimesheet = data.map((ts: any) => {
        return {
          ...ts,
          hoursValue: ts.hours === 1 ? 'Full' : ts.hours === 2 ? 'Split' : ''
        };
      });
        console.log(this.dailyTimesheet);
      },(err)=>{
        console.error(err);
      }
    )

    
  }


}
