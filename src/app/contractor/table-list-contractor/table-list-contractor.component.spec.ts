import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListContractorComponent } from './table-list-contractor.component';

describe('TableListContractorComponent', () => {
  let component: TableListContractorComponent;
  let fixture: ComponentFixture<TableListContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableListContractorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableListContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
