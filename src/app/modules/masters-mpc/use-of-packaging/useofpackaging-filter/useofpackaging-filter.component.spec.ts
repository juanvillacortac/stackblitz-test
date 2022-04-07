import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseofpackagingFilterComponent } from './useofpackaging-filter.component';

describe('UseofpackagingFilterComponent', () => {
  let component: UseofpackagingFilterComponent;
  let fixture: ComponentFixture<UseofpackagingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseofpackagingFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseofpackagingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
