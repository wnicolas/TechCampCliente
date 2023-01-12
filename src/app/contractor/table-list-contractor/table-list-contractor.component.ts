import { Component, OnInit } from '@angular/core';
import { Contractor } from 'src/app/interfaces/contractor.interface';
import { ContractorService } from 'src/app/service/contractor.service';
import { WorkDayService } from 'src/app/service/work-day.service';

@Component({
  selector: 'app-table-list-contractor',
  templateUrl: './table-list-contractor.component.html',
  styleUrls: ['./table-list-contractor.component.css'],
})
export class TableListContractorComponent implements OnInit {
  constructor(
    private contractorService: ContractorService,
    private workDayService: WorkDayService
  ) {}

  allContractors: any[] = [];
  contractors: any[] = [];
  assignInformation: any[] = [];
  massAssignmentState:
    | 'Executing'
    | 'Canceled'
    | 'Inactive'
    | 'Contractors Selected' = 'Inactive';

  displayModalWorkDay: boolean = false;
  initialDate!: Date;
  finalDate!: Date;

  ngOnInit(): void {
    this.initTable();
  }
  initTable() {
    this.contractorService.getContractors().subscribe((response) => {
      this.allContractors = response;
      this.contractors = response;
      this.contractorService
        .getContractorsInformationAssignment()
        .subscribe((response) => {
          this.assignInformation = response;
          this.mapInformationAssignmentToContractors();
        });
    });
  }

  mapInformationAssignmentToContractors() {
    this.contractors.map((contractor) =>
      this.assignHoursToContractor(contractor)
    );
  }

  assignHoursToContractor(contractor: Contractor) {
    let info = this.assignInformation.find(
      (info) =>
        contractor.id.contractorTypeId == info.CONTRACTOR_TYPE_ID &&
        contractor.id.contractorNumberId == info.CONTRACTOR_NUMBER_ID
    );
    contractor.assignedHours = info ? info.HORAS_ASIGNADAS : 0;
    return contractor;
  }

  massAssignment(state: String) {
    if (state == 'Executing') {
      this.massAssignmentState = 'Executing';
      this.contractors = this.allContractors.filter(
        (contractor) => contractor.contractorType == 'SUPERVISOR'
      );
    } else if (state == 'Inactive') {
      this.deactivateMassAssignment();
    } else if (state == 'Contractors Selected') {
      this.massAssignmentState = 'Contractors Selected';
      this.displayModalWorkDay = true;
    }
  }

  saveMassAssign() {
    //Se llama a los supervisores que fueron seleccionados. A este punto, this.contractors ya ha sido filtrado para que muestre a los SUPERVISORES
    let supervisors = this.contractors.filter(
      (supervisor) => supervisor.selected == true
    );
    let now: Date = new Date(Date.now()); //Establece la fecha de hoy para que pueda ser luego comparada
    if (this.initialDate > now) {
      if (this.initialDate < this.finalDate) {
        this.workDayService
          .assignMassOfficeShift(supervisors, this.initialDate, this.finalDate)
          .subscribe((res) => {
            this.deactivateMassAssignment();
            this.initTable();
            this.displayModalWorkDay = false;
            alert("Horarios de oficina asignados correctamente")
          });
      } else {
        alert('La fecha final debe ser posterior a la fecha inicial.');
      }
    } else {
      alert('La fecha inicial debe ser posterior a la fecha actual.');
    }
  }
  deactivateMassAssignment() {
    this.massAssignmentState = 'Inactive';
    this.contractors = this.allContractors;
  }
}
