import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    MenubarModule,
    CardModule,
    FileUploadModule,
    SelectButtonModule,
    DropdownModule,
    DialogModule,
    CheckboxModule,
    CalendarModule,
    SliderModule,
    InputTextareaModule,
    CascadeSelectModule,
    TooltipModule
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    TableModule,
    MenubarModule,
    CardModule,
    FileUploadModule,
    SelectButtonModule,
    DropdownModule,
    DialogModule,
    CheckboxModule,
    CalendarModule,
    SliderModule,
    InputTextareaModule,
    CascadeSelectModule,
    TooltipModule
  ],
})
export class PrimeNgModule {}
