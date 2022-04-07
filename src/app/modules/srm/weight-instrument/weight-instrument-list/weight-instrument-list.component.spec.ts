import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightInstrumentListComponent } from './weight-instrument-list.component';

describe('WeightInstrumentListComponent', () => {
  let component: WeightInstrumentListComponent;
  let fixture: ComponentFixture<WeightInstrumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightInstrumentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightInstrumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
