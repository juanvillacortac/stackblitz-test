import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearTreeComponent } from './fiscal-year-tree.component';

describe('FiscalYearTreeComponent', () => {
  let component: FiscalYearTreeComponent;
  let fixture: ComponentFixture<FiscalYearTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiscalYearTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
