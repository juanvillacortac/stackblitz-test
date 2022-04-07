import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsMainFilterComponent } from './incidents-main-filter.component';

describe('IncidentsMainFilterComponent', () => {
  let component: IncidentsMainFilterComponent;
  let fixture: ComponentFixture<IncidentsMainFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsMainFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsMainFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
