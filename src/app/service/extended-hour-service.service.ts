import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDContractor } from '../interfaces/contractor.interface';
import { ExtendedHour } from '../interfaces/extended-hours.interface';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHourServiceService {
  constructor(private http: HttpClient) {}
  saveExtendedHour(eh: ExtendedHour): Observable<ExtendedHour> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<ExtendedHour>(
      `${environment.baseUrl}/${environment.extraHour}`,
      eh,
      httpOptions
    );
  }

  getExtendedHoursByContractor(
    idContractor: IDContractor
  ): Observable<ExtendedHour[]> {
    return this.http.get<ExtendedHour[]>(
      `${environment.baseUrl}/${environment.extraHour}/${idContractor.contractorTypeId}/${idContractor.contractorNumberId}`
    );
  }
}
