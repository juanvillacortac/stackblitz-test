import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDriverFilterComponent } from './master-driver-filter.component';

describe('MasterDriverFilterComponent', () => {
  let component: MasterDriverFilterComponent;
  let fixture: ComponentFixture<MasterDriverFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDriverFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDriverFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
