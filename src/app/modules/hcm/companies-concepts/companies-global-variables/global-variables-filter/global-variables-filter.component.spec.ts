import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalVariablesFilterComponent } from './global-variables-filter.component';

describe('GlobalVariablesFilterComponent', () => {
  let component: GlobalVariablesFilterComponent;
  let fixture: ComponentFixture<GlobalVariablesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalVariablesFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalVariablesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
