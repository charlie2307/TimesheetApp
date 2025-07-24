import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HolidayServiceService } from '../holiday-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage-holidays',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './manage-holidays.component.html',
  styleUrl: './manage-holidays.component.css',
  providers:[HolidayServiceService]
})
export class ManageHolidaysComponent {
  constructor(private http:HolidayServiceService)
  {

  }
  filteredHolidays: string[] = []; 
    groupedHolidays:any[]=[];
     months: string[] = [];
  Weeks:number[]=[];
val1:boolean=false;
val2:boolean=false;
val3:boolean=false;
val4:boolean=false;
  AllHolidays:any[]=[];
removeHolidayDate:string='';
AddHolidayDate:string='';
AddHoliday()
{
   if(this.AddHolidayDate=='')
   {
    alert("Please Select Date For Add Holiday");
   }
   else{
  if(confirm("Do You Want To Add This Date in Holidays?")){
  console.log(this.AddHolidayDate);
this.http.AddHoliday(this.AddHolidayDate).subscribe(response=>{
  alert(response.message);
},
error=>{
  console.log(error.error.message);
 alert(error.error.message);
}
)}}
}


RemoveDate()
{
  if(this.removeHolidayDate=='')
   {
    alert("Please Select Date For Remove Holiday");
   }
   else{
  if(confirm("Do You Want To remove Date From Holidays?")){
this.http.RemoveHoliday(this.removeHolidayDate).subscribe(response=>{
  const message=response;
 alert(message.message);
},error=>{
 console.log(error.error.message);
 alert(error.error.message);
})}}}
// GetAllHolidays()
// {
//   this.http.getAllHolidays().subscribe(response=>{
//     console.log(response);
//     this.AllHolidays=response.holidays;
    
//   },error=>{
//     console.log(error);
//   }
// )
// }

 GetAllMonths() {
    this.http.getAllMonths().subscribe(response=>{
      console.log(response);
      this.groupedHolidays=response.months;
      console.log(this.groupedHolidays);
    },error=>{
      console.log(error);
    })
  }

  getHolidaysForMonth(e:Event): void {
    const month=(e.target as HTMLInputElement).value;
 
    this.http.getHolidaysForMonth(month).subscribe(
      (response) => {
        this.AllHolidays = response.holidays; // Store holidays for selected month
        console.log('Holidays:', this.AllHolidays);

        // Now filter the holidays based on the selected month and year
        this.filteredHolidays = this.AllHolidays.filter(holiday => {
          const holidayDate = new Date(holiday); // Convert to Date object
          const selectedMonth = new Date(`${month}-01`); // Create a date object with selected month and year

          // Compare year and month (ignore the day)
          return holidayDate.getFullYear() === selectedMonth.getFullYear() &&
                 holidayDate.getMonth() === selectedMonth.getMonth();
        });

        console.log('Filtered Holidays:', this.filteredHolidays);
      },
      (error) => {
        console.error('Error fetching holidays:', error);
      }
    );
  }


AddGovernametHolidays()
{
  
this.http.addFixedHolidays().subscribe(response=>{
    // console.log(response);
    alert(response.message);
  },error=>{
    console.log(error.message);
    alert(error);
  })
  
  
}
SubmitWeeks()
{
  if (this.val1 &&!this.Weeks.includes(1)) this.Weeks.push(1);
  if (this.val2 && !this.Weeks.includes(2)) this.Weeks.push(2);
  if (this.val3 && !this.Weeks.includes(3)) this.Weeks.push(3);
  if (this.val4 && !this.Weeks.includes(4)) this.Weeks.push(4);
   if (this.Weeks.length === 0) {
    alert('Please select at least one week.');
    return;
  }
 
  else{
     
     if(confirm("Do You Want To Add This Week For Holiday?"))
     {
  this.http.Addweeks(this.Weeks).subscribe(response=>{
   const message=response.message;
    alert(message);
  },error=>{
   const message=error.message;
    alert(message);
  })
     }


}}

   


 }
