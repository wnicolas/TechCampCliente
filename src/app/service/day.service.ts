import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Day } from '../interfaces/day.interface';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  constructor(private http: HttpClient) {}
  /**
   *Recupera todos los días almacenados en la base de datos
   * @returns
   */
  getDays(): Observable<Day[]> {
    return this.http.get<Day[]>(`${environment.baseUrl}/${environment.day}`);
  }
  extendCalendar(): Observable<String> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<String>(
      `${environment.baseUrl}/${environment.day}`,
      null,
      httpOptions
    );
  }
}
