export interface WorkDay {
  workDayId: WorkDayID;
  shiftWorked: boolean;
  day: Date;
  startTime: number;
  finishTime: number;
  shifDescription: string;
  active: boolean;
  workingDay: boolean;
  type: String;
}

export interface WorkDayID {
  contractorTypeId: string;
  contractorNumberId: string;
  shiftId: number;
  dayId: number;
}
