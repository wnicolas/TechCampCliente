import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { IDContractor } from 'src/app/interfaces/contractor.interface';
import { WorkDay } from 'src/app/interfaces/workday.interface';
import { DayService } from 'src/app/service/day.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { WorkDayService } from 'src/app/service/work-day.service';

@Component({
  selector: 'app-jornada-laboral',
  templateUrl: './jornada-laboral.component.html',
  styleUrls: ['./jornada-laboral.component.css'],
})
export class JornadaLaboralComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private workDayService: WorkDayService,
    private dayService: DayService,
    private uploadService: FileUploadService
  ) {}

  thereIsContractor: boolean = false;
  queryObj: any;
  workDays!: WorkDay[];
  idContractor: IDContractor = { contractorTypeId: '', contractorNumberId: '' };
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.queryObj = { ...params };
    });
    if (this.queryObj.params.type_id && this.queryObj.params.number_id) {
      this.thereIsContractor = true;
      this.idContractor.contractorTypeId = this.queryObj.params.type_id;
      this.idContractor.contractorNumberId = this.queryObj.params.number_id;
      this.workDayService
        .getWorkDaysById(this.idContractor)
        .subscribe((response) => {
          this.workDays = response;
        });
      this.fileInfos = this.uploadService.getFiles();
    } else {
      this.thereIsContractor = false;
    }
  }

  myUploader(e: Event) {
    alert('Hola mundo');
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          },
        });
      }

      this.selectedFiles = undefined;
    }
  }

  extendCalendar() {
    this.dayService.extendCalendar().subscribe((res) => console.log(res));
  }
}
