import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnobIndicatorComponent } from './knob-indicator.component';

describe('KnobIndicatorComponent', () => {
  let component: KnobIndicatorComponent;
  let fixture: ComponentFixture<KnobIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnobIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnobIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
