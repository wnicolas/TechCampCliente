import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/**
 * Importación de módulos de FullCalendar, PrimeNg y Shared
 */
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { SharedModule } from './shared/shared.module';
import { CalendarModule } from './calendar/calendar.module';

import { AppComponent } from './app.component';
import { TableListComponent } from './work-days/table-list/table-list.component';
import { ContratistasComponent } from './pages/contratistas/contratistas.component';
import { JornadaLaboralComponent } from './pages/jornada-laboral/jornada-laboral.component';
import { TableListContractorComponent } from './contractor/table-list-contractor/table-list-contractor.component';
import { LoginComponent } from './pages/login/login.component';
import { MassAssignmentComponent } from './work-days/mass-assignment/mass-assignment.component';

@NgModule({
  declarations: [
    AppComponent,
    TableListComponent,
    ContratistasComponent,
    JornadaLaboralComponent,
    TableListContractorComponent,
    LoginComponent,
    MassAssignmentComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule,
    SharedModule,
    HttpClientModule,
    CalendarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
