import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstgSalarytypesFilterComponent } from './mstg-salarytypes-filter.component';

describe('MstgSalarytypesFilterComponent', () => {
  let component: MstgSalarytypesFilterComponent;
  let fixture: ComponentFixture<MstgSalarytypesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstgSalarytypesFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstgSalarytypesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
