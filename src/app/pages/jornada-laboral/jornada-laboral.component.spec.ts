import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JornadaLaboralComponent } from './jornada-laboral.component';

describe('JornadaLaboralComponent', () => {
  let component: JornadaLaboralComponent;
  let fixture: ComponentFixture<JornadaLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JornadaLaboralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JornadaLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
