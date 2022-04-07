import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreportListComponent } from './salesreport-list.component';

describe('SalesreportListComponent', () => {
  let component: SalesreportListComponent;
  let fixture: ComponentFixture<SalesreportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesreportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
