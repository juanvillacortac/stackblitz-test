import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsLoadImportationComponent } from './incidents-load-importation.component';

describe('IncidentsLoadImportationComponent', () => {
  let component: IncidentsLoadImportationComponent;
  let fixture: ComponentFixture<IncidentsLoadImportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsLoadImportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsLoadImportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
