import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionFiltersComponent } from './reception-filters.component';

describe('ReceptionFiltersComponent', () => {
  let component: ReceptionFiltersComponent;
  let fixture: ComponentFixture<ReceptionFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
