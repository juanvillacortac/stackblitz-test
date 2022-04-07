import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLotValidationFactorComponent } from './new-lot-validation-factor.component';

describe('NewLotValidationFactorComponent', () => {
  let component: NewLotValidationFactorComponent;
  let fixture: ComponentFixture<NewLotValidationFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLotValidationFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLotValidationFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
