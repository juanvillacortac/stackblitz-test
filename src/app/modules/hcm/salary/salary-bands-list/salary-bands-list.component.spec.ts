import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryBandsListComponent } from './salary-bands-list.component';

describe('SalaryBandsListComponent', () => {
  let component: SalaryBandsListComponent;
  let fixture: ComponentFixture<SalaryBandsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryBandsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryBandsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
