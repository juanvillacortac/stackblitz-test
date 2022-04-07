import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryBandsPanelComponent } from './salary-bands-panel.component';

describe('SalaryBandsPanelComponent', () => {
  let component: SalaryBandsPanelComponent;
  let fixture: ComponentFixture<SalaryBandsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryBandsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryBandsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
