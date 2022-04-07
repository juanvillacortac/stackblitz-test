import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableIndicatorComponent } from './table-indicator.component';

describe('TableIndicatorComponent', () => {
  let component: TableIndicatorComponent;
  let fixture: ComponentFixture<TableIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
