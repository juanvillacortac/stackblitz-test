import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPanelValidationrangeComponent } from './filters-panel-validationrange.component';

describe('FiltersPanelValidationrangeComponent', () => {
  let component: FiltersPanelValidationrangeComponent;
  let fixture: ComponentFixture<FiltersPanelValidationrangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersPanelValidationrangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPanelValidationrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
