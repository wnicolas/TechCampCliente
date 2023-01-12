import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
/**
 * Debido a un incoveniente con los estilos en estos plugins a los cuales aún no se les brinda soporte en angular 14,
 * en angular.json se tuvieron que agregar los estilos manualmente
 * https://github.com/fullcalendar/fullcalendar-angular/issues/403
 */
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from './calendar.component';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [CalendarComponent ],
  imports: [CommonModule, FullCalendarModule, FormsModule, PrimeNgModule],
  exports: [CalendarComponent],
})
export class CalendarModule {}
