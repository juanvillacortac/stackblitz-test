import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryBandsFilterComponent } from './salary-bands-filter.component';

describe('SalaryBandsFilterComponent', () => {
  let component: SalaryBandsFilterComponent;
  let fixture: ComponentFixture<SalaryBandsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryBandsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryBandsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
