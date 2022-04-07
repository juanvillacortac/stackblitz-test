import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTabComponent } from './salary-tab.component';

describe('SalaryTabComponent', () => {
  let component: SalaryTabComponent;
  let fixture: ComponentFixture<SalaryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
