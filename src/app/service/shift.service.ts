import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shift } from '../interfaces/shift.interface';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(private http: HttpClient) {}
  getAllShift(): Observable<Shift[]> {
    return this.http.get<Shift[]>(
      `${environment.baseUrl}/${environment.shift}`
    );
  }
}
