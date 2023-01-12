export interface ExtendedHour {
  id: number | null;
  contractorTypeId: String;
  contractorNumberId: String;
  startTime: number;
  finishTime: number;
  day: Date | null;
  description: String;
}
