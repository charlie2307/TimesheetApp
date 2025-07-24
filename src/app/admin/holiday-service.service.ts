import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface GetHolidays
{
  holidays:Date[];
}
export interface Holiday{
  message:string;
}
interface SaturdayHolidayResponse {
  message: string;
  result: string;
}
@Injectable({
  providedIn: 'root'
})

export class HolidayServiceService {

  constructor(private http:HttpClient) { }
//   AddHoliday(newHoliday:string)
//   {
// return this.http.get("https://localhost:7038/api/Holiday/AddHoliday?newHoliday="+newHoliday);
//   }
AddHoliday(date: string):Observable<Holiday> {
  return this.http.post<Holiday>("https://localhost:7038/api/Holiday/AddHoliday", JSON.stringify(date), {
    headers: { 'Content-Type': 'application/json' }
  });
}
  RemoveHoliday(removeday: string):Observable<Holiday> {
  return this.http.delete<Holiday>("https://localhost:7038/api/Holiday/RemoveHoliday", {
    body: JSON.stringify(removeday),   // send string body
    headers: { 'Content-Type': 'application/json' }
  });
}
// getAllHolidays():Observable<GetHolidays>
// {
// return this.http.get<GetHolidays>("https://localhost:7038/api/Holiday/GetAllHolidays");
// }
 getAllMonths(): Observable<{ months: string[] }> {
    return this.http.get<{ months: string[] }>('https://localhost:7038/api/Holiday/GetAllHolidays');
  }

  // Method to get holidays for a specific month
  getHolidaysForMonth(month: string): Observable<GetHolidays> {
    return this.http.get<GetHolidays>("https://localhost:7038/api/Holiday/GetHolidaysByMonth?month="+month);
  }


addFixedHolidays(): Observable<any> {
  return this.http.post("https://localhost:7038/api/Holiday/AddFixedHolidays", {});
}
Addweeks(Weeks:any[]):Observable<SaturdayHolidayResponse>
{
  return this.http.post<SaturdayHolidayResponse>("https://localhost:7038/api/Holiday/AddSaturdayHolidays",Weeks);
}
}
