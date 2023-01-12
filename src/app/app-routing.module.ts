import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratistasComponent } from './pages/contratistas/contratistas.component';
import { JornadaLaboralComponent } from './pages/jornada-laboral/jornada-laboral.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'contratistas', component: ContratistasComponent },
  { path: 'jornada-laboral', component: JornadaLaboralComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
