import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassAssignmentComponent } from './mass-assignment.component';

describe('MassAssignmentComponent', () => {
  let component: MassAssignmentComponent;
  let fixture: ComponentFixture<MassAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
