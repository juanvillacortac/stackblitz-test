import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRangeComponent } from './validation-range.component';

describe('ValidationRangeComponent', () => {
  let component: ValidationRangeComponent;
  let fixture: ComponentFixture<ValidationRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
