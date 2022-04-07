import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreportFilterComponent } from './salesreport-filter.component';

describe('SalesreportFilterComponent', () => {
  let component: SalesreportFilterComponent;
  let fixture: ComponentFixture<SalesreportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesreportFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
