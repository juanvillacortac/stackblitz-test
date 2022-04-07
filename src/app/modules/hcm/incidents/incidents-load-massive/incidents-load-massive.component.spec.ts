import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsLoadMassiveComponent } from './incidents-load-massive.component';

describe('IncidentsLoadMassiveComponent', () => {
  let component: IncidentsLoadMassiveComponent;
  let fixture: ComponentFixture<IncidentsLoadMassiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsLoadMassiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsLoadMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
