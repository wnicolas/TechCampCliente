import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contractor } from '../interfaces/contractor.interface';

@Injectable({
  providedIn: 'root',
})
export class ContractorService {
  constructor(private http: HttpClient) {}
  getContractorsInformationAssignment(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.baseUrl}/${environment.workDay}/information-assign`
    );
  }

  getContractors(): Observable<Contractor[]> {
    return this.http.get<Contractor[]>(
      `${environment.baseUrl}/${environment.workDay}/contractors`
    );
  }
}
