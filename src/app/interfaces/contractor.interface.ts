export interface Contractor {
  id: IDContractor;
  name: string;
  surname: string;
  contractorType: string;
  assignedHours: number;
}

export interface IDContractor {
  contractorTypeId: string;
  contractorNumberId: string;
}
