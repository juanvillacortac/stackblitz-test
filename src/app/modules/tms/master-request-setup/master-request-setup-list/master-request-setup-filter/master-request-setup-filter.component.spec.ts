import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRequestSetupFilterComponent } from './master-request-setup-filter.component';

describe('MasterRequestSetupFilterComponent', () => {
  let component: MasterRequestSetupFilterComponent;
  let fixture: ComponentFixture<MasterRequestSetupFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRequestSetupFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRequestSetupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
