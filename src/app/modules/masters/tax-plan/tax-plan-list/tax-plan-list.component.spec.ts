import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPlanListComponent } from './tax-plan-list.component';

describe('TaxPlanListComponent', () => {
  let component: TaxPlanListComponent;
  let fixture: ComponentFixture<TaxPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
