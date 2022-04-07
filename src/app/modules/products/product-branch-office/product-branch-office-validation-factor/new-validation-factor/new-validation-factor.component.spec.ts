import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewValidationFactorComponent } from './new-validation-factor.component';

describe('NewValidationFactorComponent', () => {
  let component: NewValidationFactorComponent;
  let fixture: ComponentFixture<NewValidationFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewValidationFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewValidationFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
