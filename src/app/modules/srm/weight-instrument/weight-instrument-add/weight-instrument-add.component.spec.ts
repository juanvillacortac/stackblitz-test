import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightInstrumentAddComponent } from './weight-instrument-add.component';

describe('WeightInstrumentAddComponent', () => {
  let component: WeightInstrumentAddComponent;
  let fixture: ComponentFixture<WeightInstrumentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightInstrumentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightInstrumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
