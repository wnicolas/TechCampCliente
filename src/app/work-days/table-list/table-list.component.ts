import { Component, OnInit } from '@angular/core';
import { WorkDayService } from 'src/app/service/work-day.service';
import { WorkDay } from '../../interfaces/workday.interface';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
})
export class TableListComponent implements OnInit {
  constructor(private workDayService: WorkDayService) {}

  workDays: WorkDay[] = [];

  ngOnInit(): void {
    this.workDayService
      .getWorkDays()
      .subscribe((response) => (this.workDays = response));
  }
}
