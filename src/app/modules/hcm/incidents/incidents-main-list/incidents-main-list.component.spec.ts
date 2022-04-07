import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsMainListComponent } from './incidents-main-list.component';

describe('IncidentsMainListComponent', () => {
  let component: IncidentsMainListComponent;
  let fixture: ComponentFixture<IncidentsMainListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsMainListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsMainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
