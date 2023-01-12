import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
  EventAddArg,
} from '@fullcalendar/angular';
import { IDContractor } from '../interfaces/contractor.interface';
import { Day } from '../interfaces/day.interface';
import { Shift } from '../interfaces/shift.interface';
import { WorkDay } from '../interfaces/workday.interface';
import { DayService } from '../service/day.service';
import { ShiftService } from '../service/shift.service';
import { WorkDayService } from '../service/work-day.service';
import { WorkDayID } from 'src/app/interfaces/workday.interface';
import { SesionService } from '../service/sesion.service';
import { ExtendedHourServiceService } from '../service/extended-hour-service.service';
import { ExtendedHour } from '../interfaces/extended-hours.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  constructor(
    private dayService: DayService,
    private workDayService: WorkDayService,
    private cd: ChangeDetectorRef,
    private shiftService: ShiftService,
    private sessionService: SesionService,
    private extendedHourService: ExtendedHourServiceService
  ) {}
  @Input() workDays: WorkDay[] = [];
  @Input() idContractor!: IDContractor;

  notWorkedDays: any = []; //Almacena los días NO trabajados por el contratista
  workedDays: any = []; //Almacena los días trabajados por un contratista
  days!: Day[]; //Retorna los días disponibles en base de datos
  shift: Shift[] = []; //Retorna los turnos disponibles en base de datos
  extendedHours: ExtendedHour[] = [];
  events: EventInput[] = [];
  loading: boolean = true;
  displayEvent: boolean = false;
  displayExtendedHour: boolean = false;
  displayNewEvent: boolean = false;
  extendedHourDescription: String = '';
  newShift!: Shift;
  userType!: String | null;
  startExtended!: number;
  endExtended!: number;
  eventTypeCreated!: 'WORKDAY' | 'EXTENDED_HOUR' | 'UPDATED_WORKDAY';
  calendarOptions!: CalendarOptions;
  eventSelected!: EventApi;
  selectInfo!: DateSelectArg;

  ngOnInit(): void {
    this.workDayService.getNotWorkedDays().subscribe((res) => {
      this.notWorkedDays = res.filter((wd: any) => {
        return (
          wd.CONTRACTOR_TYPE_ID == this.idContractor.contractorTypeId &&
          wd.CONTRACTOR_NUMBER_ID == this.idContractor.contractorNumberId
        );
      });
    });
    this.workDayService.getWorkedDays().subscribe((res) => {
      this.workedDays = res.filter((wd: any) => {
        return (
          wd.CONTRACTOR_TYPE_ID == this.idContractor.contractorTypeId &&
          wd.CONTRACTOR_NUMBER_ID == this.idContractor.contractorNumberId
        );
      });
    });
    this.userType = this.sessionService.session.userType;
    //Llama todos los tipos de turnos desde la base de datos
    this.shiftService
      .getAllShift()
      .subscribe((response) => (this.shift = response));

    //Llama todos los días desde la base de datos para validar si son días laborales o no
    this.dayService.getDays().subscribe((response) => (this.days = response));
    this.extendedHourService
      .getExtendedHoursByContractor(this.idContractor)
      .subscribe((res) => (this.extendedHours = res));

    setTimeout(() => {
      this.workDays.forEach((workday) => {
        this.events.push(this.mapWorkDayToEvent(workday));
      });
      this.extendedHours.forEach((eh) =>
        this.events.push(this.mapExtendedHourToEvent(eh))
      );
      this.initCalendar();
      this.loading = false;
      this.cd.detectChanges();
    }, 400);
  }

  /**
   * Agrega un evento al calendario y este llama al método que guarda el Work Day en la base de datos.
   */
  saveEvent() {
    const calendarApi = this.selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    let shift = this.shift.find((s) => s.id == this.newShift.id);
    let day = this.days.find(
      (day) =>
        day.day.toString() == this.selectInfo.startStr && day.workingDay == true
    );
    if (shift && day) {
      this.eventTypeCreated = 'WORKDAY';
      calendarApi.addEvent({
        id: `${this.idContractor.contractorTypeId}-${this.idContractor.contractorNumberId}-${shift.id}-${day.id}-0`,
        title:
          'Turno: ' +
          shift.type +
          ' (' +
          shift.startTime +
          ':00 a ' +
          shift.finishTime +
          ':00)',
        start: this.selectInfo.startStr,
        end: this.selectInfo.endStr,
        allDay: this.selectInfo.allDay,
      });

      this.displayNewEvent = false;
    }
  }

  /**
   *Cuando un evento es creado en el calendar, este método es invocado automáticamente para guardar los datos del Work Day en la base de datos
   * @param eventAddArg
   */
  handleStoreEvents(eventAddArg: EventAddArg) {
    if (this.eventTypeCreated == 'WORKDAY') {
      let dayCalendar = eventAddArg.event.startStr;
      let dayId = this.dateToDayId(dayCalendar);
      let data = {
        contractorTypeId: this.idContractor.contractorTypeId,
        contractorNumberId: this.idContractor.contractorNumberId,
        shiftId: this.newShift.id,
        dayId: dayId,
        shiftWorked: 0,
      };
      this.workDayService
        .saveWorkDay(data)
        .subscribe((res) => console.log(res));
    }
  }

  /**
   * Actualiza la información de un evento en base de datos
   */
  updateEvent() {
    //Separa las claves del id del evento en un array
    let aux = this.eventSelected.id.split('-');
    let workDayId: WorkDayID = {
      contractorTypeId: aux[0],
      contractorNumberId: aux[1],
      shiftId: this.newShift.id,
      dayId: parseInt(aux[3]),
    };
    //TODO En la actualización poner el valor real del ShiftWorked
    this.workDayService
      .updateWorkDay(this.eventSelected.id, workDayId, 0)
      .subscribe((res) => {
        console.log(res);
        this.hiddeDialogEvent();
        this.eventSelected.remove();
        let calendarApi = this.eventSelected._context.calendarApi;
        this.eventTypeCreated = 'UPDATED_WORKDAY';
        calendarApi.addEvent(this.mapWorkDayIdToEvent(workDayId));
        this.initValuesAfterModifyEvent();
      });
  }
  /**
   * Elimina un evento del calendario y de la base de datos
   */
  deleteEvent() {
    let aux = this.eventSelected.id.split('-');

    let workDayId: WorkDayID = {
      contractorTypeId: aux[0],
      contractorNumberId: aux[1],
      shiftId: parseInt(aux[2]),
      dayId: parseInt(aux[3]),
    };

    this.workDayService.deleteWorkDay(workDayId).subscribe((res) => {
      alert(res.mensaje);
      this.eventSelected.remove();
      this.hiddeDialogEvent();
      this.initValuesAfterModifyEvent();
    });
  }

  /**
   * Inicializa un evento para el contratista
   */
  startEvent() {
    let aux: string | boolean = this.eventSelected.id.split('-')[4];
    if (aux == 'true') {
      aux = true;
    } else {
      aux = false;
    }
    if (aux == true) {
      alert('El turno ya había sido iniciado.');
      this.displayEvent = false;
    } else {
      this.workDayService
        .startWorkDay(this.mapEventIdToWorkDayId(this.eventSelected.id))
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this.workDayService
              .getNotWorkedDays()
              .subscribe((res) => (this.notWorkedDays = res));
            this.workDayService
              .getWorkedDays()
              .subscribe((res) => (this.workedDays = res));
            alert('Turno iniciado correctamente.');
            this.displayEvent = false;
          }
        });
    }
  }
  /**
   * Guarda la extensión de la jornada laboral en la base de datos.
   */
  extendShift() {
    let eh: ExtendedHour = {
      id: null,
      contractorTypeId: this.idContractor.contractorTypeId,
      contractorNumberId: this.idContractor.contractorNumberId,
      startTime: this.startExtended,
      finishTime: this.endExtended,
      day: this.eventSelected.start,
      description: this.extendedHourDescription,
    };
    this.extendedHourService.saveExtendedHour(eh).subscribe((res) => {
      this.extendedHourService
        .getExtendedHoursByContractor(this.idContractor)
        .subscribe((res) => (this.extendedHours = res));
      alert('La ampliación de horario se ha guardado satisfactoriamente.');
      this.hiddeDialogEvent();
      if (res) {
        let event: EventInput = {
          id: `${res.id}`,
          title:
            'Turno: HE' +
            ' (' +
            res.startTime +
            ':00 a ' +
            res.finishTime +
            ':00)',
          date: Date.parse(res.day + 'T00:00:00'),
        };
        this.eventTypeCreated = 'EXTENDED_HOUR';
        this.eventSelected._context.calendarApi.addEvent(event);
        this.initValuesAfterModifyEvent();
      }
    });
  }
  /**
   *
   */
  /**
   *################################## FUNCIONES ENCARGADAS DE MANEJAR LOS EVENTOS CUANDO EL USUARIO INTERACTÚA CON EL CALENDARIO ######################################
   */
  /**
  /**
   *Maneja los eventos que suceden cuando se selecciona una fecha
   * @param selectInfo
   */
  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectInfo = selectInfo;
    this.showDialogNewEvent();
  }

  /**
   * Maneja lo que sucede cuando se da click a un evento en el calendario
   * @param clickInfo
   */
  handleEventClick(clickInfo: EventClickArg) {
    let eventSelected = clickInfo.event;
    this.showDialogEvent(eventSelected);
    //clickInfo.event.remove();
  }
  /**
   *
   */
  /**
   *################################## FUNCIONES ENCARGADAS DE HACER LOS MAPEOS NECESARIOS PARA LA VISUALIZACIÓN DE LA DATA EN EL CALENDARIO ######################################
   */
  /**
   *Mapea una jornda laboral en un event que puede ser leído e interpretado por el calendar
   * @param workDay
   * @returns
   */
  mapEventIdToWorkDayId(id: String): WorkDayID {
    let params: string[] = id.split('-');
    let workDayId: WorkDayID = {
      contractorTypeId: params[0],
      contractorNumberId: params[1],
      shiftId: parseInt(params[2]),
      dayId: parseInt(params[3]),
    };
    return workDayId;
  }
  /**
   *Mapea una jornda laboral en un event que puede ser leído e interpretado por el calendar
   * @param workDay
   * @returns
   */
  mapWorkDayToEvent(workDay: WorkDay): EventInput {
    let event: EventInput = {
      id: `${workDay.workDayId.contractorTypeId}-${workDay.workDayId.contractorNumberId}-${workDay.workDayId.shiftId}-${workDay.workDayId.dayId}-${workDay.shiftWorked}`,
      title:
        'Turno: ' +
        workDay.type +
        ' (' +
        workDay.startTime +
        ':00 a ' +
        workDay.finishTime +
        ':00)',
      date: workDay.day,
    };
    return event;
  }

  /**
   *Mapea una jornada extendida en un event que puede ser leído e interpretado por el calendar
   * @param eh
   * @returns
   */
  mapExtendedHourToEvent(eh: ExtendedHour): EventInput {
    let event: EventInput;
    event = {
      id: `${eh.id}`,

      title:
        'Turno: HE' + ' (' + eh.startTime + ':00 a ' + eh.finishTime + ':00)',
      date: Date.parse(eh.day + 'T00:00:00'),
    };
    return event;
  }
  /**
   *Mapea el id de una jornada laboral en un event que puede ser leído e interpretado por el calendar
   * @param workDayId
   * @returns
   */
  mapWorkDayIdToEvent(workDayId: WorkDayID): EventInput {
    let shift = this.shift.find((s) => s.id == workDayId.shiftId);
    let day = this.days.find((d) => d.id == workDayId.dayId);
    let event: EventInput = {};
    if (shift && day) {
      event = {
        id: `${workDayId.contractorTypeId}-${workDayId.contractorNumberId}-${workDayId.shiftId}-${workDayId.dayId}-0`,

        title:
          'Turno: ' +
          shift.type +
          ' (' +
          shift.startTime +
          ':00 a ' +
          shift.finishTime +
          ':00)',

        date: day.day,
      };
    }
    return event;
  }
  /**
   *Convierte una fecha a Id que puede ser interpretado por la base de datos.
   * @param date
   * @returns
   */
  dateToDayId(date: string) {
    let day = this.days.find(
      (day) => day.day.toString() == date && day.workingDay == true
    );
    if (day) {
      return day.id;
    } else {
      return null;
    }
  }
  /**
   *
   */
  /**
   *########################################################## INICIALIZACIONES #############################################################################
   */
  /**
  /**
   * Inicializa el calendario con las diferentes opciones que permiten su correcto funcionamiento
   */
  initCalendar() {
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'dayGridMonth',
      events: [...this.events],
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventColor: '#008C44',
      eventBorderColor: '#FDDA5B',
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventAdd: this.handleStoreEvents.bind(this),
    };
  }
  /**
   * Inicializa los valores por defecto luego de realizar una adición de una jornada extendida
   */
  initValuesAfterModifyEvent() {
    this.newShift = this.shift[0];
    this.startExtended = 0;
    this.endExtended = 0;
    this.extendedHourDescription = '';
  }
  /**
   *
   */
  /**
   *################################## VISUALIZACIÓN Y OCULTAMIENTO DE MODALES ######################################
   */
  showDialogNewEvent() {
    let dayCalendar = this.selectInfo.startStr;
    let dayId = this.dateToDayId(dayCalendar);
    if (dayId) {
      this.displayNewEvent = true;
    } else {
      alert('Este día NO es laboral');
    }
  }

  hiddeDialogNewEvent() {
    this.displayNewEvent = false;
  }

  showDialogEvent(event: EventApi) {
    this.eventSelected = event;
    if (event.id.split('-').length == 1) {
      let id = parseInt(event.id.split('-')[0]);
      let ext = this.extendedHours.find((eh) => eh.id == id);
      console.log(ext);
      if (ext) {
        this.startExtended = ext.startTime;
        this.endExtended = ext.finishTime;
        this.extendedHourDescription = ext.description;
      }
      //Es una jornada extendida ya que solo tiene un parametro en el Id
      this.displayExtendedHour = true;
    } else if (event.id.split('-').length == 5) {
      //Es un work day ya que tiene cinco parametros en el id
      this.displayEvent = true;
    }
  }
  hiddeDialogEvent() {
    this.displayEvent = false;
  }
}
