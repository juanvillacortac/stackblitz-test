import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearMutationModalComponent } from './fiscal-year-mutation-modal.component';

describe('FiscalYearMutationModalComponent', () => {
  let component: FiscalYearMutationModalComponent;
  let fixture: ComponentFixture<FiscalYearMutationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiscalYearMutationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearMutationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
