import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkDay, WorkDayID } from '../interfaces/workday.interface';
import { IDContractor } from '../interfaces/contractor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkDayService {
  constructor(private http: HttpClient) {}
  /**
   *Recupera todos los turnos de trabajo junto con la información del contratista asignado a ese turno
   * @returns
   */
  getWorkDays(): Observable<WorkDay[]> {
    return this.http.get<WorkDay[]>(
      `${environment.baseUrl}/${environment.workDay}`
    );
  }
  /**
   *Recupera la información de los turnos de trabajo de un contratista en particular junto con la información de ese contratista en cada turno.
   * @param contractorId
   * @returns
   */
  getWorkDaysById(contractorId: IDContractor): Observable<WorkDay[]> {
    return this.http.get<WorkDay[]>(
      `${environment.baseUrl}/${environment.workDay}/contractors/${contractorId.contractorTypeId}/${contractorId.contractorNumberId}`
    );
  }
  /**
   *Guarda el workday en base de datos
   * @param data
   * @returns
   */
  saveWorkDay(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post<any>(
      `${environment.baseUrl}/${environment.workDay}`,
      data,
      httpOptions
    );
  }
  /**
   * Actualiza el Work Day en la base de datos
   * @param idOld
   * @param idNew
   * @param shiftWorked
   * @returns
   */
  updateWorkDay(
    idOld: string,
    idNew: WorkDayID,
    shiftWorked: number
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put<any>(
      `${environment.baseUrl}/${environment.workDay}/${idOld}`,
      { workDayId: idNew, shiftWorked: shiftWorked },
      httpOptions
    );
  }

  /**
   *Elimina de la base de datos un WorkDay
   * @param idWorkDay
   * @returns
   */
  deleteWorkDay(idWorkDay: WorkDayID): Observable<any> {
    return this.http.delete<any>(
      `${environment.baseUrl}/${environment.workDay}/${idWorkDay.contractorTypeId}/${idWorkDay.contractorNumberId}/${idWorkDay.shiftId}/${idWorkDay.dayId}`
    );
  }

  /**
   * Permite al contratista iniciar un turno de trabajo
   * @param id identificador del turno de trabajo
   * @returns
   */
  startWorkDay(id: WorkDayID): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put<any>(
      `${environment.baseUrl}/${environment.workDay}`,
      id,
      httpOptions
    );
  }

  /**
   * Asigna de manera masiva horarios dde oficina a determinados contratistas dada una fecha inicial y una fecha final
   * @param supervisors
   * @param initialDate
   * @param finalDate
   * @returns
   */
  assignMassOfficeShift(
    supervisors: any[],
    initialDate: Date,
    finalDate: Date
  ): Observable<WorkDay[]> {
    console.log(supervisors);
    //Conversión de fechas a formatos aceptados por el Backend YYYY-MM-DD
    let initial: String = `${initialDate.getFullYear()}-${
      initialDate.getMonth() + 1
    }-${initialDate.getDate()}`;

    let final: String = `${finalDate.getFullYear()}-${
      finalDate.getMonth() + 1
    }-${finalDate.getDate()}`;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post<WorkDay[]>(
      `${environment.baseUrl}/${environment.workDay}/mass-office-shift-assignment`,
      {
        contractorList: supervisors,
        initialDate: initial,
        finalDate: final,
      },
      httpOptions
    );
  }

  /**
   *Retorna los días NO trabajados por un contratista en el mes actual
   * @returns
   */
  getNotWorkedDays(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.baseUrl}/${environment.workDay}/not-worked-days`
    );
  }

  /**
   *Retorna los días trabajador por un contratista en el mes actual
   * @returns
   */
  getWorkedDays(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.baseUrl}/${environment.workDay}/worked-days`
    );
  }
}
