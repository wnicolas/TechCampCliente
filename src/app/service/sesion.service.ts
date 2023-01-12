import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../interfaces/admin.interface';
import { Contractor } from '../interfaces/contractor.interface';
import { Session } from '../interfaces/sesion.interface';
import { ContractorService } from './contractor.service';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  session: Session = {
    user: null,
    userType: null,
    state: 'INACTIVE',
    message: 'Sesión inactiva.',
  };
  constructor(private contractorService: ContractorService,private router:Router) {
    let s = localStorage.getItem('SESSION');
    if (s) {
      let aux = JSON.parse(s);
      this.session = {
        user: aux.user,
        state: aux.state,
        message: aux.message,
        userType: aux.userType,
      };
    }
    console.log(this.session);
  }
  user!: Admin | Contractor | null;

  //Definición de admins para simulación de login
  admins: Admin[] = [
    {
      adminTypeId: 'C.C',
      adminNumberId: '79743812',
      name: 'JUAN DANIEL',
      surname: 'ÁVILA SÁNCHEZ',
    },
    {
      adminTypeId: 'C.C',
      adminNumberId: '52198478',
      name: 'CAMILA ANDREA',
      surname: 'BERNAL GÓMEZ',
    },
  ];
  contractors: Contractor[] = [];

  login(
    userTypeId: string,
    userNumberId: string,
    password: string,
    userType: string
  ) {
    this.user = null;

    if (userType == 'Contratista') {
      this.contractorService.getContractors().subscribe((response) => {
        this.contractors = response;
        let contractor = this.contractors.find(
          (contractor) =>
            contractor.id.contractorTypeId == userTypeId &&
            contractor.id.contractorNumberId == userNumberId &&
            password == contractor.id.contractorNumberId
        );

        if (contractor) {
          this.session = {
            user: contractor,
            userType: 'Contratista',
            state: 'ACTIVE',
            message: 'Inicio de sesión correcto.',
          };
          this.user = contractor;
        } else {
          this.session = {
            user: null,
            userType: null,
            state: 'REFUSED',
            message: 'Usuario o contraseña de administrador incorrectos.',
          };
          this.user = null;
        }
        localStorage.setItem('SESSION', JSON.stringify(this.session));
      });
    } else if (userType == 'Administrador') {
      let admin = this.admins.find(
        (admin) =>
          admin.adminTypeId == userTypeId &&
          admin.adminNumberId == userNumberId &&
          password == admin.adminNumberId
      );
      if (admin) {
        this.session = {
          user: admin,
          userType: 'Administrador',
          state: 'ACTIVE',
          message: 'Inicio de sesión correcto.',
        };
        this.user = admin;
      } else {
        this.session = {
          user: null,
          userType: null,
          state: 'REFUSED',
          message: 'Usuario o contraseña de administrador incorrectos.',
        };
        this.user = null;
      }
      localStorage.setItem('SESSION', JSON.stringify(this.session));
    }
  }
  logout(){
    localStorage.removeItem('SESSION');
    this.router.navigate(['']);
  }
}
