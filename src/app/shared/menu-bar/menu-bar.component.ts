import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SesionService } from 'src/app/service/sesion.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent implements OnInit {
  constructor(private session: SesionService) {}
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Contratistas',
        icon: 'pi pi-fw pi-user',
        routerLink: 'contratistas',
      },
      {
        label: 'Jornadas de trabajo',
        icon: 'pi pi-fw pi-calendar-plus',
        routerLink: 'jornada-laboral',
      },
    ];
  }
  cerrarSesion(){
    this.session.logout();
  }
}
