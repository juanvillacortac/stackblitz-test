import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPlanTreeComponent } from './tax-plan-tree.component';

describe('TaxPlanTreeComponent', () => {
  let component: TaxPlanTreeComponent;
  let fixture: ComponentFixture<TaxPlanTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPlanTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPlanTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
