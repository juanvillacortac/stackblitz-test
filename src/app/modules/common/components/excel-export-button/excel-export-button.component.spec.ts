import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelExportButtonComponent } from './excel-export-button.component';

describe('ExcelExportButtonComponent', () => {
  let component: ExcelExportButtonComponent;
  let fixture: ComponentFixture<ExcelExportButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelExportButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelExportButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
