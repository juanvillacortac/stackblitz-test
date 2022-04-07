import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsLoadSingleComponent } from './incidents-load-single.component';

describe('IncidentsLoadSingleComponent', () => {
  let component: IncidentsLoadSingleComponent;
  let fixture: ComponentFixture<IncidentsLoadSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsLoadSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsLoadSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
