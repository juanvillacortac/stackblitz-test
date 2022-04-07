import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxTableSelectorComponent } from './checkbox-table-selector.component';

describe('CheckboxTableSelectorComponent', () => {
  let component: CheckboxTableSelectorComponent;
  let fixture: ComponentFixture<CheckboxTableSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxTableSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
