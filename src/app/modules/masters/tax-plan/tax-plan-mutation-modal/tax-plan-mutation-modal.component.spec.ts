import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPlanMutationModalComponent } from './tax-plan-mutation-modal.component';

describe('TaxPlanModalComponent', () => {
  let component: TaxPlanMutationModalComponent;
  let fixture: ComponentFixture<TaxPlanMutationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPlanMutationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPlanMutationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
